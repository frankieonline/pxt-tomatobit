enum NeoPixelKnownColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}

enum LCD_AddressType {
    //% block="Auto Recognition (0)"
    auto = 0,
    //% block="PCF8574 (39)"
    PCF8574 = 39,
    //% block="PCF8574A (63)"
    PCF8574A = 63
}

enum NeoPixelMode {
    //% block="RGB (GRB format)"
    RGB = 0,
    //% block="RGB+W"
    RGBW = 1,
    //% block="RGB (RGB format)"
    RGB_RGB = 2
}

enum Servos {
    S1 = 0x01,
    S2 = 0x02,
    S3 = 0x03,
    S4 = 0x04,
    S5 = 0x05,
    S6 = 0x06,
    S7 = 0x07,
    S8 = 0x08
}

//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=["Robot:bit", "Component & Sensor", "mBridge", "LCD", "NeoPixel"]
namespace tomatobit {
    const PortDigi = [
        DigitalPin.P0, DigitalPin.P8,
        DigitalPin.P1, DigitalPin.P12,
        DigitalPin.P2, DigitalPin.P13,
        DigitalPin.P14, DigitalPin.P15
    ];

    const PortAnalog = [
        AnalogPin.P0,
        AnalogPin.P1,
        AnalogPin.P2
    ];

    const PCA9685_ADDRESS = 0x40;
    const MODE1 = 0x00;
    const MODE2 = 0x01;
    const SUBADR1 = 0x02;
    const SUBADR2 = 0x03;
    const SUBADR3 = 0x04;
    const PRESCALE = 0xFE;
    const LED0_ON_L = 0x06;
    const LED0_ON_H = 0x07;
    const LED0_OFF_L = 0x08;
    const LED0_OFF_H = 0x09;
    const ALL_LED_ON_L = 0xFA;
    const ALL_LED_ON_H = 0xFB;
    const ALL_LED_OFF_L = 0xFC;
    const ALL_LED_OFF_H = 0xFD;

    let distanceBuf = 0;

    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }

    class Strip {
        buf: Buffer;
        pin: DigitalPin;
        brightness: number;
        start: number; // start offset in LED strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any
        _matrixChain: number; // the connection type of matrix chain
        _matrixRotation: number; // the rotation type of matrix

        /** Shows all LEDs to a given color (range 0-255 for r, g, b).
        * @param rgb RGB color of the LED
        */
        //% blockId="neopixelShowColor" block="Robot:bit LEDs show color %rgb=getNeoPixelKnownColors"
        //% group="NeoPixel"
        //% weight=85 blockGap=8
        neopixelShowColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.neopixelShow();
        }

        /** Send all the changes to the strip. */
        //% blockId="neopixelShow" blockGap=8
        //% weight=79
        //% group="NeoPixel"
        neopixelShow() {
            sendBuffer(this.buf, this.pin);
        }

        /** Turn off all LEDs. You need to call "neopixelShow" to make the changes visible. */
        //% blockId="neopixelClear"
        neopixelClear() {
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            this.buf.fill(0, this.start * stride, this._length * stride);
        }

        setBufferRGB(offset: number, red: number, green: number, blue: number): void {
            if (this._mode === NeoPixelMode.RGB_RGB) {
                this.buf[offset + 0] = red;
                this.buf[offset + 1] = green;
            } else {
                this.buf[offset + 0] = green;
                this.buf[offset + 1] = red;
            }
            this.buf[offset + 2] = blue;
        }

        setAllRGB(rgb: number) {
            let red = unpackR(rgb);
            let green = unpackG(rgb);
            let blue = unpackB(rgb);

            const br = this.brightness;
            if (br < 255) {
                red = (red * br) >> 8;
                green = (green * br) >> 8;
                blue = (blue * br) >> 8;
            }
            const end = this.start + this._length;
            const stride = this._mode === NeoPixelMode.RGBW ? 4 : 3;
            for (let i = this.start; i < end; ++i) {
                this.setBufferRGB(i * stride, red, green, blue)
            }
        }

        setBrightness(brightness: number): void {
            this.brightness = brightness & 0xff;
        }

        setPin(pin: DigitalPin): void {
            this.pin = pin;
            pins.digitalWritePin(this.pin, 0);
        }
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }

    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }

    /** Get the RGB value of a NeoPixel known color
    * @param knownColor NeoPixel known color
    */
    //% block="%knownColor"
    //% blockId="getNeoPixelKnownColor"
    //% group="NeoPixel"
    //% weight=1
    //% parts="tomatobit"
    export function getNeoPixelKnownColor(knownColor: NeoPixelKnownColors):number {
        return knownColor;
    }

    /** Input RGB value of a color
    * @param red RGB value of red
    * @param green RGB value of green
    * @param blue RGB value of blue
    */
    //% block="RGB(red: %red|green: %green|blue: %blue|)"
    //% blockId="getRGBColor"
    //% group="NeoPixel"
    //% weight=1
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    //% parts="tomatobit"
    export function getRGBColor(red: number, green: number, blue: number):number {
        return packRGB(red, green, blue);
    }

    /** Set Robot:bit LEDs
    * @param start offset in the Robot:bit LEDs to start the range
    * @param length number of LEDs in the range. max: 4
    * @param rgb RGB color of the LEDs
    */
    //% block="Set Robot:bit LEDs range from %start|with %length|LEDs show color %rgb=getNeoPixelKnownColor"
    //% blockId="setLEDs"
    //% group="NeoPixel"
    //% weight=2
    //% start.min=0 start.max=3
    //% length.min=0 length.max=4
    //% parts="tomatobit"
    export function setLEDs(start: number, length: number, rgb: number): void {
        let strip = new Strip();
        let pin = DigitalPin.P16;
        start = start >> 0;
        length = length >> 0;
        rgb = rgb >> 0;

        strip.buf = pins.createBuffer(12);
        strip.start = Math.clamp(0, 3, start);
        strip._length = Math.clamp(0, 4 - strip.start, length);
        strip._mode = NeoPixelMode.RGB;
        strip._matrixWidth = 0;
        strip.setBrightness(255);
        strip.setPin(pin);
        strip.setAllRGB(rgb);
        strip.neopixelShow();
    }

    /** Turn off all LEDs
    */
    //% block="Turn off all Robot:bit LEDs"
    //% blockId="turnOffAllLEDs"
    //% group="NeoPixel"
    //% weight=2
    //% parts="tomatobit"
    export function turnOffAllLEDs(): void {
        let strip = new Strip();
        let pin = DigitalPin.P16;

        strip.buf = pins.createBuffer(12);
        strip.start = Math.clamp(0, 3, 0);
        strip._length = Math.clamp(0, 4 - strip.start, 4);
        strip._mode = NeoPixelMode.RGB;
        strip._matrixWidth = 0;
        strip.setBrightness(255);
        strip.setPin(pin);
        strip.setAllRGB(0x000000);
        strip.neopixelShow();
    }

    /** Play sound on buzzer
    * @param frequency frequency(Hz) that buzzer play
    * @param duration how long should the sound play
    */
    //% block="Set Robot:bit buzzer play %frequency|(Hz) for %duration|seconds"
    //% blockId="setBuzzer"
    //% group="Robot:bit"
    //% weight=2
    //% parts="tomatobit"
    export function setBuzzer(frequency: number, duration: number): void {
        music.playTone(frequency, duration * 1000);
    }

    let initialized = false;

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1);
        buf[0] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(PCA9685_ADDRESS, MODE1, 0x00);
        setFreq(50);
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        initialized = true;
    }

    function setFreq(freq: number): void {
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval;
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10;
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode);
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15) {
            return;
        }

        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    /** Servo execute
    * @param index Servo Channel; eg: S1
    * @param degree [0-180] degree of servo; eg: 0, 90, 180
    */
    //% blockId="robotbitServo" block="Servo %index|degree %degree"
    //% group="Robot:bit"
    //% weight=2
    //% parts="tomatobit"
    //% degree.min=0 degree.max=180
    export function robotbitServo(index: Servos, degree: number): void {
        if (!initialized) {
            initPCA9685();
        }
        // 50hz: 20,000 us
        let v_us = (degree * 1800 / 180 + 600); // 0.6 ~ 2.4
        let value = v_us * 4096 / 20000;
        setPwm(index + 7, 0, value);
    }

    /** External button
    * @param ioPin which IO Pin used
    */
    //% blockId="externalButton" block="External button|%ioPin| is pressed?"
    //% group="Component & Sensor"
    //% weight=2
    export function externalButton(ioPin: DigitalPin): boolean {
        return ((pins.digitalReadPin(ioPin) == 1) ? true : false);
    }

    let i2cAddr: number // 0x3F: PCF8574A, 0x27: PCF8574
    let BK: number      // backlight control
    let RS: number      // command/data

    // set LCD reg
    function setreg(d: number) {
        pins.i2cWriteNumber(i2cAddr, d, NumberFormat.Int8LE);
        basic.pause(1);
    }

    // send data to I2C bus
    function set(d: number) {
        d = d & 0xF0;
        d = d + BK + RS;
        setreg(d);
        setreg(d + 4);
        setreg(d);
    }

    // send command
    function cmd(d: number) {
        RS = 0;
        set(d);
        set(d << 4);
    }

    // send data
    function dat(d: number) {
        RS = 1;
        set(d);
        set(d << 4);
    }

    // Auto identify I2C Address
    function AutoAddr() {
        let k = true;
        let addr = 0x20;
        let d1 = 0, d2 = 0;
        while (k && (addr < 0x28)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE);
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16;
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE);
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE);
            if ((d1 == 7) && (d2 == 0)) k = false;
            else addr += 1;
        }
        if (!k) return addr;

        addr = 0x38;
        while (k && (addr < 0x40)) {
            pins.i2cWriteNumber(addr, -1, NumberFormat.Int32LE);
            d1 = pins.i2cReadNumber(addr, NumberFormat.Int8LE) % 16;
            pins.i2cWriteNumber(addr, 0, NumberFormat.Int16LE);
            d2 = pins.i2cReadNumber(addr, NumberFormat.Int8LE);
            if ((d1 == 7) && (d2 == 0)) k = false;
            else addr += 1;
        }
        if (!k) return addr;
        else return 0;
    }

    /** Initialize LCD, set I2C address. According to the chip, there is two address,
    * PCF8574 is 39, PCF8574A is 63, 0 for auto recognition
    * @param address is i2c address for LCD
    */
    //% blockId="lcdSetAddress" block="Initialize LCD, set I2C address as %addr"
    //% group="LCD"
    //% weight=5
    export function lcdSetAddress(addr: LCD_AddressType): void {
        if (addr == 0) i2cAddr = AutoAddr();
        else i2cAddr = addr;
        BK = 8;
        RS = 0;
        cmd(0x33);       // set 4bit mode
        basic.pause(5);
        set(0x30);
        basic.pause(5);
        set(0x20);
        basic.pause(5);
        cmd(0x28);       // set mode
        cmd(0x0C);
        cmd(0x06);
        cmd(0x01);       // clear
    }

    /** Display numbers in the specified position of the LCD
    * @param n is number will be show, eg: 10, 100, 200
    * @param x is LCD column position, eg: 0
    * @param y is LCD row position, eg: 0
    */
    //% blockId="lcdShowNumber" block="Show number %n|at position x %x|y %y"
    //% group="LCD"
    //% weight=4
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function lcdShowNumber(n: number, x: number, y: number): void {
        let s = n.toString();
        lcdShowString(s, x, y);
    }

    /** Display string in the specified position of the LCD
    * @param s is string will be show, eg: "Hello"
    * @param x is LCD column position, [0 - 15], eg: 0
    * @param y is LCD row position, [0 - 1], eg: 0
    */
    //% blockId="lcdShowString" block="Show string %s|at position x %x|y %y"
    //% group="LCD"
    //% weight=4
    //% x.min=0 x.max=15
    //% y.min=0 y.max=1
    export function lcdShowString(s: string, x: number, y: number): void {
        let a: number

        if (y > 0)
        a = 0xC0;
        else
        a = 0x80;
        a += x;
        cmd(a);

        for (let i = 0; i < s.length; i++) {
            dat(s.charCodeAt(i));
        }
    }

    /** Turn on LCD Display
    */
    //% blockId="lcdOn" block="Turn on LCD"
    //% group="LCD"
    //% weight=1
    export function lcdOn(): void {
        cmd(0x0C);
    }

    /** Turn off LCD Display
    */
    //% blockId="lcdOff" block="Turn off LCD"
    //% group="LCD"
    //% weight=1
    export function lcdOff(): void {
        cmd(0x08);
    }

    /** Clear LCD Display
    */
    //% blockId="lcdClear" block="Clear LCD display"
    //% group="LCD"
    //% weight=3
    export function lcdClear(): void {
        cmd(0x01);
    }

    /** Turn on LCD Backlight
    */
    //% blockId="lcdBacklightOn" block="Turn on LCD Backlight"
    //% group="LCD"
    //% weight=1
    export function lcdBacklightOn(): void {
        BK = 8;
        cmd(0);
    }

    /** Turn off LCD Backlight
    */
    //% blockId="lcdBacklightOff" block="Turn off LCD Backlight"
    //% group="LCD"
    //% weight=1
    export function lcdBacklightOff(): void {
        BK = 0;
        cmd(0);
    }

    /** Screen shift left
    */
    //% blockId="lcdShiftLeft" block="LCD Screen shift left"
    //% group="LCD"
    //% weight=2
    export function lcdShiftLeft(): void {
        cmd(0x18);
    }

    /** Screen shift right
    */
    //% blockId="lcdShiftRight" block="LCD Screen shift right"
    //% group="LCD"
    //% weight=2
    export function lcdShiftRight(): void {
        cmd(0x1C);
    }

    /** Send a ultrasonic ping and get the echo time (in microseconds) as a result
    * @param trigPin tigger pin
    * @param echoPin echo pin
    * @param maxCmDistance maximum distance in centimeters (default is 500)
    */
    //% blockId="robotbitUltrasonic" block="Distance (cm) that ultrasonic Sensor Trig %trigPin|Echo %echoPin| detected"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitUltrasonic(trigPin: DigitalPin, echoPin: DigitalPin, maxCmDistance = 400): number {
        // send pulse
        pins.setPull(trigPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);

        // read pulse
        const d = pins.pulseIn(echoPin, PulseValue.High, maxCmDistance * 58);

        return Math.idiv(d, 300);
    }
}

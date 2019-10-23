enum NeoPixelKnownColors {
    //% block=red
    RED = 0xFF0000,
    //% block=orange
    ORANGE = 0xFFA500,
    //% block=yellow
    YELLOW = 0xFFFF00,
    //% block=green
    GREEN = 0x00FF00,
    //% block=blue
    BLUE = 0x0000FF,
    //% block=indigo
    INDIGO = 0x4b0082,
    //% block=violet
    VIOLET = 0x8a2be2,
    //% block=purple
    PURPLE = 0xFF00FF,
    //% block=white
    WHITE = 0xFFFFFF,
    //% block=black
    BLACK = 0x000000
}

enum UltrasonicReturnType {
    //% block=cm
    CM,
    //% block=inches
    INCHES,
    //% block=milliseconds (ms)
    MS
}

enum Motors {
    M1A = 0x1,
    M1B = 0x2,
    M2A = 0x3,
    M2B = 0x4
}

enum Steppers {
    M1 = 0x1,
    M2 = 0x2
}

enum Turns {
    //% blockId="T1B4" block="1/4"
    T1B4 = 90,
    //% blockId="T1B2" block="1/2"
    T1B2 = 180,
    //% blockId="T1B0" block="1"
    T1B0 = 360,
    //% blockId="T2B0" block="2"
    T2B0 = 720,
    //% blockId="T3B0" block="3"
    T3B0 = 1080,
    //% blockId="T4B0" block="4"
    T4B0 = 1440,
    //% blockId="T5B0" block="5"
    T5B0 = 1800
}

enum DHT11Type {
    //% block=temperature(°C)
    TEMPERATURE_C,
    //% block=temperature(°F)
    TEMPERATURE_F,
    //% block=humidity
    HUMIDITY
}

enum LCD_AddressType {
    //% block="auto recognition (0)"
    AUTO = 0,
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

enum Ports {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2,
    PORT4 = 3
}

enum PortsA {
    PORT1 = 0,
    PORT2 = 1,
    PORT3 = 2
}

enum Slots {
    LEFT = 1,
    RIGHT = 0
}

//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=["Robot:bit", "Component & Sensor", "mBridge", "LCD", "Motors"]
namespace tomatobit {
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

    const STP_CHA_L = 2047;
    const STP_CHA_H = 4095;

    const STP_CHB_L = 1;
    const STP_CHB_H = 2047;

    const STP_CHC_L = 1023;
    const STP_CHC_H = 3071;

    const STP_CHD_L = 3071;
    const STP_CHD_H = 1023;

    // HT16K33 commands
    const HT16K33_ADDRESS = 0x70;
    const HT16K33_BLINK_CMD = 0x80;
    const HT16K33_BLINK_DISPLAYON = 0x01;
    const HT16K33_BLINK_OFF = 0;
    const HT16K33_BLINK_2HZ = 1;
    const HT16K33_BLINK_1HZ = 2;
    const HT16K33_BLINK_HALFHZ = 3;
    const HT16K33_CMD_BRIGHTNESS = 0xE0;

    const PortDigi = [
        [DigitalPin.P0, DigitalPin.P8],
        [DigitalPin.P1, DigitalPin.P12],
        [DigitalPin.P2, DigitalPin.P13],
        [DigitalPin.P14, DigitalPin.P15]
    ]

    const PortAnalog = [
        AnalogPin.P0,
        AnalogPin.P1,
        AnalogPin.P2,
        null
    ]

    //% shim=sendBufferAsm
    function sendBuffer(buf: Buffer, pin: DigitalPin) {
    }

    class STRIP {
        buf: Buffer;
        pin: DigitalPin;
        brightness: number;
        start: number; // start offset in LEDs strip
        _length: number; // number of LEDs
        _mode: NeoPixelMode;
        _matrixWidth: number; // number of leds in a matrix - if any
        _matrixChain: number; // the connection type of matrix chain
        _matrixRotation: number; // the rotation type of matrix

        /** Shows all LEDs to a given color (range 0-255 for r, g, b).
        * @param rgb RGB color of the LED
        */
        //% blockId="neopixelShowColor" block="Robot:bit LEDs show color %rgb=getNeoPixelKnownColors"
        //% group="Robot:bit"
        //% weight=85 blockGap=8
        neopixelShowColor(rgb: number) {
            rgb = rgb >> 0;
            this.setAllRGB(rgb);
            this.neopixelShow();
        }

        /** Send all the changes to the strip. */
        //% blockId="neopixelShow" blockGap=8
        //% weight=79
        //% group="Robot:bit"
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

            const br = 7;
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
    //% group="Robot:bit"
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
    //% block="RGB(red: %red| green: %green| blue: %blue| )"
    //% blockId="getRGBColor"
    //% group="Robot:bit"
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
    //% block="set Robot:bit LEDs range from %start| with %length| LEDs show color %rgb=getNeoPixelKnownColor"
    //% blockId="setLEDs"
    //% group="Robot:bit"
    //% weight=2
    //% start.min=0 start.max=3
    //% length.min=0 length.max=4
    //% parts="tomatobit"
    export function setLEDs(start: number, length: number, rgb: number): void {
        let strip = new STRIP();
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
    //% block="turn off all Robot:bit LEDs"
    //% blockId="turnOffAllLEDs"
    //% group="Robot:bit"
    //% weight=2
    //% parts="tomatobit"
    export function turnOffAllLEDs(): void {
        let strip = new STRIP();
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
    //% block="set Robot:bit buzzer play %frequency| (Hz) for %duration| seconds"
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
    //% blockId="robotbitServo" block="servo %index| degree %degree"
    //% group="Motors"
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
    //% blockId="externalButton" block="external push button %ioPin| is pressed?"
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
    //% blockId="lcdSetAddress" block="initialize LCD, set I2C address as %addr"
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
    //% blockId="lcdShowNumber" block="show number %n| at position x %x| y %y on LCD"
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
    //% blockId="lcdShowString" block="show string %s| at position x %x| y %y on LCD"
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
    //% blockId="lcdOn" block="turn on LCD screen"
    //% group="LCD"
    //% weight=1
    //% advanced=true
    export function lcdOn(): void {
        cmd(0x0C);
    }

    /** Turn off LCD Display
    */
    //% blockId="lcdOff" block="turn off LCD screen"
    //% group="LCD"
    //% weight=1
    //% advanced=true
    export function lcdOff(): void {
        cmd(0x08);
    }

    /** Clear LCD Display
    */
    //% blockId="lcdClear" block="clear LCD display"
    //% group="LCD"
    //% weight=3
    //% advanced=true
    export function lcdClear(): void {
        cmd(0x01);
    }

    /** Turn on LCD Backlight
    */
    //% blockId="lcdBacklightOn" block="turn on LCD backlight"
    //% group="LCD"
    //% weight=1
    //% advanced=true
    export function lcdBacklightOn(): void {
        BK = 8;
        cmd(0);
    }

    /** Turn off LCD Backlight
    */
    //% blockId="lcdBacklightOff" block="turn off LCD backlight"
    //% group="LCD"
    //% weight=1
    //% advanced=true
    export function lcdBacklightOff(): void {
        BK = 0;
        cmd(0);
    }

    /** Screen shift left
    */
    //% blockId="lcdShiftLeft" block="LCD screen content shift left"
    //% group="LCD"
    //% weight=2
    //% advanced=true
    export function lcdShiftLeft(): void {
        cmd(0x18);
    }

    /** Screen shift right
    */
    //% blockId="lcdShiftRight" block="LCD screen content shift right"
    //% group="LCD"
    //% weight=2
    //% advanced=true
    export function lcdShiftRight(): void {
        cmd(0x1C);
    }

    /** Send a ultrasonic ping and get the echo time (in microseconds) as a result
    * @param returnType return type; eg: cm, inch, ms
    * @param trigPin tigger pin
    * @param echoPin echo pin
    * @param maxCmDistance maximum distance in centimeters (default is 400)
    */
    //% blockId="robotbitUltrasonic" block="distance (cm) that ultrasonic Sensor Trig %trigPin| Echo %echoPin| detected"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitUltrasonic(trigPin: DigitalPin, echoPin: DigitalPin, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trigPin, PinPullMode.PullNone);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);

        // read pulse
        const d = pins.pulseIn(echoPin, PulseValue.High, maxCmDistance * 58);

        return (d / 29);
    }

    /** Check if PIR detected human movement
    * @param pin Digital Pin; eg: P0, P1, P2, P8, P12, P13, P14, P15
    */
    //% blockId="robotbitPIR" block="PIR %pin| detected movement?"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitPIR(pin: DigitalPin): boolean {
        return ((pins.digitalReadPin(pin) == 1) ? true : false);
    }

    /** When PIR detected human movement
    * @param pin Digital Pin; eg: P0, P1, P2, P8, P12, P13, P14, P15
    * @param handler function wants to do
    */
    //% blockId="robotbitWhenPIR" block="when PIR %pin| detected movement, "
    //% group="Component & Sensor"
    //% weight=1
    //% advanced=true
    export function robotbitWhenPIR(pin: DigitalPin, handler: () => void): void {
        pins.onPulsed(pin, PulseValue.High, handler);
    }

    /** Get water sensor detected value
    * @param pin Analog Pin; eg: P0, P1, P2
    */
    //% blockId="robotbitWaterSensorValue" block="water sensor %pin|"
    //% group="Component & Sensor"
    //% weight=1
    //% advanced=true
    export function robotbitWaterSensorValue(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    /** Check if water sensor detected water
    * @param pin Analog Pin; eg: P0, P1, P2
    */
    //% blockId="robotbitWaterSensor" block="water sensor %pin| detected water?"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitWaterSensor(pin: AnalogPin): boolean {
        return ((pins.analogReadPin(pin) < 200) ? true : false);
    }

    /** Get soil moisture sensor detected value
    * @param pin Analog Pin; eg: P0, P1, P2
    */
    //% blockId="robotbitSoilMoistureSensorValue" block="soil moisture sensor %pin|"
    //% group="Component & Sensor"
    //% weight=1
    //% advanced=true
    export function robotbitSoilMoistureSensorValue(pin: AnalogPin): number {
        return pins.analogReadPin(pin);
    }

    /** Check if soil moisture sensor detected water
    * @param pin Analog Pin; eg: P0, P1, P2
    */
    //% blockId="robotbitSoilMoistureSensor" block="soil moisture sensor %pin| detected water?"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitSoilMoistureSensor(pin: AnalogPin): boolean {
        return ((pins.analogReadPin(pin) < 900) ? true : false);
    }

    let _temperatureC: number = 0.0;
    let _temperatureF: number = 0.0;
    let _humidity: number = 0.0;
    let _readSuccessful: boolean = false;

    /** Return DHT11 Temperature & Humdity Sensor Value
    * @param pin Digital Pin; eg: P0, P1, P2, P8, P12, P13, P14, P15
    * @param type Which data what to get; eg: Temperature(°C), Temperature(°F), Humdity(%)
    */
    //% blockId="robotbitTempHumdSensor" block="DHT11 temperature & humdity sensor %pin| %type|"
    //% group="Component & Sensor"
    //% weight=2
    export function robotbitTempHumdSensor(pin: DigitalPin, type: DHT11Type): number {
        let startTime: number = 0;
        let endTime: number = 0;
        let checkSum: number = 0;
        let checkSumTmp: number = 0;
        let dataArray: boolean[] = [];
        let resultArray: number[] = [];
        for (let index = 0; index < 40; index++) {
            dataArray.push(false);
        }
        for (let index = 0; index < 5; index++) {
            resultArray.push(0);
        }
        _temperatureC = -999.0;
        _temperatureF = -999.0;
        _humidity = -999.0;
        _readSuccessful = false;

        startTime = input.runningTimeMicros();
        pins.digitalWritePin(pin, 0);
        basic.pause(18);
        pins.setPull(pin, PinPullMode.PullUp);
        pins.digitalReadPin(pin);
        while (pins.digitalReadPin(pin) == 1);
        while (pins.digitalReadPin(pin) == 0);
        while (pins.digitalReadPin(pin) == 1);

        for (let index = 0; index < 40; index++) {
            while (pins.digitalReadPin(pin) == 1);
            while (pins.digitalReadPin(pin) == 0);
            control.waitMicros(28);
            if (pins.digitalReadPin(pin) == 1) {
                dataArray[index] = true;
            }
        }

        endTime = input.runningTimeMicros();

        for (let index = 0; index < 5; index++) {
            for (let index2 = 0; index2 < 8; index2++) {
                if (dataArray[8 * index + index2]) {
                    resultArray[index] += 2 ** (7 - index2);
                }
            }
        }

        checkSumTmp = resultArray[0] + resultArray[1] + resultArray[2] + resultArray[3];
        checkSum = resultArray[4];
        if (checkSumTmp >= 512) { checkSumTmp -= 512; }
        if (checkSumTmp >= 256) { checkSumTmp -= 256; }
        if (checkSum == checkSumTmp) { _readSuccessful = true; }
        basic.pause(1000);

        if (_readSuccessful) {
            _temperatureC = resultArray[2] + resultArray[3] / 100;
            _temperatureF = _temperatureC * 1.8 + 32;
            _humidity = resultArray[0] + resultArray[1] / 100;
            if (type == DHT11Type.TEMPERATURE_C) {
                return Math.floor(_temperatureC);
            }
            else if (type == DHT11Type.TEMPERATURE_F) {
                return Math.floor(_temperatureF);
            }
            else if (type == DHT11Type.HUMIDITY) {
                return Math.floor(_humidity);
            }
        }
        return -999;
    }

    let distanceBuf = 0;
    let dht11Temp = -1;
    let dht11Humi = -1;

    //% shim=powerbrick::dht11Update
    function dht11Update(pin: number): number {
        return 999;
    }

    /** Robot:bit + mBridge - Return Me Ultrasonic Sensor detected distance (cm)
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    */
    //% blockId="mbridgeUltrasonic" block="Me Ultrasonic sensor %port|"
    //% group="mBridge"
    //% weight=2
    export function mbridgeUltrasonic(port: Ports): number {
        // send pulse
        let pin = PortDigi[port][0];
        pins.setPull(pin, PinPullMode.PullNone);
        pins.digitalWritePin(pin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(pin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(pin, 0);

        // read pulse
        let d = pins.pulseIn(pin, PulseValue.High, 25000);
        let ret = d;
        // filter timeout spikes
        if (ret == 0 && distanceBuf != 0) {
            ret = distanceBuf;
        }
        distanceBuf = d;
        return Math.floor(ret / 6 / 58);
    }

    /** Robot:bit + mBridge - Return Me PIR Sensor is detected movement?
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    */
    //% blockId="mbridgePIR" block="Me PIR %port| detected movement?"
    //% weight=2
    //% group="mBridge"
    export function mbridgePIR(port: Ports): boolean {
        let pin = PortDigi[port][0];
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == 1;
    }

    /** Robot:bit + mBridge - When Me PIR Sensor is detected movement, do...
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    * @param handler function wants to do
    */
    //% blockId=mbridgeOnPIREvent block="when Me PIR Sensor %port| detected movement"
    //% weight=1
    //% group="mBridge"
    //% advanced=true
    export function mbridgeOnPIREvent(port: Ports, handler: () => void): void {
        let pin = PortDigi[port][0];
        pins.setPull(pin, PinPullMode.PullUp);
        pins.onPulsed(pin, PulseValue.High, handler);
    }

    /** Robot:bit + mBridge - Return Me Touch Sensor is touched?
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    */
    //% blockId=mbridgeTouch block="Me touch sensor %port| is touched?"
    //% group="mBridge"
    //% weight=2
    export function mbridgeTouch(port: Ports): boolean {
        let pin = PortDigi[port][0];
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == 0;
    }

    /** Robot:bit + mBridge - When Me Touch Sensor is touched, do...
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    * @param handler function wants to do
    */
    //% blockId=mbridgeTouchEvent block="when Me touch sensor %port| is touched"
    //% group="mBridge"
    //% weight=1
    //% advanced=true
    export function mbridgeTouchEvent(port: Ports, handler: () => void): void {
        let pin = PortDigi[port][0];
        pins.setPull(pin, PinPullMode.PullUp);
        pins.onPulsed(pin, PulseValue.Low, handler);
    }

    /** Robot:bit + mBridge - Return Me Line Follower Slot Left / Right is black?
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    * @param slot Line Follower Slot; eg: Left / Right
    */
    //% blockId="mbridgeLineFollower" block="Me line follower %port| slot %slot| is black?"
    //% group="mBridge"
    //% weight=2
    export function mbridgeLineFollower(port: Ports, slot: Slots): boolean {
        let pin = PortDigi[port][slot];
        pins.setPull(pin, PinPullMode.PullUp);
        return pins.digitalReadPin(pin) == 1;
    }

    /** Robot:bit + mBridge - When Me Line Follower Slot Left / Right is black, do...
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    * @param slot Line Follower Slot; eg: Left / Right
    * @param handler function wants to do
    */
    //% blockId=mbridgeLineFollowerEvent block="when Me line follower %port| slot %slot| is black"
    //% group="mBridge"
    //% weight=1
    //% advanced=true
    export function mbridgeLineFollowerEvent(port: Ports, slot: Slots, handler: () => void): void {
        let pin = PortDigi[port][slot];
        pins.setPull(pin, PinPullMode.PullUp);
        pins.onPulsed(pin, PulseValue.High, handler);
    }

    /** Robot:bit + mBridge - Get Me Line Follower Status
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    */
    //% blockId="mbridgeLineFollowerStatus" block="Me line follower %port| status"
    //% group="mBridge"
    //% weight=2
    export function mbridgeLineFollowerStatus(port: Ports): number {
        let pinL = PortDigi[port][1];
        let pinR = PortDigi[port][0];
        pins.setPull(pinL, PinPullMode.PullUp);
        let pinL_status = (pins.digitalReadPin(pinL) == 1);
        pins.setPull(pinR, PinPullMode.PullUp);
        let pinR_status = (pins.digitalReadPin(pinR) == 1);
        if (pinL_status && pinR_status) return 0;
        else if (pinL_status && !pinR_status) return 1;
        else if (!pinL_status && pinR_status) return 2;
        else if (!pinL_status && !pinR_status) return 3;
        return -1;
    }

    /** Robot:bit + mBridge - Get Me Temperature & Humdity Sensor Value
    * @param port Digital Port; eg: PORT1, PORT2, PORT3, PORT4
    * @param readtype Which data what to get; eg: Temperature(°C), Temperature(°F), Humdity(%)
    */
    //% blockId="mbridgeDHT11" block="Me temperature and humidity sensor %port| type %readtype|"
    //% group="mBridge"
    //% weight=2
    export function mbridgeDHT11(port: Ports, readtype: DHT11Type): number {
        let pin = PortDigi[port][0];

        // todo: get pinname in ts
        let value = (dht11Update(pin - 7) >> 0);

        if (value != 0) {
            dht11Temp = (value & 0x0000ff00) >> 8;
            dht11Humi = value >> 24;
        }
        if (readtype == DHT11Type.TEMPERATURE_C) {
            return dht11Temp;
        } else if (readtype == DHT11Type.TEMPERATURE_F) {
            return Math.floor(dht11Temp * 9 / 5) + 32;
        } else {
            return dht11Humi;
        }
    }

    /** Robot:bit + mBridge - Get Me Sound Sensor Value
    * @param port Analog Port; eg: PORT1, PORT2, PORT3
    */
    //% blockId="mbridgeSound" block="Me sound sensor %port|"
    //% group="mBridge"
    //% weight=2
    export function mbridgeSound(port: PortsA): number {
        let pin = PortAnalog[port];
        return pins.analogReadPin(pin);
    }

    /** Robot:bit + mBridge - Get Me Light Sensor Value
    * @param port Analog Port; eg: PORT1, PORT2, PORT3
    */
    //% blockId="mbridgeLight" block="Me light sensor %port|"
    //% group="mBridge"
    //% weight=2
    export function mbridgeLight(port: PortsA): number {
        let pin = PortAnalog[port];
        return pins.analogReadPin(pin);
    }

    /** Robot:bit + mBridge - Get Me Potentiometer Value
    * @param port Analog Port; eg: PORT1, PORT2, PORT3
    */
    //% blockId="mbridgePotentiometer" block="Me potentiometer %port|"
    //% group="mBridge"
    //% weight=1
    //% advanced=true
    export function mbridgePotentiometer(port: PortsA): number {
        let pin = PortAnalog[port];
        return pins.analogReadPin(pin);
    }

    /** Geek Servo
    * @param index Servo Channel; eg: S1
    * @param degree [-45-225] degree of servo; eg: -45, 90, 225
    */
    //% blockId="robotbitGeekServo" block="geek servo %index| degree %degree|"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    //% degree.min=-45 degree.max=225
    export function robotbitGeekServo(index: Servos, degree: number): void {
        if (!initialized) {
            initPCA9685();
        }
        // 50hz: 20,000 us
        let v_us = ((degree - 90) * 20 / 3 + 1500); // 0.6 ~ 2.4
        let value = v_us * 4096 / 20000;
        setPwm(index + 7, 0, value);
    }

    function setStepper(index: number, dir: boolean): void {
        if (index == 1) {
            if (dir) {
                setPwm(0, STP_CHA_L, STP_CHA_H);
                setPwm(2, STP_CHB_L, STP_CHB_H);
                setPwm(1, STP_CHC_L, STP_CHC_H);
                setPwm(3, STP_CHD_L, STP_CHD_H);
            }
            else {
                setPwm(3, STP_CHA_L, STP_CHA_H);
                setPwm(1, STP_CHB_L, STP_CHB_H);
                setPwm(2, STP_CHC_L, STP_CHC_H);
                setPwm(0, STP_CHD_L, STP_CHD_H);
            }
        }
        else {
            if (dir) {
                setPwm(4, STP_CHA_L, STP_CHA_H);
                setPwm(6, STP_CHB_L, STP_CHB_H);
                setPwm(5, STP_CHC_L, STP_CHC_H);
                setPwm(7, STP_CHD_L, STP_CHD_H);
            }
            else {
                setPwm(7, STP_CHA_L, STP_CHA_H);
                setPwm(5, STP_CHB_L, STP_CHB_H);
                setPwm(6, STP_CHC_L, STP_CHC_H);
                setPwm(4, STP_CHD_L, STP_CHD_H);
            }
        }
    }

    function stopMotor(index: number) {
        setPwm((index - 1) * 2, 0, 0);
        setPwm((index - 1) * 2 + 1, 0, 0);
    }

    /** Stepper Motor Degree Control
    * @param index Steppers Channel; eg: M1
    * @param degree [-45-225] degree of servo; eg: -45, 90, 225
    */
    //% blockId="robotbitStepperDegree" block="stepper motor %index| turn to degree %degree"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    export function robotbitStepperDegree(index: Steppers, degree: number): void {
        if (!initialized) {
            initPCA9685();
        }
        setStepper(index, degree > 0);
        degree = Math.abs(degree);
        basic.pause(10240 * degree / 360);
        robotbitMotorStopAll();
    }

    /** Stepper Motor Turns Control
    * @param index Steppers Channel; eg: M1
    * @param turn turn number
    */
    //% blockId="robotbitStepperTurn" block="stepper motor %index| turn %turn"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    export function robotbitStepperTurn(index: Steppers, turn: Turns): void {
        let degree = turn;
        robotbitStepperDegree(index, degree);
    }

    /** Dual Stepper Motor Control */
    //% blockId="robotbitDualStepper" block="dual stepper (degree) M1 %degree1| M2 %degree2"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    export function robotbitDualStepper(degree1: number, degree2: number): void {
        if (!initialized) {
            initPCA9685();
        }
        setStepper(1, degree1 > 0);
        setStepper(2, degree2 > 0);
        degree1 = Math.abs(degree1);
        degree2 = Math.abs(degree2);
        basic.pause(10240 * Math.min(degree1, degree2) / 360);
        if (degree1 > degree2) {
            stopMotor(3); stopMotor(4);
            basic.pause(10240 * (degree1 - degree2) / 360);
        }
        else {
            stopMotor(1); stopMotor(2);
            basic.pause(10240 * (degree2 - degree1) / 360);
        }

        robotbitMotorStopAll();
    }

    /** Stepper Car move forward
    * @param distance Distance to move in cm; eg: 10, 20
    * @param diameter diameter of wheel in mm; eg: 48
    */
    //% blockId="robotbitStpcarMove" block="car move forward distance(cm) %distance| where wheel diameter(mm) is %diameter|"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    export function robotbitStpcarMove(distance: number, diameter: number): void {
        if (!initialized) {
            initPCA9685();
        }
        let delay = 10240 * 10 * distance / 3 / diameter; // use 3 instead of pi
        setStepper(1, delay > 0);
        setStepper(2, delay > 0);
        delay = Math.abs(delay);
        basic.pause(delay);
        robotbitMotorStopAll();
    }

    /** Stepper Car turn by degree
    * @param turn Degree to turn; eg: 90, 180, 360
    * @param diameter diameter of wheel in mm; eg: 48
    * @param track track width of car; eg: 125
    */
    //% blockId="robotbitStpcarTurn" block="car turn degree %turn| where wheel diameter(mm) is %diameter| track(mm) %track"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    export function robotbitStpcarTurn(turn: number, diameter: number, track: number): void {
        if (!initialized) {
            initPCA9685();
        }
        let delay = 10240 * turn * track / 360 / diameter;
        setStepper(1, delay < 0);
        setStepper(2, delay > 0);
        delay = Math.abs(delay);
        basic.pause(delay);
        robotbitMotorStopAll();
    }

    //% blockId="robotbitMotorRun" block="motor %index| speed %speed"
    //% group="Motors"
    //% weight=1
    //% speed.min=-255 speed.max=255
    export function robotbitMotorRun(index: Motors, speed: number): void {
        if (!initialized) {
            initPCA9685();
        }
        speed = speed * 16; // map 255 to 4096
        if (speed >= 4096) {
            speed = 4095;
        }
        if (speed <= -4096) {
            speed = -4095;
        }
        if (index > 4 || index <= 0) {
            return;
        }
        let pp = (index - 1) * 2;
        let pn = (index - 1) * 2 + 1;
        if (speed >= 0) {
            setPwm(pp, 0, speed);
            setPwm(pn, 0, 0);
        }
        else {
            setPwm(pp, 0, 0);
            setPwm(pn, 0, -speed);
        }
    }


    /** Execute two motors at the same time
    * @param motor1 First Motor; eg: M1A, M1B
    * @param speed1 [-255-255] speed of motor; eg: 150, -150
    * @param motor2 Second Motor; eg: M2A, M2B
    * @param speed2 [-255-255] speed of motor; eg: 150, -150
    */
    //% blockId="robotbitMotorDual" block="motor %motor1| speed %speed1| %motor2| speed %speed2"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    //% speed1.min=-255 speed1.max=255
    //% speed2.min=-255 speed2.max=255
    export function robotbitMotorDual(motor1: Motors, speed1: number, motor2: Motors, speed2: number): void {
        robotbitMotorRun(motor1, speed1);
        robotbitMotorRun(motor2, speed2);
    }

    /** Execute single motors with delay
    * @param index Motor Index; eg: M1A, M1B, M2A, M2B
    * @param speed [-255-255] speed of motor; eg: 150, -150
    * @param delay seconde delay to stop; eg: 1
    */
    //% blockId="robotbitMotorRunDelay" block="motor %index| speed %speed| delay %delay| seconds"
    //% group="Motors"
    //% weight=1
    //% advanced=true
    //% speed.min=-255 speed.max=255
    export function robotbitMotorRunDelay(index: Motors, speed: number, delay: number): void {
        robotbitMotorRun(index, speed);
        basic.pause(delay * 1000);
        robotbitMotorRun(index, 0);
    }

    /** Stop the motor
    * @param index Motor Index; eg: M1A, M1B, M2A, M2B
    */
    //% blockId="robotbitMotorStop" block="motor %index| stop"
    //% group="Motors"
    //% weight=1
    export function robotbitMotorStop(index: Motors): void {
        robotbitMotorRun(index, 0);
    }

    /** Stop the motor */
    //% blockId="robotbitMotorStopAll" block="motor stop all"
    //% group="Motors"
    //% weight=1
    export function robotbitMotorStopAll(): void {
        if (!initialized) {
            initPCA9685();
        }
        for (let idx = 1; idx <= 4; idx++) {
            stopMotor(idx);
        }
    }
}

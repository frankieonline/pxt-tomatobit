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

enum DigitalIOPins {
    P0 = DigitalPin.P0,
    P1 = DigitalPin.P1,
    P2 = DigitalPin.P2,
    P8 = DigitalPin.P8,
    P12 = DigitalPin.P12,
    P13 = DigitalPin.P13,
    P14 = DigitalPin.P14,
    P15 = DigitalPin.P15
}

enum AnalogIOPins {
    P0 = AnalogPin.P0,
    P1 = AnalogPin.P1,
    P2 = AnalogPin.P2
}

enum Slots {
    //% block="Left"
    A = 0,
    //% block="Right"
    B = 1
}

//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=["Robot:bit", "Component & Sensor", "mBridge"]
namespace tomatobit {
    const PortDigi = [
        [DigitalPin.P0, DigitalPin.P8],
        [DigitalPin.P1, DigitalPin.P12],
        [DigitalPin.P2, DigitalPin.P13],
        [DigitalPin.P14, DigitalPin.P15]
    ];

    const PortAnalog = [
        AnalogPin.P0,
        AnalogPin.P1,
        AnalogPin.P2,
        null
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

        show() {
            sendBuffer(this.buf, this.pin);
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
    //% weight=900
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
    //% group="Robot:bit"
    //% weight=900
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
    //% group="Robot:bit"
    //% weight=999
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
        strip.show();
    }

    /** Play sound on buzzer
    * @param frequency frequency(Hz) that buzzer play
    * @param duration how long should the sound play
    */
    //% block="Set Robot:bit buzzer play %frequency|(Hz) for %duration|seconds"
    //% blockId="setBuzzer"
    //% group="Robot:bit"
    //% weight=899
    //% parts="tomatobit"
    export function setBuzzer(frequency: number, duration: number): void {
        music.playTone(frequency, duration * 1000);
        //pins.analogPitch(frequency, duration * 1000);
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
    //% blockId=robotbitServo block="Servo %index|degree %degree"
    //% group="Robot:bit"
    //% weight=899
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
    * @param ioPins which IO Pin used
    */
    //% blockId=externalButton block="External button|%ioPin| is pressed?"
    //% group="Component & Sensor"
    export function externalButton(ioPin: DigitalPin): boolean {
        return pins.digitalReadPin(ioPin);
    }
}

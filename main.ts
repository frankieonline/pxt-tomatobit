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

//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=["Robot:bit", "Component & Sensor", "mBridge"]
namespace tomatobit {
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
        pins.analogPitch(frequency, duration * 1000);
    }
}

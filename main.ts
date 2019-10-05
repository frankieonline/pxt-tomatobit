//% weight=0 color=#FF6347 icon="\uf707" block="Tomato:bit"
//% groups='["Robot:bit", "電子零件及感應器", "mBridge"]'
namespace tomatobit {
    export enum Ports {
        PORT1 = 0,
        PORT2 = 1,
        PORT3 = 2,
        PORT4 = 3
    }

    export enum PortsA {
        PORT1 = 0,
        PORT2 = 1,
        PORT3 = 2
    }

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

    export enum Slots {
        //% block=Left
        A = 0,
        //% block=Right
        B = 1
    }

    export enum DHT11Type {
        //% block=Temperature（°C）
        TemperatureC = 0,
        //% block=Temperature（°F）
        TemperatureF = 1,
        //% block=Humidity
        Humidity = 2
    }

    enum NeoPixelColors {
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


    let distanceBuf = 0;
    let dht11Temp = -1;
    let dht11Humi = -1;

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

        /** Robot:bit LEDs
        * @param start offset in the Robot:bit LEDs to start the range
        * @param length number of LEDs in the range. max: 4
        * @param rgb RGB color of the LEDs
        */
        //% blockId="setLED_Range" block="Set Robot:bit LEDs range from %start|with %length|LEDs show color %rgb=neopixel_colors"
        //% group="Robot:bit"
        //% blockGap=2 weight=0
        export function setLED_Range(start: number, length: number, rgb: number) {
            let strip = new Strip();
            let pin = DigitalPin.P16;
            start = start >> 0;
            length = length >> 0;
            rgb = rgb >> 0;

            strip.buf = pin.createBuffer(12);
            strip.start = Math.clamp(0, 3, start);
            strip._length = Math.clamp(0, 4 - strip.start, length);
            strip._mode = NeoPixelMode.RGB;
            strip._matrixWidth = 0;
            strip.setBrightness(255);
            strip.setPin(pin);
            strip.setAllRGB(rgb);
            strip.show();
        }

        /** Gets the RGB value of a known color
        * @param color NeoPixelColors
        */
        //% weight=1 blockGap=8
        //% blockId="neopixel_colors" block="%color"
        //% group="Robot:bit"
        //% advanced=true
        export function colors(color: NeoPixelColors): number {
            return color;
        }

        /** Converts red, green, blue channels into a RGB color
        * @param red value of the red channel between 0 and 255. eg: 255
        * @param green value of the green channel between 0 and 255. eg: 255
        * @param blue value of the blue channel between 0 and 255. eg: 255
        */
        //% weight=1
        //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
        //% group="Robot:bit"
        //% advanced=true
        export function neopixel_rgb(red: number, green: number, blue: number): number {
            return packRGB(red, green, blue);
        }

        show() {
            sendBuffer(this.buf, this.pin);
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
    }
}

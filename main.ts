//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=['Robot:bit', 'Component & Sensor', 'mBridge']
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

namespace tomatobit {
    /** Gets the RGB value of a NeoPixel Known Color
    * @param color NeoPixel Known Color
    */
    //% block="Color: $knownColor"
    //% blockId=neopixelColorList
    //% group='Robot:bit'
    export function neopixelColorList(knownColor: NeoPixelKnownColors) {
        return knownColor;
    }
}

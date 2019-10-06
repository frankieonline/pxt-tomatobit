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

//% weight=0 color=#FF6347 icon="\uf1b0" block="Tomato:bit"
//% groups=['Robot:bit', 'Component & Sensor', 'mBridge']
namespace tomatobit {
    /** Get the RGB value of a NeoPixel known color
    * @param knownColor NeoPixel known color
    */
    //% block="color: %knownColor|"
    //% blockId=colors
    //% group='Robot:bit'
    //% weight=0
    export function colors(knownColor: NeoPixelKnownColors):number {
        return knownColor;
    }

    /** Input RGB value of a color
    * @param red RGB value of red
    * @param green RGB value of green
    * @param blue RGB value of blue
    */
    //% block="RGB(red: %red|green: %green|blue: %blue|)"
    //% blockId=rgbColor
    //% group='Robot:bit'
    //% weight=0
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    export function rgbColor(red: number, green: number, blue: number):number {
        return ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | (blue & 0xFF);
    }
}

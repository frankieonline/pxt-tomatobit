

let _SEGMENTS = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, 0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71];

class TM1637LEDs {
    buf: Buffer;
    clk: DigitalPin;
    dio: DigitalPin;
    _ON: number;

    /** Initial TM1637 */
    init(): void {
        pins.digitalWritePin(this.clk, 0);
        pins.digitalWritePin(this.dio, 0);
        this._ON = 8;
        this.buf = pins.createBuffer(4);
        this.clear();
    }

    /** Start */
    _start() {
        pins.digitalWritePin(this.dio, 0);
        pins.digitalWritePin(this.clk, 0);
    }

    /** Stop */
    _stop() {
        pins.digitalWritePin(this.dio, 0);
        pins.digitalWritePin(this.clk, 1);
        pins.digitalWritePin(this.dio, 1);
    }

    /** Send command1 */
    _write_data_cmd() {
        this._start();
        this._write_byte(0x40);
        this._stop();
    }

    /** Send command3 */
    _write_dsp_ctrl() {
        this._start();
        this._write_byte(0x80 | this._ON | 7);
        this._stop();
    }

    /** Send a byte to 2-wire interface */
    _write_byte(b: number) {
        for (let i = 0; i < 8; i++) {
            pins.digitalWritePin(this.dio, (b >> i) & 1);
            pins.digitalWritePin(this.clk, 1);
            pins.digitalWritePin(this.clk, 0);
        }
        pins.digitalWritePin(this.clk, 1);
        pins.digitalWritePin(this.clk, 0);
    }

    /** Set data to TM1637, with given bit */
    _dat(bit: number, dat: number) {
        this._write_data_cmd();
        this._start();
        this._write_byte(0xC0 | (bit % 4))
        this._write_byte(dat);
        this._stop();
        this._write_dsp_ctrl();
    }

    /** Show a number in given position. */
    showbit(num: number = 5, bit: number = 0) {
        this.buf[bit % 4] = _SEGMENTS[num % 16];
        this._dat(bit, _SEGMENTS[num % 16]);
    }

    /** Show a number.  */
    showNumber(num: number) {
        if (num < 0) {
            this._dat(0, 0x40); // '-'
            num = -num;
        }
        else {
            this.showbit(Math.idiv(num, 1000) % 10);
        }
        this.showbit(num % 10, 3);
        this.showbit(Math.idiv(num, 10) % 10, 2);
        this.showbit(Math.idiv(num, 100) % 10, 1);
    }

    /** Show a hex number. */
    showHex(num: number) {
        if (num < 0) {
            this._dat(0, 0x40); // '-'
            num = -num;
        }
        else {
            this.showbit((num >> 12) % 16);
        }
        this.showbit(num % 16, 3);
        this.showbit((num >> 4) % 16, 2);
        this.showbit((num >> 8) % 16, 1);
    }

    /** Show or hide dot point. */
    showDP(bit: number = 1, show: boolean = true) {
        bit = bit % 4;
        if (show) this._dat(bit, this.buf[bit] | 0x80);
        else this._dat(bit, this.buf[bit] & 0x7F);
    }

    /** Clear LED. */
    clear() {
        for (let i = 0; i < 4; i++) {
            this._dat(i, 0);
            this.buf[i] = 0;
        }
    }

    /** Turn on LED. */
    on() {
        this._ON = 8;
        this._write_data_cmd();
        this._write_dsp_ctrl();
    }

    /** Turn off LED. */
    off() {
        this._ON = 0;
        this._write_data_cmd();
        this._write_dsp_ctrl();
    }

    /** Create TM1637LEDs */
    create(port: Ports) {
        let clk_Pin = PortDigi[port][0];
        let dio_Pin = PortDigi[port][1];

        this.clk = clk_Pin;
        this.dio = dio_Pin;
        this.init();
    }
}

//% blockId="mbridge7SegmentShowDigit" block="Me 7-Segment %port| show digit %num| at %index|"
//% group="mBridge"
//% weight=1
//% index.min = 0 index.max = 3
export function mbridge7SegmentShowDigit(port: Ports, num: number = 5, index: number = 0): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.showbit(num, index);
}

//% blockId="mbridge7SegmentShowNumber" block="Me 7-Segment %port| show number %num|"
//% group="mBridge"
//% weight=2
export function mbridge7SegmentShowNumber(port: Ports, num: number): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.showNumber(num);
}

//% blockId="mbridge7SegmentShowHex" block="Me 7-Segment %port| show hex number %num|"
//% group="mBridge"
//% weight=1
//% advanced=true
export function mbridge7SegmentShowHex(port: Ports, num: number): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.showHex(num);
}

//% blockId="mbridge7SegmentShowDecimalPoint" block="Me 7-Segment %port| show decimal point at %index|"
//% group="mBridge"
//% weight=1
//% advanced=true
//% index.min = 0 index.max = 3
export function mbridge7SegmentShowDecimalPoint(port: Ports, index: number): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.showDP(index, true);
}

//% blockId="mbridge7SegmentClear" block="Clear Me 7-Segment %port| display"
//% group="mBridge"
//% weight=2
export function mbridge7SegmentClear(port: Ports): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.clear();
}

//% blockId="mbridge7SegmentTurnOn" block="Turn on Me 7-Segment %port|"
//% group="mBridge"
//% weight=1
//% advanced=true
export function mbridge7SegmentTurnOn(port: Ports): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.on();
}

//% blockId="mbridge7SegmentTurnOff" block="Turn off Me 7-Segment %port|"
//% group="mBridge"
//% weight=1
//% advanced=true
export function mbridge7SegmentTurnOff(port: Ports): void {
    let tm = new TM1637LEDs();
    tm.create(port);
    tm.off();
}

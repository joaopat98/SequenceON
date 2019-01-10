import AccurateTimer from "accurate-timer-js"

class Timer {
    constructor(bpm, repeat) {
        this.cur = 0;
        this.callBacks = [];
        this.curCallBacks = [];
        this.bpm = bpm;
        this._timeUnit = 60 / 8 / bpm;
        this._repeat = repeat;
        this._setTimer();
        this.start();

    }

    _setTimer() {
        this._timer = new AccurateTimer(() => {
            this.callBacks.forEach(elem => elem(this.cur));
            this.curCallBacks.forEach(elem => elem(this.cur));
            this.cur = (this.cur + 1) % this._repeat;
        }, this._timeUnit * 1000);
    }

    setProgress(fraction) {
        if (fraction >= 0 && fraction <= 1) {
            this.cur = Math.floor(this._repeat * fraction);
            this.curCallBacks.forEach(elem => elem(this.cur));
        }
    }

    getProgress() {
        return this.cur / this._repeat;
    }

    registerCurCallback(cb) {
        if (this.curCallBacks.indexOf(cb) === -1)
            this.curCallBacks.push(cb);
    }

    removeCurCallback(cb) {
        if (this.curCallBacks.indexOf(cb) !== -1)
            this.curCallBacks.splice(this.callBacks.indexOf(cb), 1);
    }

    registerCallback(cb) {
        if (this.callBacks.indexOf(cb) === -1)
            this.callBacks.push(cb);
    }

    removeCallback(cb) {
        if (this.callBacks.indexOf(cb) !== -1)
            this.callBacks.splice(this.callBacks.indexOf(cb), 1);
    }

    setTime(bpm) {
        this.bpm = bpm;
        this._timeUnit = 60 / 8 / bpm;
        this.stop();
        this._setTimer();
        this.start();
    }

    setRepeat(i) {
        this._repeat = i;
        if (this.cur >= i)
            this.cur = 0;
    }

    start() {
        this.isRunning = true;
        this._timer.start();
    }

    stop() {
        this._timer.stop();
        this.callBacks.forEach(elem => elem(this.cur));
        this.curCallBacks.forEach(elem => elem(this.cur));
        this.isRunning = false;
    }

    timeUnits(i) {
        return this._timeUnit * i;
    }
}

export default Timer;
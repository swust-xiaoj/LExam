define(function (require) {
    function countdown(remaining, DOM, callback) {
        this.cd = remaining;
        this.dom = DOM;
        this.cb = callback;
        this.timer = null;
        return this.timer;
    }

    countdown.prototype.mmss = function(){
        var hours,
            minutes,
            seconds;


            // does the same job as parseInt truncates the float
            hours   = (this.cd / 3600) | 0;
            minutes = ((this.cd - hours * 60 * 60) / 60)   | 0;
            seconds = (this.cd % 60)   | 0;

            hours   = hours   < 10 ? "0" + hours   : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.dom.textContent = minutes + ":" + seconds;
            this.dom.dataset.remaining = this.cd;

            if (this.cd <= 0) {
                clearTimeout(this.timer);
                this.cb();
            } else {
                this.timer = setTimeout(this.mmss.bind(this), 1000);
                this.cd -= 1;
            }

    };

    countdown.prototype.chinesemmss = function(){
        var hours,
            minutes,
            seconds;


            hours   = (this.cd / 3600) | 0;
            minutes = ((this.cd - hours * 60 * 60) / 60)   | 0;
            seconds = (this.cd % 60)   | 0;

            hours   = hours   < 10 ? "0" + hours   : hours;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            this.dom.textContent = minutes + "分" + seconds + "秒";
            this.dom.dataset.remaining = this.cd;

            if (this.cd <= 0) {
                clearTimeout(this.timer);
                this.cb();
            } else {
                this.timer = setTimeout(this.chinesemmss.bind(this), 1000);
                this.cd -= 1;
            }

    };

    return countdown;
});

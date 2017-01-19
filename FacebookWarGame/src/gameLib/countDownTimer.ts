module FacebookWarGame.Client {
    export class CountDownTimer {
        endTime: number;
        hours: number;
        mins: number;
        time: Date;

        constructor(minutes: number, seconds: number) {
            this.endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
        }

        public getTimer(): string {
            let msLeft: number = this.endTime - (+new Date);
            if (this.timerExpired()) {
                return "";
            }
            else {
                this.time = new Date(msLeft);
                this.hours = this.time.getUTCHours();
                this.mins = this.time.getUTCMinutes();

                return ((this.hours ? this.hours + ':' + this.twoDigits(this.mins) : this.mins) + ':' + this.twoDigits(this.time.getUTCSeconds()));
            }
        }

        public getSecondsLeft(): number {
            let msLeft: number = this.endTime - (+new Date);
            return Math.floor(msLeft / 1000);
        }

        public timerExpired(): boolean {
            let msLeft: number = this.endTime - (+new Date);
            return (msLeft < 1000);
        }

        private twoDigits(n): string {
            return (n <= 9 ? "0" + n : n);
        }
    }
}
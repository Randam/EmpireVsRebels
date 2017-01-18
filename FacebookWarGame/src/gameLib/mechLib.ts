module FacebookWarGame.Client {
    export class MechLib {
        public static isRebels(faction: string): boolean {
            return (faction === "Rebels");
        }

        public static isEmpire(faction: string): boolean {
            return (faction === "Empire");
        }
    }

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
                return "Round ended!";
            }
            else {
                this.time = new Date(msLeft);
                this.hours = this.time.getUTCHours();
                this.mins = this.time.getUTCMinutes();

                return ("Round ends in: " + (this.hours ? this.hours + ':' + this.twoDigits(this.mins) : this.mins) + ':' + this.twoDigits(this.time.getUTCSeconds()));
            }
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
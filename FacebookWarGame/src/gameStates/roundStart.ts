module FacebookWarGame.Client {

    export class RoundStart extends Phaser.State {

        background: Phaser.TileSprite;
        countDownTimer: CountDownTimer;

        leader: User;
        leaderLabelText: Phaser.Text;
        leaderNameText: Phaser.Text;
        leaderFactionText: Phaser.Text;
        leaderScoreText: Phaser.Text;
        timerText: Phaser.Text;
        secondsLeft: number;

        init(leader: User) {
            this.leader = leader;
        }

        create() {
            this.countDownTimer = new CountDownTimer(0, 15);

            this.background = this.add.tileSprite(0, 0, 1280, 720, 'roundBackground');
            this.background.alpha = 0;

            this.leaderLabelText = this.game.add.text(game.world.centerX - 400, game.world.centerY - 45, "Round winner", { font: "12pt Arial Black", fill: "#AAAAAA", stroke: "#000000", strokeThickness: 3 });
            this.leaderNameText = this.game.add.text(game.world.centerX - 400, game.world.centerY, this.leader.name, { font: "24pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.leaderFactionText = this.game.add.text(game.world.centerX - 400, game.world.centerY + 45, this.leader.faction.toUpperCase(), { font: "12pt Arial Black", fill: "#AAAAAA", stroke: "#000000", strokeThickness: 3 });
            this.leaderScoreText = this.game.add.text(game.world.centerX - 400, game.world.centerY + 90, this.leader.score.toString() + " kills", { font: "24pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.timerText = this.game.add.text(game.world.centerX - 400, game.world.height - 50, this.countDownTimer.getTimer(), { font: "30pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.leaderLabelText.anchor.set(0, 0.5);
            this.leaderNameText.anchor.set(0, 0.5);
            this.leaderFactionText.anchor.set(0, 0.5);
            this.leaderScoreText.anchor.set(0, 0.5);
            this.timerText.anchor.set(0, 0.5);
            this.add.sound("timer");
            this.add.sound("clapping");
            this.sound.play("clapping");
            this.add.tween(this.background).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

            User.clearUserData();
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                this.countDownTimer = new CountDownTimer(0, 3);
            }

            if (this.countDownTimer.timerExpired()) {
                this.timerText.text = "NEXT ROUND STARTS NOW!"
                this.fadeOut();
            }
            else {
                this.timerText.text = "NEXT ROUND STARTS IN: " + this.countDownTimer.getTimer();
                
                if (this.secondsLeft != this.countDownTimer.getSecondsLeft()) {
                    this.secondsLeft = this.countDownTimer.getSecondsLeft();
                    if (this.secondsLeft <= 10) {
                        this.sound.play("timer");
                    }
                }
            }
        }

        fadeOut() {
            var tween = this.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('Arena', true, false);
        }

    }

}
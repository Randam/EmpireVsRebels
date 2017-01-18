module FacebookWarGame.Client {

    export class RoundStart extends Phaser.State {

        background: Phaser.TileSprite;

        create() {
            this.background = this.add.tileSprite(0, 0, 1280, 800, 'roundBackground');
            this.background.alpha = 0;

            this.add.tween(this.background).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);

            this.game.debug.text("Click to start the game", 0, this.world.height, "red");

            this.input.onDown.addOnce(this.fadeOut, this);
        }

        fadeOut() {
            this.add.audio('click', 1, false).play();

            var tween = this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startGame, this);
        }

        startGame() {
            this.game.state.start('Arena', true, false);
        }

    }

}
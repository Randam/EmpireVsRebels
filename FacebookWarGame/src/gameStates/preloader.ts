﻿module FacebookWarGame.Client {

    export class Preloader extends Phaser.State {
        loaderText: Phaser.Text;

        preload() {
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading the battlefield...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            this.load.spritesheet('ground', './assets/sprites/ground_tiles.png', 32, 32);
            this.load.image('bullet', './assets/sprites/bullet.png');
            this.load.audio('step', './assets/sounds/step3.wav', true);

            this.load.atlasJSONArray('MechRebels', './assets/sprites/Mech1.png', './assets/sprites/Mech1.json');
            this.load.atlasJSONArray('MechEmpire', './assets/sprites/Mech2.png', './assets/sprites/Mech2.json');
        }

        create() {
            var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 1000,
                Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startArena, this);
        }

        startArena() {
            this.game.state.start('Arena', true, false);
        }

    }

}
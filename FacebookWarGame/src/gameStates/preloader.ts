module FacebookWarGame.Client {

    export class Preloader extends Phaser.State {
        loaderText: Phaser.Text;

        preload() {
            this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading the battlefield...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
            this.loaderText.anchor.setTo(0.5);

            this.load.tilemap("arena", "./assets/sprites/arena.json", undefined, Phaser.Tilemap.TILED_JSON);
            this.load.image("ground", "./assets/sprites/mountain_landscape.png");
            this.load.image("bullet", "./assets/sprites/bullet.png");
            this.load.image("roundBackground", "./assets/ui/roundBackground.png");

            for (let i = 1; i <= 5; i++) {
                this.load.audio("explosion" + i.toString(), "./assets/sounds/Explosion" + i.toString() + ".mp3", true);
            }

            this.load.audio("timer", "./assets/sounds/Timer.wav", true);
            this.load.audio("step", "./assets/sounds/step3.wav", true);
            this.load.audio("laser", "./assets/sounds/laser2.wav", true);
            this.load.audio("clapping", "./assets/sounds/Clapping.wav", true);
            this.load.audio("start", "./assets/sounds/StartRound.wav", true);
            this.load.audio("bgm", "./assets/sounds/Destroyed.mp3", true);

            this.load.atlasJSONArray("MechRebels", "./assets/sprites/Mech1.png", "./assets/sprites/Mech1.json");
            this.load.atlasJSONArray("MechEmpire", "./assets/sprites/Mech2.png", "./assets/sprites/Mech2.json");
            this.load.atlasJSONArray("Explosion", "./assets/sprites/explosion.png", "./assets/sprites/explosion.json");
        }

        create() {
            var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 1000,
                Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startArena, this);
        }

        startArena() {
            this.game.state.start("Arena", true, false);
        }

    }

}
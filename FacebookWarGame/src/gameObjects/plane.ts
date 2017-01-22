module FacebookWarGame.Client {

    export class Plane extends Phaser.Sprite {
        planeSound: Phaser.Sound;
        user: User;

        constructor(game: Phaser.Game) {
            super(game, 0, game.world.height, "plane");

            this.visible = false;

            this.game.add.existing(this);
            this.game.physics.enable(this);

            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
        }

        startAirRaid(user: User) {
            this.user = user;
            this.reset(game.world.centerX + (MechLib.isRebels(this.user.faction) ? 400 : -400), this.game.height);
            this.body.velocity.y = -400;

            this.planeSound = this.game.sound.add("plane");
            this.planeSound.play();
        }
    }
}
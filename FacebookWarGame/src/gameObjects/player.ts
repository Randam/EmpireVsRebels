module FacebookWarGame.Client {

    export class Player extends Phaser.Sprite {
        public destination: Phaser.Point;
        public direction: Direction;
        public game: Phaser.Game;
        public bulletsToFire: number;
        public user: User;

        private walkingSound: Phaser.Sound;
        private firingSound: Phaser.Sound;
        private bullets: Phaser.Group;
        private bulletTime: number;
        private faction: string;
        private nameLabel: Phaser.Text;
        private score: number;

        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group) {
            super(game, x, y, "Mech" + faction, 1);
            this.faction = faction;
            this.game = game;
            this.bullets = bullets;
            this.destination = new Phaser.Point(0, 0);
            this.anchor.setTo(0.5);
            this.animations.add("walk-up", [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
            this.animations.add("walk-down", [16, 17, 18, 19, 20, 21, 22, 23], 15, true);
            this.animations.add("walk-left", [8, 9, 10, 11, 12, 13, 14, 15], 15, true);
            this.animations.add("walk-right", [24, 25, 26, 27, 28, 29, 30, 31], 15, true);
            this.game.add.existing(this);
            // physics
            this.game.physics.enable(this);
            this.body.collideWorldBounds = true;
            this.body.setCircle(20);
            this.walkingSound = game.add.sound("step", 0.5);
            this.firingSound = game.add.sound("laser");

            let style: any = { font: "12px Arial Black", fill: "#ffffff", align: "center" };
            this.nameLabel = this.game.add.text(this.x, this.y - 48, this.name, style);
            this.nameLabel.anchor.set(0.5);

            this.bulletTime = 0;
            this.bulletsToFire = 3;
        }

        kill(): Phaser.Sprite {
            this.nameLabel.text = "";
            super.kill();

            return this;
        }

        update(): void {
            if (this.alive && this.x > 0 && this.y > 0) {
                let mechSpeed: number = 80;

                if (Math.floor(this.destination.x / mechSpeed) < Math.floor(this.x / mechSpeed)) {
                    this.direction = Direction.Left;
                    this.body.velocity.x = -mechSpeed;
                    this.body.velocity.y = 0;
                } else if (Math.floor(this.destination.x / mechSpeed) > Math.floor(this.x / mechSpeed)) {
                    this.direction = Direction.Right;
                    this.body.velocity.x = mechSpeed;
                    this.body.velocity.y = 0;
                } else if (Math.floor(this.destination.y / mechSpeed) < Math.floor(this.y / mechSpeed)) {
                    this.direction = Direction.Up;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = -mechSpeed;
                } else if (Math.floor(this.destination.y / mechSpeed) > Math.floor(this.y / mechSpeed)) {
                    this.direction = Direction.Down;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = mechSpeed;
                } else {
                    this.destinationReached();
                }

                if (this.nameLabel.text === "") {
                    this.nameLabel.text = this.name;
                }

                switch (this.direction) {
                    case Direction.Up:
                        this.animations.play("walk-up");
                        break;
                    case Direction.Down:
                        this.animations.play("walk-down");
                        break;
                    case Direction.Left:
                        this.animations.play("walk-left");
                        break;
                    case Direction.Right:
                        this.animations.play("walk-right");
                        break;
                }

                if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
                    this.animations.stop();
                }

                this.nameLabel.x = this.x;
                this.nameLabel.y = this.y - 48;
            }
        }

        private destinationReached(): void {
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;

            if (this.bulletsToFire > 0) {
                this.fireBullet();
            }
            this.setNewDestination();
        }

        private setNewDestination(): void {
            this.bulletsToFire = Math.floor(Math.random() * 3) + 1;
            if (MechLib.isRebels(this.faction)) {
                this.destination = new Phaser.Point(
                    Math.floor(Math.random() * this.game.world.width * 0.25) + 1,
                    Math.floor(Math.random() * this.game.world.height - 1) + 1
                );
            } else {
                this.destination = new Phaser.Point(
                    Math.floor(this.game.world.width * 0.75 + Math.random() * this.game.world.width * 0.25),
                    Math.floor(Math.random() * this.game.world.height - 1) + 1
                );
            }
        }

        private fireBullet(): Bullet {
            let bulletSpeed: number = 400;
            let bulletDelay: number = 200;

            // to avoid them being allowed to fire too fast we set a time limit
            if (this.game.time.now > this.bulletTime) {
                //  grab the first bullet we can from the pool
                let bullet: Bullet = this.bullets.getFirstExists(false);

                if (MechLib.isRebels(this.faction)) { this.direction = Direction.Right; }
                if (MechLib.isEmpire(this.faction)) { this.direction = Direction.Left; }

                if (bullet) {
                    //  and fire it
                    switch (this.direction) {
                        case Direction.Up:
                            bullet.reset(this.x - 24, this.y - 24);
                            bullet.body.velocity.y = -bulletSpeed;
                            bullet.angle = 0;
                            break;
                        case Direction.Right:
                            bullet.reset(this.x + 10, this.y - 10);
                            bullet.body.velocity.x = bulletSpeed;
                            bullet.angle = 90;
                            break;
                        case Direction.Down:
                            bullet.reset(this.x + 24, this.y + 16);
                            bullet.body.velocity.y = bulletSpeed;
                            bullet.angle = 180;
                            break;
                        case Direction.Left:
                            bullet.reset(this.x - 10, this.y - 10);
                            bullet.body.velocity.x = -bulletSpeed;
                            bullet.angle = 270;
                            break;
                    }
                    bullet.firedBy = this;

                    this.firingSound.play();

                    this.bulletTime = this.game.time.now + bulletDelay;
                    this.bulletsToFire--;
                }

                return bullet;
            }
        }
    }
}
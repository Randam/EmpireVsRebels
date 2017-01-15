module FacebookWarGame.Client {

    export enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4
    }

    export class Player extends Phaser.Sprite {
        public destination: Phaser.Point;
        public direction: Direction;
        public game: Phaser.Game;

        private walkingSound: Phaser.Sound;
        private bullets: Phaser.Group;
        private bulletTime: number;
        private faction: string;
        private nameLabel: Phaser.Text;
        private bulletsToFire: number;

        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group) {
            super(game, x, y, 'Mech' + faction, 1);
            this.faction = faction;
            this.game = game;
            this.bullets = bullets;
            this.destination = new Phaser.Point(0, 0);
            this.anchor.setTo(0.5);
            this.animations.add('walk-up', [0, 1, 2, 3, 4, 5, 6, 7], 15, true);
            this.animations.add('walk-down', [16, 17, 18, 19, 20, 21, 22, 23], 15, true);
            this.animations.add('walk-left', [8, 9, 10, 11, 12, 13, 14, 15], 15, true);
            this.animations.add('walk-right', [24, 25, 26, 27, 28, 29, 30, 31], 15, true);
            this.game.add.existing(this);
            // Physics
            this.game.physics.enable(this);
            this.body.collideWorldBounds = true;
            this.body.setCircle(20);
            this.walkingSound = game.add.sound('step');

            let style = { font: "12px Arial Black", fill: "#ffffff", align: "center" };
            this.nameLabel = this.game.add.text(this.x, this.y - 48, this.name, style);
            this.nameLabel.anchor.set(0.5);

            this.bulletTime = 0;
            this.bulletsToFire = 3;
        }

        update() {
            if (this.alive && this.x > 0 && this.y > 0) {
                let mechSpeed: number = 80;

                if (Math.floor(this.destination.x / mechSpeed) < Math.floor(this.x / mechSpeed)) {
                    this.direction = Direction.Left;
                    this.body.velocity.x = -mechSpeed;
                    this.body.velocity.y = 0;
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (Math.floor(this.destination.x / mechSpeed) > Math.floor(this.x / mechSpeed)) {
                    this.direction = Direction.Right;
                    this.body.velocity.x = mechSpeed;
                    this.body.velocity.y = 0;
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (Math.floor(this.destination.y / mechSpeed) < Math.floor(this.y / mechSpeed)) {
                    this.direction = Direction.Up;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = -mechSpeed;
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (Math.floor(this.destination.y / mechSpeed) > Math.floor(this.y / mechSpeed)) {
                    this.direction = Direction.Down;
                    this.body.velocity.x = 0;
                    this.body.velocity.y = mechSpeed;
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else {
                    this.body.velocity.x = 0;
                    this.body.velocity.y = 0;

                    if (this.bulletsToFire > 0) {
                        this.fireBullet();
                    }
                }
                if (this.nameLabel.text == '') {
                    this.nameLabel.text = this.name;
                }


                switch (this.direction) {
                    case Direction.Up:
                        this.animations.play('walk-up');
                        break;
                    case Direction.Down:
                        this.animations.play('walk-down');
                        break;
                    case Direction.Left:
                        this.animations.play('walk-left');
                        break;
                    case Direction.Right:
                        this.animations.play('walk-right');
                        break;
                }

                if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
                    this.animations.stop();
                }

                this.nameLabel.x = this.x;
                this.nameLabel.y = this.y - 48;
            }
        }

        private fireBullet() {
            let bulletSpeed = 400;
            let bulletDelay = 200;

            //  To avoid them being allowed to fire too fast we set a time limit
            if (this.game.time.now > this.bulletTime) {
                //  Grab the first bullet we can from the pool
                let bullet: Phaser.Sprite = this.bullets.getFirstExists(false);

                if (this.faction == 'Rebels') this.direction = Direction.Right;
                if (this.faction == 'Empire') this.direction = Direction.Left;

                if (bullet) {
                    //  And fire it
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

                    this.bulletTime = this.game.time.now + bulletDelay;
                    this.bulletsToFire--;

                    if (this.bulletsToFire <= 0) {
                        this.bulletsToFire = Math.floor(Math.random() * 3) + 1;
                        if (this.faction == 'Rebels') {
                            this.destination = new Phaser.Point(Math.floor(Math.random() * this.game.world.width * 0.25) + 1, Math.floor(Math.random() * this.game.world.height - 1) + 1);
                        } else {
                            this.destination = new Phaser.Point(Math.floor(this.game.world.width * 0.75 + Math.random() * this.game.world.width * 0.25), Math.floor(Math.random() * this.game.world.height - 1) + 1);
                        }
                    }
                }
            }
        }
    }
}
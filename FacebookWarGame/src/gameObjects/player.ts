module FacebookWarGame.Client {

    export enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4
    }

    export class Player extends Phaser.Sprite {
        walkingSound: Phaser.Sound;
        game: Phaser.Game;
        bullets: Phaser.Group;
        bulletTime: number;
        direction: Direction;
        faction: string;
        nameLabel: Phaser.Text;

        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group) {
            super(game, x, y, 'Mech' + faction, 1);
            this.faction = faction;
            this.game = game;
            this.bullets = bullets;
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
        }

        update() {
            if (this.alive && this.x > 0 && this.y > 0) {
                let mechSpeed: number = 80;

                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                    this.fireBullet();
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                    this.direction = Direction.Up;
                    this.body.velocity.y = -mechSpeed;
                    this.animations.play('walk-up');
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                    this.direction = Direction.Down;
                    this.body.velocity.y = mechSpeed;
                    this.animations.play('walk-down');
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    this.direction = Direction.Left;
                    this.body.velocity.x = -mechSpeed;
                    this.animations.play('walk-left');
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                    this.direction = Direction.Right;
                    this.body.velocity.x = mechSpeed;
                    this.animations.play('walk-right');
                    if (!this.walkingSound.isPlaying)
                        this.walkingSound.play();
                } else {
                    this.animations.stop();
                }
                if (this.nameLabel.text == '') {
                    this.nameLabel.text = this.name;
       //             this.nameLabel.reset(this.x, this.y - 48);
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
                }
            }
        }
    }
}
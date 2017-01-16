var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 1280, 720, Phaser.AUTO, 'content', null);
                this.state.add('Boot', Client.Boot, false);
                this.state.add('Preloader', Client.Preloader, false);
                this.state.add('Arena', Client.Arena, false);
                this.state.start('Boot');
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
window.onload = function () {
    new FacebookWarGame.Client.GameEngine();
};
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        (function (Direction) {
            Direction[Direction["Up"] = 1] = "Up";
            Direction[Direction["Right"] = 2] = "Right";
            Direction[Direction["Down"] = 3] = "Down";
            Direction[Direction["Left"] = 4] = "Left";
        })(Client.Direction || (Client.Direction = {}));
        var Direction = Client.Direction;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var mechLib = (function () {
            function mechLib() {
            }
            mechLib.isRebels = function (faction) {
                return (faction == 'Rebels');
            };
            mechLib.isEmpire = function (faction) {
                return (faction == 'Empire');
            };
            return mechLib;
        }());
        Client.mechLib = mechLib;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(faction, game, x, y, bullets) {
                _super.call(this, game, x, y, 'Mech' + faction, 1);
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
                var style = { font: "12px Arial Black", fill: "#ffffff", align: "center" };
                this.nameLabel = this.game.add.text(this.x, this.y - 48, this.name, style);
                this.nameLabel.anchor.set(0.5);
                this.bulletTime = 0;
                this.bulletsToFire = 3;
            }
            Player.prototype.update = function () {
                if (this.alive && this.x > 0 && this.y > 0) {
                    var mechSpeed = 80;
                    if (Math.floor(this.destination.x / mechSpeed) < Math.floor(this.x / mechSpeed)) {
                        this.direction = Client.Direction.Left;
                        this.body.velocity.x = -mechSpeed;
                        this.body.velocity.y = 0;
                        if (!this.walkingSound.isPlaying)
                            this.walkingSound.play();
                    }
                    else if (Math.floor(this.destination.x / mechSpeed) > Math.floor(this.x / mechSpeed)) {
                        this.direction = Client.Direction.Right;
                        this.body.velocity.x = mechSpeed;
                        this.body.velocity.y = 0;
                        if (!this.walkingSound.isPlaying)
                            this.walkingSound.play();
                    }
                    else if (Math.floor(this.destination.y / mechSpeed) < Math.floor(this.y / mechSpeed)) {
                        this.direction = Client.Direction.Up;
                        this.body.velocity.x = 0;
                        this.body.velocity.y = -mechSpeed;
                        if (!this.walkingSound.isPlaying)
                            this.walkingSound.play();
                    }
                    else if (Math.floor(this.destination.y / mechSpeed) > Math.floor(this.y / mechSpeed)) {
                        this.direction = Client.Direction.Down;
                        this.body.velocity.x = 0;
                        this.body.velocity.y = mechSpeed;
                        if (!this.walkingSound.isPlaying)
                            this.walkingSound.play();
                    }
                    else {
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
                        case Client.Direction.Up:
                            this.animations.play('walk-up');
                            break;
                        case Client.Direction.Down:
                            this.animations.play('walk-down');
                            break;
                        case Client.Direction.Left:
                            this.animations.play('walk-left');
                            break;
                        case Client.Direction.Right:
                            this.animations.play('walk-right');
                            break;
                    }
                    if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
                        this.animations.stop();
                    }
                    this.nameLabel.x = this.x;
                    this.nameLabel.y = this.y - 48;
                }
            };
            Player.prototype.fireBullet = function () {
                var bulletSpeed = 400;
                var bulletDelay = 200;
                //  To avoid them being allowed to fire too fast we set a time limit
                if (this.game.time.now > this.bulletTime) {
                    //  Grab the first bullet we can from the pool
                    var bullet = this.bullets.getFirstExists(false);
                    if (Client.mechLib.isRebels(this.faction))
                        this.direction = Client.Direction.Right;
                    if (Client.mechLib.isEmpire(this.faction))
                        this.direction = Client.Direction.Left;
                    if (bullet) {
                        //  And fire it
                        switch (this.direction) {
                            case Client.Direction.Up:
                                bullet.reset(this.x - 24, this.y - 24);
                                bullet.body.velocity.y = -bulletSpeed;
                                bullet.angle = 0;
                                break;
                            case Client.Direction.Right:
                                bullet.reset(this.x + 10, this.y - 10);
                                bullet.body.velocity.x = bulletSpeed;
                                bullet.angle = 90;
                                break;
                            case Client.Direction.Down:
                                bullet.reset(this.x + 24, this.y + 16);
                                bullet.body.velocity.y = bulletSpeed;
                                bullet.angle = 180;
                                break;
                            case Client.Direction.Left:
                                bullet.reset(this.x - 10, this.y - 10);
                                bullet.body.velocity.x = -bulletSpeed;
                                bullet.angle = 270;
                                break;
                        }
                        this.bulletTime = this.game.time.now + bulletDelay;
                        this.bulletsToFire--;
                        if (this.bulletsToFire <= 0) {
                            this.bulletsToFire = Math.floor(Math.random() * 3) + 1;
                            if (Client.mechLib.isRebels(this.faction)) {
                                this.destination = new Phaser.Point(Math.floor(Math.random() * this.game.world.width * 0.25) + 1, Math.floor(Math.random() * this.game.world.height - 1) + 1);
                            }
                            else {
                                this.destination = new Phaser.Point(Math.floor(this.game.world.width * 0.75 + Math.random() * this.game.world.width * 0.25), Math.floor(Math.random() * this.game.world.height - 1) + 1);
                            }
                        }
                    }
                }
            };
            return Player;
        }(Phaser.Sprite));
        Client.Player = Player;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var Boot = (function (_super) {
            __extends(Boot, _super);
            function Boot() {
                _super.apply(this, arguments);
            }
            Boot.prototype.preload = function () {
                //You can preload an image here if you dont want to use text for the loading screen
            };
            Boot.prototype.create = function () {
                this.stage.setBackgroundColor(0xFFFFFF);
                this.input.maxPointers = 1;
                this.stage.disableVisibilityChange = true;
                if (this.game.device.desktop) {
                    this.scale.pageAlignHorizontally = true;
                }
                else {
                    // mobile
                    //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                    this.scale.minWidth = 480;
                    this.scale.minHeight = 260;
                    this.scale.maxWidth = 1280;
                    this.scale.maxHeight = 720;
                    this.scale.forceLandscape = true;
                    this.scale.pageAlignHorizontally = true;
                    this.scale.refresh();
                }
                this.game.state.start('Preloader', true, false);
            };
            return Boot;
        }(Phaser.State));
        Client.Boot = Boot;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var Arena = (function (_super) {
            __extends(Arena, _super);
            function Arena() {
                _super.apply(this, arguments);
            }
            Arena.prototype.create = function () {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.background = this.add.tileSprite(0, 0, 1280, 720, 'ground', 32);
                this.bulletsRebels = this.initBulletGroup('Rebels');
                this.bulletsEmpire = this.initBulletGroup('Empire');
                this.explosions = this.add.group();
                this.explosions.createMultiple(30, 'Explosion');
                this.explosions.callAll('animations.add', 'animations', 'Explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);
                this.rebels = this.initUnitGroup('Rebels');
                this.empire = this.initUnitGroup('Empire');
                this.unit = this.rebels.getFirstExists(false, true);
                this.unit.reset(this.world.centerX, this.world.centerX);
                this.unit.name = "Sam Derwort";
                this.unit.anchor.setTo(0.5);
                this.game.debug.text("Use arrow keys to move zig", 0, this.world.height - 8, "white");
            };
            Arena.prototype.update = function () {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                    this.unit = this.empire.getFirstExists(false, true);
                    this.unit.reset(this.world.width - 1, Math.floor(Math.random() * this.world.height - 1) + 1);
                    this.unit.anchor.setTo(0.5);
                    this.unit.name = "Jeroen Derwort";
                    var destinationX = Math.floor(this.world.width * 0.75 + Math.random() * this.world.width * 0.25);
                    var destinationY = Math.floor(Math.random() * this.world.height - 1) + 1;
                    this.unit.destination = new Phaser.Point(destinationX, destinationY);
                }
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                    this.unit = this.rebels.getFirstExists(false, true);
                    this.unit.reset(1, Math.floor(Math.random() * this.world.height - 1) + 1);
                    this.unit.anchor.setTo(0.5);
                    this.unit.name = "Annemarie Derwort-Steinvoort";
                    var destinationX = Math.floor(Math.random() * this.world.width * 0.25) + 1;
                    var destinationY = Math.floor(Math.random() * this.world.height - 1) + 1;
                    this.unit.destination = new Phaser.Point(destinationX, destinationY);
                }
                this.game.physics.arcade.overlap(this.bulletsEmpire, this.rebels, this.rebelHit, null, this);
                this.game.physics.arcade.overlap(this.bulletsRebels, this.empire, this.empireHit, null, this);
            };
            Arena.prototype.rebelHit = function (bullet, unit) {
                //  When a bullet hits an alien we kill them both
                bullet.kill();
                unit.name = '';
                unit.kill();
                //  Increase the score
                //score += 20;
                //scoreText.text = scoreString + score;
                //  And create an explosion :)
                var explosion = this.explosions.getFirstExists(false);
                explosion.reset(unit.body.x, unit.body.y);
                explosion.play('Explosion', 30, false, true);
            };
            Arena.prototype.empireHit = function (bullet, unit) {
            };
            Arena.prototype.initUnitGroup = function (faction) {
                var unitGroup = this.add.group();
                unitGroup.enableBody = true;
                unitGroup.physicsBodyType = Phaser.Physics.ARCADE;
                var bullets = Client.mechLib.isRebels(faction) ? this.bulletsRebels : this.bulletsEmpire;
                for (var i = 0; i < 30; i++) {
                    unitGroup.add(new Client.Player(faction, this.game, 0, 0, bullets));
                }
                unitGroup.setAll('anchor.x', 0.5);
                unitGroup.setAll('anchor.y', 0.5);
                unitGroup.setAll('outOfBoundsKill', false);
                unitGroup.setAll('checkWorldBounds', true);
                unitGroup.setAll('exists', false);
                return unitGroup;
            };
            Arena.prototype.initBulletGroup = function (faction) {
                var bullets = this.add.group();
                bullets.enableBody = true;
                bullets.physicsBodyType = Phaser.Physics.ARCADE;
                bullets.createMultiple(50, 'bullet');
                bullets.setAll('anchor.x', 0.5);
                bullets.setAll('anchor.y', 0.5);
                bullets.setAll('outOfBoundsKill', true);
                bullets.setAll('checkWorldBounds', true);
                return bullets;
            };
            return Arena;
        }(Phaser.State));
        Client.Arena = Arena;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading the battlefield...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.spritesheet('ground', './assets/sprites/ground_tiles.png', 32, 32);
                this.load.image('bullet', './assets/sprites/bullet.png');
                this.load.audio('step', './assets/sounds/step3.wav', true);
                this.load.atlasJSONArray('MechRebels', './assets/sprites/Mech1.png', './assets/sprites/Mech1.json');
                this.load.atlasJSONArray('MechEmpire', './assets/sprites/Mech2.png', './assets/sprites/Mech2.json');
                this.load.atlasJSONArray('Explosion', './assets/sprites/explosion.png', './assets/sprites/explosion.json');
            };
            Preloader.prototype.create = function () {
                var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startArena, this);
            };
            Preloader.prototype.startArena = function () {
                this.game.state.start('Arena', true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
//# sourceMappingURL=game.js.map
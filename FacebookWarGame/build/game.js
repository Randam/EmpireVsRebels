var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var FacebookComment = (function () {
            function FacebookComment() {
            }
            FacebookComment.prototype.getFaction = function () {
                if (this.isFaction()) {
                    return this.message.toLowerCase();
                }
                else {
                    return "";
                }
            };
            FacebookComment.prototype.isFaction = function () {
                var faction = this.message.toLowerCase();
                return (faction == "rebels" || faction == "empire");
            };
            FacebookComment.refreshList = function (pageId, postId, access_token, refreshId) {
                if (FacebookComment.updated)
                    return;
                var url = 'https://graph.facebook.com/v2.8/?ids=' + pageId + "_" + postId + '&fields=comments&access_token=' + access_token;
                $.getJSON(url, function (result) {
                    result = result[pageId + "_" + postId].comments.data;
                    FacebookComment.addRecordsFromJSON(result, refreshId);
                    FacebookComment.updated = true;
                });
            };
            FacebookComment.addRecordsFromJSON = function (jsonResult, refreshId) {
                $.each(jsonResult, function (index, obj) {
                    var fbComment = new FacebookComment();
                    fbComment.created_time = obj.created_time;
                    fbComment.fromId = obj.from.id;
                    fbComment.fromName = obj.from.name;
                    fbComment.id = obj.id;
                    fbComment.message = obj.message;
                    fbComment.refreshId = refreshId;
                    if (FacebookComment.findById(fbComment.id) == undefined) {
                        FacebookComment.list.push(fbComment);
                    }
                });
            };
            // get the new facebook comments since the last refresh
            FacebookComment.getNew = function (refreshId) {
                return FacebookComment.list.filter(function (ul) {
                    return ul.refreshId == refreshId;
                });
            };
            FacebookComment.findByFromId = function (fromId) {
                return FacebookComment.list.filter(function (ul) {
                    return ul.fromId == fromId;
                })[0];
            };
            FacebookComment.findById = function (id) {
                return FacebookComment.list.filter(function (ul) {
                    return ul.id == id;
                })[0];
            };
            FacebookComment.list = [];
            FacebookComment.updated = false;
            return FacebookComment;
        }());
        Client.FacebookComment = FacebookComment;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var FacebookTag = (function () {
            function FacebookTag(userId, tagId, refreshId) {
                this.userId = userId;
                this.tagId = tagId;
                this.refreshId = refreshId;
            }
            FacebookTag.exists = function (taggedId) {
                return (FacebookTag.list.filter(function (ul) {
                    return (ul.tagId == taggedId);
                })).length > 0;
            };
            FacebookTag.refreshList = function (access_token, refreshId) {
                if (FacebookTag.updated)
                    return;
                // check new facebook comments for tags
                //let comments = FacebookComment.getNew(refreshId);
                var comments = Client.FacebookComment.list;
                if (comments.length == 0) {
                    FacebookTag.updated = true;
                    return;
                }
                var commentIds = [];
                $.each(comments, function (index, obj) {
                    if (obj.message.length > 5)
                        commentIds.push(obj.id);
                });
                if (commentIds.length > 0) {
                    var url = "https://graph.facebook.com/v2.8/?ids=" + commentIds.join(",") + "&fields=message_tags&access_token=" + access_token;
                    $.getJSON(url, function (res) {
                        $.each(res, function (index, obj) {
                            if (obj.message_tags != undefined) {
                                if (!FacebookTag.exists(obj.message_tags[0].id)) {
                                    var userId = Client.FacebookComment.findById(obj.id).fromId;
                                    FacebookTag.list.push(new FacebookTag(userId, obj.message_tags[0].id, refreshId));
                                }
                            }
                        });
                        FacebookTag.updated = true;
                    });
                }
            };
            FacebookTag.list = [];
            FacebookTag.updated = false;
            return FacebookTag;
        }());
        Client.FacebookTag = FacebookTag;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var User = (function () {
            function User(name, faction, fbId) {
                this.name = name;
                this.fbId = fbId;
                this.faction = faction;
                this.score = 0;
                this.respawns = 0;
                this.kills = 0;
            }
            User.findById = function (fbId) {
                return User.list.filter(function (ul) {
                    return ul.fbId == fbId;
                })[0];
            };
            User.findByName = function (name) {
                return User.list.filter(function (ul) {
                    return ul.name == name;
                })[0];
            };
            User.clearUserData = function () {
                User.list.length = 0;
            };
            User.list = [];
            return User;
        }());
        Client.User = User;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
/// <reference path="../references.d.ts" />
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var GameEngine = (function (_super) {
            __extends(GameEngine, _super);
            function GameEngine() {
                _super.call(this, 1280, 720, Phaser.AUTO, "content", null);
                this.state.add("Boot", Client.Boot, false);
                this.state.add("Preloader", Client.Preloader, false);
                this.state.add("Arena", Client.Arena, false);
                this.state.add("RoundStart", Client.RoundStart, false);
                this.state.start("Boot");
            }
            return GameEngine;
        }(Phaser.Game));
        Client.GameEngine = GameEngine;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var access_token = '1850233771859903|UZReV_K_e2zP6w7y7xxOgfyNauU'; // PASTE HERE YOUR FACEBOOK ACCESS TOKEN
var pageId = '314813142252248'; // PASTE HERE YOUR PAGE ID
var postId = '325905601143002'; // PASTE HERE YOUR POST ID  
var refreshId = 0;
var game = null;
function addUnit(name, fbId, faction) {
    var user = FacebookWarGame.Client.User.findById(fbId);
    if (user === undefined) {
        user = new FacebookWarGame.Client.User(name, faction, undefined);
        FacebookWarGame.Client.User.list.push(user);
    }
    game.state.states.Arena.addUnitForUser(user);
}
window.onload = function () {
    game = new FacebookWarGame.Client.GameEngine();
    setInterval(processFacebookData, 4000);
    setInterval(updateGame, 500);
};
function processFacebookData() {
    // check for new comments containing a faction, and add a user to the game if he hasn't been added already
    FacebookWarGame.Client.FacebookComment.refreshList(pageId, postId, access_token, refreshId);
    // check for unique tags, and add/respawn a user if he has tagged someone and was previously in the game
    FacebookWarGame.Client.FacebookTag.refreshList(access_token, refreshId);
}
function updateGame() {
    if (FacebookWarGame.Client.FacebookComment.updated && FacebookWarGame.Client.FacebookTag.updated) {
        $.each(FacebookWarGame.Client.FacebookComment.list, function (index, comment) {
            if (comment.refreshId === refreshId) {
                if (comment.isFaction()) {
                    if (FacebookWarGame.Client.User.findById(comment.fromId) === undefined) {
                        var user = new FacebookWarGame.Client.User(comment.fromName, comment.getFaction(), comment.fromId);
                        game.state.states.Arena.addUnitForUser(user);
                    }
                }
            }
        });
        FacebookWarGame.Client.FacebookComment.updated = false;
        $.each(FacebookWarGame.Client.FacebookTag.list, function (index, tag) {
            if (tag.refreshId === refreshId) {
                if (FacebookWarGame.Client.User.findById(tag.userId) !== undefined) {
                    var comment = FacebookWarGame.Client.FacebookComment.findByFromId(tag.userId);
                    if (comment === undefined) {
                        var user = FacebookWarGame.Client.User.findById(comment.fromId);
                        if (user !== undefined) {
                            game.state.states.Arena.addUnitForUser(user);
                        }
                    }
                }
            }
        });
        FacebookWarGame.Client.FacebookTag.updated = false;
        refreshId++;
    }
}
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var CountDownTimer = (function () {
            function CountDownTimer(minutes, seconds) {
                this.endTime = (+new Date) + 1000 * (60 * minutes + seconds) + 500;
            }
            CountDownTimer.prototype.getTimer = function () {
                var msLeft = this.endTime - (+new Date);
                if (this.timerExpired()) {
                    return "";
                }
                else {
                    this.time = new Date(msLeft);
                    this.hours = this.time.getUTCHours();
                    this.mins = this.time.getUTCMinutes();
                    return ((this.hours ? this.hours + ':' + this.twoDigits(this.mins) : this.mins) + ':' + this.twoDigits(this.time.getUTCSeconds()));
                }
            };
            CountDownTimer.prototype.getSecondsLeft = function () {
                var msLeft = this.endTime - (+new Date);
                return Math.floor(msLeft / 1000);
            };
            CountDownTimer.prototype.timerExpired = function () {
                var msLeft = this.endTime - (+new Date);
                return (msLeft < 1000);
            };
            CountDownTimer.prototype.twoDigits = function (n) {
                return (n <= 9 ? "0" + n : n);
            };
            return CountDownTimer;
        }());
        Client.CountDownTimer = CountDownTimer;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var MechLib = (function () {
            function MechLib() {
            }
            MechLib.isRebels = function (faction) {
                return (faction === "rebels");
            };
            MechLib.isEmpire = function (faction) {
                return (faction === "empire");
            };
            return MechLib;
        }());
        Client.MechLib = MechLib;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
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
        var Bullet = (function (_super) {
            __extends(Bullet, _super);
            function Bullet(game, x, y) {
                _super.call(this, game, x, y, "bullet");
            }
            return Bullet;
        }(Phaser.Sprite));
        Client.Bullet = Bullet;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(faction, game, x, y, bullets) {
                _super.call(this, game, x, y, "Mech" + (faction == "rebels" ? "Rebels" : "Empire"), 1);
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
                var style = { font: "12px Arial Black", fill: "#ffffff", align: "center" };
                this.nameLabel = this.game.add.text(this.x, this.y - 48, this.name, style);
                this.nameLabel.anchor.set(0.5);
                this.bulletTime = 0;
                this.bulletsToFire = 3;
            }
            Player.prototype.kill = function () {
                this.nameLabel.text = "";
                _super.prototype.kill.call(this);
                return this;
            };
            Player.prototype.update = function () {
                var mechSpeed = 80;
                var healthRate = 0;
                if (this.alive && this.x > 0 && this.y > 0) {
                    if (Math.floor(this.destination.x / mechSpeed) < Math.floor(this.x / mechSpeed)) {
                        this.direction = Client.Direction.Left;
                        this.body.velocity.x = -mechSpeed;
                        this.body.velocity.y = 0;
                    }
                    else if (Math.floor(this.destination.x / mechSpeed) > Math.floor(this.x / mechSpeed)) {
                        this.direction = Client.Direction.Right;
                        this.body.velocity.x = mechSpeed;
                        this.body.velocity.y = 0;
                    }
                    else if (Math.floor(this.destination.y / mechSpeed) < Math.floor(this.y / mechSpeed)) {
                        this.direction = Client.Direction.Up;
                        this.body.velocity.x = 0;
                        this.body.velocity.y = -mechSpeed;
                    }
                    else if (Math.floor(this.destination.y / mechSpeed) > Math.floor(this.y / mechSpeed)) {
                        this.direction = Client.Direction.Down;
                        this.body.velocity.x = 0;
                        this.body.velocity.y = mechSpeed;
                    }
                    else {
                        this.destinationReached();
                    }
                    if (this.nameLabel.text === "") {
                        this.nameLabel.text = this.name;
                    }
                    switch (this.direction) {
                        case Client.Direction.Up:
                            this.animations.play("walk-up");
                            break;
                        case Client.Direction.Down:
                            this.animations.play("walk-down");
                            break;
                        case Client.Direction.Left:
                            this.animations.play("walk-left");
                            break;
                        case Client.Direction.Right:
                            this.animations.play("walk-right");
                            break;
                    }
                    if (this.body.velocity.x === 0 && this.body.velocity.y === 0) {
                        this.animations.stop();
                    }
                    this.nameLabel.x = this.x;
                    this.nameLabel.y = this.y - 48;
                    if (this.health < 100)
                        this.health += healthRate;
                }
            };
            Player.prototype.destinationReached = function () {
                this.body.velocity.x = 0;
                this.body.velocity.y = 0;
                if (this.bulletsToFire > 0) {
                    this.fireBullet();
                }
                this.setNewDestination();
            };
            Player.prototype.setNewDestination = function () {
                this.bulletsToFire = Math.floor(Math.random() * 3) + 1;
                if (Client.MechLib.isRebels(this.faction)) {
                    this.destination = new Phaser.Point(Math.floor(Math.random() * this.game.world.width * 0.25) + 1, Math.floor(Math.random() * this.game.world.height - 1) + 1);
                }
                else {
                    this.destination = new Phaser.Point(Math.floor(this.game.world.width * 0.75 + Math.random() * this.game.world.width * 0.25), Math.floor(Math.random() * this.game.world.height - 1) + 1);
                }
            };
            Player.prototype.fireBullet = function () {
                var bulletSpeed = 400;
                var bulletDelay = 200;
                // to avoid them being allowed to fire too fast we set a time limit
                if (this.game.time.now > this.bulletTime) {
                    //  grab the first bullet we can from the pool
                    var bullet = this.bullets.getFirstExists(false);
                    if (Client.MechLib.isRebels(this.faction)) {
                        this.direction = Client.Direction.Right;
                    }
                    if (Client.MechLib.isEmpire(this.faction)) {
                        this.direction = Client.Direction.Left;
                    }
                    if (bullet) {
                        //  and fire it
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
                        bullet.firedBy = this;
                        this.firingSound.play();
                        this.bulletTime = this.game.time.now + bulletDelay;
                        this.bulletsToFire--;
                    }
                    return bullet;
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
        var Arena = (function (_super) {
            __extends(Arena, _super);
            function Arena() {
                _super.apply(this, arguments);
                this.explodingSound = [];
            }
            Arena.prototype.create = function () {
                this.physics.startSystem(Phaser.Physics.ARCADE);
                this.map = game.add.tilemap("arena");
                this.map.addTilesetImage("mountain_landscape", "ground", 32, 32);
                var ground_layer = this.map.createLayer("ground_layer");
                var top_layer = this.map.createLayer("top_layer");
                this.countDownTimer = new Client.CountDownTimer(10, 0);
                this.leader = new Client.User("Annemarie Derwort-Steinvoort", "empire", "");
                this.leader.score = 0;
                this.leaderLabelText = this.game.add.text(game.world.centerX - 200, 70 - 14, "Current Leader", { font: "12pt Arial Black", fill: "#999999", stroke: "#000000", strokeThickness: 3 });
                this.leaderNameText = this.game.add.text(game.world.centerX - 200, 94 - 14, this.leader.name, { font: "18pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
                this.leaderFactionText = this.game.add.text(game.world.centerX - 200, 130 - 14, this.leader.faction.toUpperCase(), { font: "12pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });
                this.leaderScoreText = this.game.add.text(game.world.centerX + 214, 130 - 14, "Kills: " + this.leader.score.toString(), { font: "12pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
                this.timerText = this.game.add.text(game.world.centerX + 214, 166 - 14, this.countDownTimer.getTimer(), { font: "10pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });
                this.leaderLabelText.anchor.set(0);
                this.leaderNameText.anchor.set(0);
                this.leaderFactionText.anchor.set(0);
                this.leaderScoreText.anchor.set(1, 0);
                this.timerText.anchor.set(1, 0);
                this.bulletsRebels = this.initBulletGroup("rebels");
                this.bulletsEmpire = this.initBulletGroup("empire");
                this.rebels = this.initUnitGroup("rebels");
                this.empire = this.initUnitGroup("empire");
                this.explosions = this.add.group();
                this.explosions.createMultiple(60, "Explosion");
                this.explosions.callAll("animations.add", "animations", "Explosion", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);
                for (var i = 1; i <= 5; i++) {
                    this.explodingSound.push(this.add.sound("explosion" + i.toString()));
                }
                this.bgm = this.add.sound("bgm", 0.5, true);
                this.bgm.onDecoded.add(this.startMusic, this);
                this.add.sound("start", 0);
                this.sound.play("start");
                Client.User.clearUserData();
            };
            Arena.prototype.update = function () {
                if (this.countDownTimer.timerExpired()) {
                    this.timerText.text = "Round ended!";
                    this.bgm.onFadeComplete.add(this.roundNext, this);
                    this.bgm.fadeOut(500);
                }
                else {
                    this.timerText.text = "Round ends in: " + this.countDownTimer.getTimer();
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                        this.addEmpireUnit(new Client.User("Empire Robot", "empire"));
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                        this.addRebelsUnit(new Client.User("Rebel Mech", "rebels"));
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                        this.countDownTimer = new Client.CountDownTimer(0, 3);
                    }
                    if (this.empire.countLiving() === 0) {
                        this.rebels.setAll("bulletsToFire", 0);
                    }
                    if (this.rebels.countLiving() === 0) {
                        this.empire.setAll("bulletsToFire", 0);
                    }
                    this.game.physics.arcade.overlap(this.bulletsEmpire, this.rebels, this.rebelHit, undefined, this);
                    this.game.physics.arcade.overlap(this.bulletsRebels, this.empire, this.empireHit, undefined, this);
                }
            };
            Arena.prototype.addEmpireUnit = function (user) {
                var health = 110;
                return this.addUnit(user, health, this.empire, this.world.width - 1, Math.floor(Math.random() * this.world.height - 1) + 1, Math.floor(this.world.width * 0.75 + Math.random() * this.world.width * 0.25), Math.floor(Math.random() * this.world.height - 1) + 1);
            };
            Arena.prototype.addRebelsUnit = function (user) {
                var health = 110;
                return this.addUnit(user, health, this.rebels, 1, Math.floor(Math.random() * this.world.height - 1) + 1, Math.floor(Math.random() * this.world.width * 0.25) + 1, Math.floor(Math.random() * this.world.height - 1) + 1);
            };
            Arena.prototype.addUnitForUser = function (user) {
                if (Client.MechLib.isEmpire(user.faction))
                    this.addEmpireUnit(user);
                else
                    this.addRebelsUnit(user);
            };
            Arena.prototype.addUnit = function (user, health, units, startX, startY, destX, destY) {
                var existingUnits = units.filter(function (child, index, children) {
                    return (child.name == user.name);
                }, true);
                if (existingUnits.total == 0) {
                    var unit = units.getFirstExists(false, true);
                    unit.user = user;
                    unit.reset(startX, startY);
                    unit.anchor.setTo(0.5);
                    unit.name = user.name;
                    unit.health = health;
                    unit.destination = new Phaser.Point(destX, destY);
                    return unit;
                }
                return existingUnits[0];
            };
            Arena.prototype.rebelHit = function (bullet, unit) {
                this.unitHit(bullet, unit);
            };
            Arena.prototype.empireHit = function (bullet, unit) {
                this.unitHit(bullet, unit);
            };
            Arena.prototype.unitHit = function (bullet, unit) {
                bullet.kill();
                unit.health -= 25;
                if (unit.health <= 0) {
                    var destroyedText = unit.name + " was destroyed. ";
                    var killText = ((bullet.firedBy.name != "") ? bullet.firedBy.name + " scored a kill!" : "");
                    this.game.debug.text(destroyedText + killText, 0, this.world.height - 8, "white");
                    unit.name = "";
                    unit.kill();
                    this.explodingSound[Math.floor(Math.random() * (this.explodingSound.length - 1)) + 1].play();
                    var explosion = this.explosions.getFirstExists(false);
                    explosion.scale = new Phaser.Point(1, 1);
                    explosion.reset(unit.body.x, unit.body.y);
                    explosion.play("Explosion", 30, false, true);
                    if (bullet.firedBy.user != undefined) {
                        bullet.firedBy.user.score++;
                        if (bullet.firedBy.user.score > this.leader.score) {
                            this.leader = bullet.firedBy.user;
                            this.leaderNameText.text = this.leader.name;
                            this.leaderFactionText.text = this.leader.faction;
                            this.leaderScoreText.text = "Kills: " + this.leader.score.toString();
                        }
                    }
                }
                else {
                    this.explodingSound[0].play("", 0, 0.5);
                    var explosion = this.explosions.getFirstExists(false);
                    explosion.scale = new Phaser.Point(0.2, 0.2);
                    explosion.reset(bullet.body.x, bullet.body.y);
                    explosion.play("Explosion", 60, false, true);
                }
            };
            Arena.prototype.initUnitGroup = function (faction) {
                var unitGroup = this.add.group();
                unitGroup.enableBody = true;
                unitGroup.physicsBodyType = Phaser.Physics.ARCADE;
                var bullets = Client.MechLib.isRebels(faction) ? this.bulletsRebels : this.bulletsEmpire;
                for (var i = 0; i < 30; i++) {
                    unitGroup.add(new Client.Player(faction, this.game, 0, 0, bullets));
                }
                unitGroup.setAll("anchor.x", 0.5);
                unitGroup.setAll("anchor.y", 0.5);
                unitGroup.setAll("outOfBoundsKill", false);
                unitGroup.setAll("checkWorldBounds", true);
                unitGroup.setAll("alive", false);
                unitGroup.setAll("exists", false);
                return unitGroup;
            };
            Arena.prototype.initBulletGroup = function (faction) {
                var bullets = this.add.group();
                bullets.enableBody = true;
                bullets.physicsBodyType = Phaser.Physics.ARCADE;
                for (var i = 0; i < 50; i++) {
                    bullets.add(new Client.Bullet(this.game, 0, 0));
                }
                bullets.setAll("anchor.x", 0.5);
                bullets.setAll("anchor.y", 0.5);
                bullets.setAll("outOfBoundsKill", true);
                bullets.setAll("checkWorldBounds", true);
                bullets.setAll("alive", false);
                bullets.setAll("exists", false);
                return bullets;
            };
            Arena.prototype.startMusic = function () {
                this.bgm.volume = 0.5;
                this.bgm.loop = true;
                this.bgm.play();
            };
            Arena.prototype.roundNext = function () {
                var leader = this.leader;
                this.game.state.start("RoundStart", true, false, leader);
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
                this.game.state.start("Preloader", true, false);
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
        var Preloader = (function (_super) {
            __extends(Preloader, _super);
            function Preloader() {
                _super.apply(this, arguments);
            }
            Preloader.prototype.preload = function () {
                this.loaderText = this.game.add.text(this.world.centerX, 200, "Loading the battlefield...", { font: "18px Arial", fill: "#A9A91111", align: "center" });
                this.loaderText.anchor.setTo(0.5);
                this.load.tilemap("arena", "./assets/sprites/arena.json", undefined, Phaser.Tilemap.TILED_JSON);
                this.load.image("ground", "./assets/sprites/mountain_landscape.png");
                this.load.image("bullet", "./assets/sprites/bullet.png");
                this.load.image("roundBackground", "./assets/ui/roundBackground.png");
                for (var i = 1; i <= 5; i++) {
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
            };
            Preloader.prototype.create = function () {
                var tween = this.add.tween(this.loaderText).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startArena, this);
            };
            Preloader.prototype.startArena = function () {
                this.game.state.start("Arena", true, false);
            };
            return Preloader;
        }(Phaser.State));
        Client.Preloader = Preloader;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
var FacebookWarGame;
(function (FacebookWarGame) {
    var Client;
    (function (Client) {
        var RoundStart = (function (_super) {
            __extends(RoundStart, _super);
            function RoundStart() {
                _super.apply(this, arguments);
            }
            RoundStart.prototype.init = function (leader) {
                this.leader = leader;
            };
            RoundStart.prototype.create = function () {
                this.countDownTimer = new Client.CountDownTimer(0, 15);
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
            };
            RoundStart.prototype.update = function () {
                if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
                    this.countDownTimer = new Client.CountDownTimer(0, 3);
                }
                if (this.countDownTimer.timerExpired()) {
                    this.timerText.text = "NEXT ROUND STARTS NOW!";
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
            };
            RoundStart.prototype.fadeOut = function () {
                var tween = this.add.tween(this.background).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(this.startGame, this);
            };
            RoundStart.prototype.startGame = function () {
                this.game.state.start('Arena', true, false);
            };
            return RoundStart;
        }(Phaser.State));
        Client.RoundStart = RoundStart;
    })(Client = FacebookWarGame.Client || (FacebookWarGame.Client = {}));
})(FacebookWarGame || (FacebookWarGame = {}));
//# sourceMappingURL=game.js.map
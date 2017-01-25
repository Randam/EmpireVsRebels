module FacebookWarGame.Client {

    export class Arena extends Phaser.State {
        bgm: Phaser.Sound;
        airRaidSound: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        map: Phaser.Tilemap;
        leader: User;
        plane: Plane;

        empireScore: number;
        rebelsScore: number;

        leaderLabelText: Phaser.Text;
        leaderNameText: Phaser.Text;
        leaderFactionText: Phaser.Text;
        leaderScoreText: Phaser.Text;
        timerText: Phaser.Text;

        rebelsText: Phaser.Text;
        vsText: Phaser.Text;
        empireText: Phaser.Text;

        rebelsScoreText: Phaser.Text;
        empireScoreText: Phaser.Text;

        airRaidText: Phaser.Text;
        airRaidTimer: number;
        airRaidUser: User;

        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        explodingSound: Array<Phaser.Sound> = [];

        countDownTimer: CountDownTimer;

        create(): void {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = game.add.tilemap("arena");
            this.map.addTilesetImage("mountain_landscape", "ground", 32, 32);
            let ground_layer: Phaser.TilemapLayer = this.map.createLayer("ground_layer");
            let top_layer: Phaser.TilemapLayer = this.map.createLayer("top_layer");

            this.countDownTimer = new CountDownTimer(10, 0);

            this.leader = new User("Lord Helmet", "empire", "");
            this.leader.score = 0;
            this.rebelsScore = 0;
            this.empireScore = 0;

            this.leaderLabelText = this.game.add.text(game.world.centerX - 200, 70 - 14, "Current Leader", { font: "12pt Arial Black", fill: "#999999", stroke: "#000000", strokeThickness: 3 });
            this.leaderNameText = this.game.add.text(game.world.centerX - 200, 94 - 14, this.leader.name, { font: "18pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.leaderFactionText = this.game.add.text(game.world.centerX - 200, 130 - 14, this.leader.faction.toUpperCase(), { font: "12pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });
            this.leaderScoreText = this.game.add.text(game.world.centerX + 214, 130 - 14, "Kills: " + this.leader.score.toString(), { font: "12pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.timerText = this.game.add.text(game.world.centerX + 214, 166 - 14, this.countDownTimer.getTimer(), { font: "10pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });

            this.rebelsText = this.game.add.text(game.world.centerX - 500, game.world.height - 36, "REBELS", { font: "16pt Arial Black", fill: "#009900", stroke: "#000000", strokeThickness: 3 });
            this.empireText = this.game.add.text(game.world.centerX + 500, game.world.height - 36, "EMPIRE", { font: "16pt Arial Black", fill: "#990000", stroke: "#000000", strokeThickness: 3 });
            this.vsText = this.game.add.text(game.world.centerX, game.world.height - 16, "vs", { font: "12pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });
            this.rebelsScoreText = this.game.add.text(game.world.centerX - 500, game.world.height - 16, "0", { font: "12pt Arial Black", fill: "#009900", stroke: "#000000", strokeThickness: 3 });
            this.empireScoreText = this.game.add.text(game.world.centerX + 500, game.world.height - 16, "0", { font: "12pt Arial Black", fill: "#990000", stroke: "#000000", strokeThickness: 3 });
            this.airRaidText = this.game.add.text(game.world.centerX, game.world.centerY, "", { font: "24pt Arial Black", fill: "#cccccc", stroke: "#000000", strokeThickness: 5 });

            this.rebelsText.anchor.set(0.5);
            this.rebelsScoreText.anchor.set(0.5);
            this.empireText.anchor.set(0.5);
            this.empireScoreText.anchor.set(0.5);
            this.vsText.anchor.set(0.5);
            this.airRaidText.anchor.set(0.5);

            this.leaderLabelText.anchor.set(0);
            this.leaderNameText.anchor.set(0);
            this.leaderFactionText.anchor.set(0);
            this.leaderScoreText.anchor.set(1, 0);
            this.timerText.anchor.set(1, 0);

            this.bulletsRebels = this.initBulletGroup("rebels");
            this.bulletsEmpire = this.initBulletGroup("empire");

            this.rebels = this.initUnitGroup("rebels");
            this.empire = this.initUnitGroup("empire");

            this.plane = new Plane(this.game);

            this.plane.anchor.set(0.5);
            this.game.add.existing(this.plane);

            this.explosions = this.add.group();
            this.explosions.createMultiple(30, "Explosion");
            this.explosions.callAll(
                "animations.add",
                "animations",
                "Explosion",
                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                20,
                true
            );
            for (let i: number = 1; i <= 5; i++) {
                this.explodingSound.push(this.add.sound("explosion" + i.toString()));
            }

            this.bgm = this.add.sound("bgm", 0.5, true);
            this.bgm.onDecoded.add(this.startMusic, this);

            this.airRaidSound = this.add.sound("alarm");

            this.add.sound("start");
            this.sound.play("start");

        }

        update(): void {
            if (this.countDownTimer.timerExpired()) {
                this.roundNext();
                return;
            }
            else {
                this.timerText.text = "Round ends in: " + this.countDownTimer.getTimer();

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                    let user: User = new User("Empire Robot", "empire", "0");
                    User.list.push(user);
                    this.addEmpireUnit(user);
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                    let user: User = new User("Rebel Mech", "rebels", "0");
                    User.list.push(user);
                    this.addRebelsUnit(user);
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC) && this.countDownTimer.getSecondsLeft() > 3) {
                    this.countDownTimer = new CountDownTimer(0, 3);
                }

                if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && !this.isAirRaidInProgress()) {
                    this.prepareAirRaid(User.list[Math.floor(Math.random() * User.list.length)]);
                }

                if (this.airRaidSound.isPlaying) {
                    if (this.game.time.elapsed % 2 == 0) {
                        this.airRaidText.fontSize = +this.airRaidText.fontSize + 1;
                    }
                }

                if (this.empire.countLiving() === 0) {
                    this.rebels.setAll("bulletsToFire", 0);
                }
                if (this.rebels.countLiving() === 0) {
                    this.empire.setAll("bulletsToFire", 0);
                }

                if (this.empire.countLiving() < 2) {
                    let user: User = new User("Empire Robot " + (this.empire.countLiving() + 1).toString(), "empire", "0");
                    User.list.push(user);
                    this.addEmpireUnit(user);
                }
                if (this.rebels.countLiving() < 2) {
                    let user: User = new User("Rebels Mech " + (this.rebels.countLiving() + 1).toString(), "rebels", "0");
                    User.list.push(user);
                    this.addRebelsUnit(user);
                }

                this.game.physics.arcade.overlap(this.bulletsEmpire, this.rebels, this.rebelHitByBullet, undefined, this);
                this.game.physics.arcade.overlap(this.bulletsRebels, this.empire, this.empireHitByBullet, undefined, this);
                this.game.physics.arcade.overlap(this.plane, this.rebels, this.rebelHitByPlane, undefined, this);
                this.game.physics.arcade.overlap(this.plane, this.empire, this.empireHitByPlane, undefined, this);
            }
        }

        public prepareAirRaid(airRaidUser: User) {
            this.airRaidUser = airRaidUser;
            this.airRaidText.visible = true;
            this.airRaidText.fontSize = 1;
            this.airRaidText.text = this.airRaidUser.faction.toUpperCase() + " Air Strike incoming!"; // + this.airRaidUser.name;
            this.airRaidSound.onStop.add(this.startAirRaid, this);
            this.airRaidSound.play();
        }

        private startAirRaid() {
            this.airRaidText.visible = false;
            this.plane.startAirRaid(this.airRaidUser);
        }

        private isAirRaidInProgress(): boolean {
            if (this.plane.visible)
                return true;

            if (this.airRaidSound.isPlaying)
                return true;

            return false;
        }

        public addEmpireUnit(user: User): Player {
            let health: number = (user == undefined || user.fbId == "0") ? 10 : 100;

            return this.addUnit(
                user,
                health,
                this.empire,
                this.world.width - 1,
                Math.floor(Math.random() * this.world.height - 1) + 1,
                Math.floor(this.world.width * 0.75 + Math.random() * this.world.width * 0.25),
                Math.floor(Math.random() * this.world.height - 1) + 1);
        }

        public addRebelsUnit(user: User): Player {
            let health: number = (user == undefined || user.fbId == "0") ? 10 : 100;

            return this.addUnit(
                user,
                health,
                this.rebels,
                1,
                Math.floor(Math.random() * this.world.height - 1) + 1,
                Math.floor(Math.random() * this.world.width * 0.25) + 1,
                Math.floor(Math.random() * this.world.height - 1) + 1);
        }

        public addUnitForUser(user: User) {
            if (MechLib.isEmpire(user.faction))
                this.addEmpireUnit(user);
            else
                this.addRebelsUnit(user);
        }

        private addUnit(user: User, health: number, units: Phaser.Group, startX: number, startY: number, destX: number, destY: number): Player {
            let existingUnits = units.filter(function (child, index, children) {
                return (child.name == user.name);
            }, true);

            if (existingUnits.total == 0) {

                let unit: Player = units.getFirstExists(false, true);
                unit.user = user;
                unit.reset(startX, startY);
                unit.anchor.setTo(0.5);
                unit.name = user.name;
                unit.health = health;
                unit.destination = new Phaser.Point(destX, destY);
                unit.setLabelColor((unit.user.fbId == "0") ? "#999999" : "#ffffff");

                return unit;
            }

            return existingUnits[0];
        }

        private rebelHitByBullet(bullet: Bullet, unit: Player): void {
            this.unitHitByBullet(bullet, unit);
        }

        private empireHitByBullet(bullet: Bullet, unit: Player): void {
            this.unitHitByBullet(bullet, unit);
        }

        private rebelHitByPlane(plane: Plane, unit: Player): void {
            this.unitHitByPlane(plane, unit);
        }

        private empireHitByPlane(plane: Plane, unit: Player): void {
            this.unitHitByPlane(plane, unit);
        }

        private unitHitByBullet(bullet: Bullet, unit: Player): void {
            bullet.kill();
            this.unitHit(bullet, bullet.firedBy.user, unit);
        }

        private unitHitByPlane(plane: Plane, unit: Player): void {
            this.unitHit(plane, plane.user, unit);
        }

        private unitHit(collider: Phaser.Sprite, user: User, unit: Player): void {
            unit.health -= 15;

            if (unit.health <= 0) {
                let destroyedText: string = unit.name + " was destroyed. ";
                let killText: string = ((user != undefined && user.name != "") ? user.name + " scored a kill!" : "");

                this.game.debug.text(
                    destroyedText + killText,
                    0,
                    this.world.height - 8,
                    "white"
                );

                unit.name = "";
                unit.kill();

                this.explodingSound[Math.floor(Math.random() * (this.explodingSound.length - 1)) + 1].play();
                var explosion: Phaser.Sprite = this.explosions.getFirstExists(false);
                explosion.scale = new Phaser.Point(1, 1);
                explosion.reset(unit.body.x, unit.body.y);
                explosion.play("Explosion", 30, false, true);

                if (user != undefined) {
                    user.score++;
                    if (MechLib.isEmpire(user.faction)) {
                        this.empireScore++;
                    }
                    else {
                        this.rebelsScore++;
                    }
                    this.rebelsScoreText.text = this.rebelsScore.toString();
                    this.empireScoreText.text = this.empireScore.toString();

                    if (user.score > this.leader.score || user.name == this.leader.name) {
                        if (user.fbId != "0") {
                            this.leader = user;
                            this.leaderNameText.text = this.leader.name;
                            this.leaderFactionText.text = this.leader.faction;
                            this.leaderScoreText.text = "Kills: " + this.leader.score.toString();
                        }
                    }
                }
            } else {
                this.explodingSound[0].play("", 0, 0.5);
                var explosion: Phaser.Sprite = this.explosions.getFirstExists(false);
                explosion.scale = new Phaser.Point(0.2, 0.2);
                explosion.reset(collider.body.x, collider.body.y);
                explosion.play("Explosion", 30, false, true);
            }
        }

        private initUnitGroup(faction: string): Phaser.Group {
            let unitGroup: Phaser.Group = this.add.group();
            unitGroup.enableBody = true;
            unitGroup.physicsBodyType = Phaser.Physics.ARCADE;

            let bullets: Phaser.Group = MechLib.isRebels(faction) ? this.bulletsRebels : this.bulletsEmpire;

            for (let i: number = 0; i < 30; i++) {
                unitGroup.add(new Player(faction, this.game, 0, 0, bullets));
            }
            unitGroup.setAll("anchor.x", 0.5);
            unitGroup.setAll("anchor.y", 0.5);
            unitGroup.setAll("outOfBoundsKill", false);
            unitGroup.setAll("checkWorldBounds", true);
            unitGroup.setAll("alive", false);
            unitGroup.setAll("exists", false);

            return unitGroup;
        }

        private initBulletGroup(faction: string): Phaser.Group {
            let bullets: Phaser.Group = this.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            for (let i: number = 0; i < 30; i++) {
                bullets.add(new Bullet(this.game, 0, 0));
            }

            bullets.setAll("anchor.x", 0.5);
            bullets.setAll("anchor.y", 0.5);
            bullets.setAll("outOfBoundsKill", true);
            bullets.setAll("checkWorldBounds", true);
            bullets.setAll("alive", false);
            bullets.setAll("exists", false);

            return bullets;
        }

        startMusic() {
            this.bgm.volume = 0.5;
            this.bgm.loop = true;
            this.bgm.play();
        }

        roundNext() {
            let leader: User = this.leader;

            this.timerText.text = "Round ended!";

            let leadingFactionScore: number = (this.empireScore > this.rebelsScore) ? this.empireScore : this.rebelsScore;
            let leadingFaction: string = (this.empireScore > this.rebelsScore) ? "empire" : "rebels";

            this.bgm.stop();
            this.bgm.destroy();
            this.game.state.start("RoundStart", true, false, { leader, leadingFaction, leadingFactionScore })
        }
    }
}
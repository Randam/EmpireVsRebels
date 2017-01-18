module FacebookWarGame.Client {

    export class Arena extends Phaser.State {
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        map: Phaser.Tilemap;
        leader: User;

        leaderLabelText: Phaser.Text;
        leaderNameText: Phaser.Text;
        leaderFactionText: Phaser.Text;
        leaderScoreText: Phaser.Text;
        timerText: Phaser.Text;
        timeLeft: number;

        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        explodingSound: Array<Phaser.Sound> = [];

        countDownTimer: CountDownTimer;

        create(): void {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.map = game.add.tilemap("arena");
            this.map.addTilesetImage("ground_tiles", "ground", 32, 32);
            let layer: Phaser.TilemapLayer = this.map.createLayer("ground_layer");

            this.countDownTimer = new CountDownTimer(0, 3);

            this.leader = new User("Jeroen Derwort", "Empire", "");
            this.leader.score = 0;

            this.leaderLabelText = this.game.add.text(game.world.centerX - 200, 70, "Current Leader", { font: "10pt Arial Black", fill: "#999999", stroke: "#000000", strokeThickness: 3 });
            this.leaderNameText = this.game.add.text(game.world.centerX - 200, 94, this.leader.name, { font: "18pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.leaderFactionText = this.game.add.text(game.world.centerX - 200, 130, "[" + this.leader.faction + "]", { font: "10pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 3 });
            this.leaderScoreText = this.game.add.text(game.world.centerX + 160, 76, this.leader.score.toString(), { font: "40pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 5 });
            this.timerText = this.game.add.text(game.world.centerX + 224, 40, this.countDownTimer.getTimer(), { font: "10pt Arial Black", fill: "#ffffff", stroke: "#000000", strokeThickness: 1 });
            this.leaderLabelText.anchor.set(0);
            this.leaderNameText.anchor.set(0);
            this.leaderFactionText.anchor.set(0);
            this.leaderScoreText.anchor.set(0);
            this.timerText.anchor.set(1, 0);

            this.bulletsRebels = this.initBulletGroup("Rebels");
            this.bulletsEmpire = this.initBulletGroup("Empire");

            this.rebels = this.initUnitGroup("Rebels");
            this.empire = this.initUnitGroup("Empire");

            this.explosions = this.add.group();
            this.explosions.createMultiple(60, "Explosion");
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
        }

        update(): void {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                this.addEmpireUnit(new User("Empire Robot", "Empire"));
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                this.addRebelsUnit(new User("Rebel Mech", "Rebels"));
            }

            if (this.empire.countLiving() === 0) {
                this.rebels.setAll("bulletsToFire", 0);
            }
            if (this.rebels.countLiving() === 0) {
                this.empire.setAll("bulletsToFire", 0);
            }
            this.game.physics.arcade.overlap(this.bulletsEmpire, this.rebels, this.rebelHit, undefined, this);
            this.game.physics.arcade.overlap(this.bulletsRebels, this.empire, this.empireHit, undefined, this);

            this.timerText.text = this.countDownTimer.getTimer();

            if (this.countDownTimer.timerExpired())
                this.roundEnd();
        }

        public addEmpireUnit(user: User): Player {
            let health: number = 110;

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
            let health: number = 110;

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
            let unit: Player = units.getFirstExists(false, true);
            unit.user = user;
            unit.reset(startX, startY);
            unit.anchor.setTo(0.5);
            unit.name = user.name;
            unit.health = health;
            unit.destination = new Phaser.Point(destX, destY);

            return unit;
        }

        private rebelHit(bullet: Bullet, unit: Player): void {
            this.unitHit(bullet, unit);
        }

        private empireHit(bullet: Bullet, unit: Player): void {
            this.unitHit(bullet, unit);
        }

        private unitHit(bullet: Bullet, unit: Player): void {
            bullet.kill();
            unit.health -= 25;

            if (unit.health <= 0) {
                let destroyedText: string = unit.name + " was destroyed. ";
                let killText: string = ((bullet.firedBy.name != "") ? bullet.firedBy.name + " scored a kill!" : "");

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
                explosion.scale = new Phaser.Point (1, 1);
                explosion.reset(unit.body.x, unit.body.y);
                explosion.play("Explosion", 30, false, true);

                if (bullet.firedBy.user != undefined) {
                    bullet.firedBy.user.score++;

                    if (bullet.firedBy.user.score > this.leader.score) {
                        this.leader = bullet.firedBy.user;
                        this.leaderNameText.text = this.leader.name;
                        this.leaderFactionText.text = this.leader.faction;
                        this.leaderScoreText.text = this.leader.score.toString();
                    }
                }
            } else {
                this.explodingSound[0].play("", 0, 0.5);
                var explosion: Phaser.Sprite = this.explosions.getFirstExists(false);
                explosion.scale = new Phaser.Point(0.2, 0.2);
                explosion.reset(bullet.body.x, bullet.body.y);
                explosion.play("Explosion", 60, false, true);
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
            for (let i: number = 0; i < 50; i++) {
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

        roundEnd() {
            this.game.state.start("RoundStart", true, false);
        }

    }
}
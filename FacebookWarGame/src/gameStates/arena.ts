module FacebookWarGame.Client {

    export class Arena extends Phaser.State {

        background: Phaser.TileSprite;
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;

        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        explodingSound: Array<Phaser.Sound> = [];

        create(): void {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.tileSprite(0, 0, 1280, 720, "ground", 32);

            this.bulletsRebels = this.initBulletGroup("Rebels");
            this.bulletsEmpire = this.initBulletGroup("Empire");

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

            this.rebels = this.initUnitGroup("Rebels");
            this.empire = this.initUnitGroup("Empire");
        }

        update(): void {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                this.addEmpireUnit("Empire Robot");
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                this.addRebelsUnit("Rebel Mech");
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

        public addEmpireUnit(name: string): Player {
            return this.addUnit(
                name,
                this.empire,
                this.world.width - 1,
                Math.floor(Math.random() * this.world.height - 1) + 1,
                Math.floor(this.world.width * 0.75 + Math.random() * this.world.width * 0.25),
                Math.floor(Math.random() * this.world.height - 1) + 1);
        }

        public addRebelsUnit(name: string): Player {
            return this.addUnit(
                name,
                this.rebels,
                1,
                Math.floor(Math.random() * this.world.height - 1) + 1,
                Math.floor(Math.random() * this.world.width * 0.25) + 1,
                Math.floor(Math.random() * this.world.height - 1) + 1);
        }

        private addUnit(name: string, units: Phaser.Group, startX: number, startY: number, destX: number, destY: number): Player {
            let unit: Player = units.getFirstExists(false, true);
            unit.reset(startX, startY);
            unit.anchor.setTo(0.5);
            unit.name = name;
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
            this.game.debug.text(
                unit.name + " was destroyed. " + bullet.firedBy.name + " scored a kill!",
                0,
                this.world.height - 8,
                "white"
            );
            bullet.kill();
            unit.name = "";
            unit.kill();

            this.explodingSound[Math.floor(Math.random() * this.explodingSound.length)].play();
            var explosion: Phaser.Sprite = this.explosions.getFirstExists(false);
            explosion.reset(unit.body.x, unit.body.y);
            explosion.play("Explosion", 30, false, true);
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
    }
}
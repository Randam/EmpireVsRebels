module FacebookWarGame.Client {

    export class Arena extends Phaser.State {

        background: Phaser.TileSprite;
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        unit: Player;
        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;

        create() {
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
        }

        update() {
            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DELETE)) {
                this.unit = this.empire.getFirstExists(false, true);
                this.unit.reset(this.world.width - 1, Math.floor(Math.random() * this.world.height - 1) + 1);
                this.unit.anchor.setTo(0.5);
                this.unit.name = "Jeroen Derwort";
                let destinationX: number = Math.floor(this.world.width * 0.75 + Math.random() * this.world.width * 0.25);
                let destinationY: number = Math.floor(Math.random() * this.world.height - 1) + 1;
                this.unit.destination = new Phaser.Point(destinationX, destinationY); 
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.INSERT)) {
                this.unit = this.rebels.getFirstExists(false, true);
                this.unit.reset(1, Math.floor(Math.random() * this.world.height - 1) + 1);
                this.unit.anchor.setTo(0.5);
                this.unit.name = "Annemarie Derwort-Steinvoort";
                let destinationX: number = Math.floor(Math.random() * this.world.width * 0.25) + 1;
                let destinationY: number = Math.floor(Math.random() * this.world.height - 1) + 1;
                this.unit.destination = new Phaser.Point(destinationX, destinationY);
            }

            this.game.physics.arcade.overlap(this.bulletsEmpire, this.rebels, this.rebelHit, null, this);
            this.game.physics.arcade.overlap(this.bulletsRebels, this.empire, this.empireHit, null, this);
        }

        private rebelHit(bullet: Phaser.Sprite, unit: Player) {
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
        }

        private empireHit (bullet : Phaser.Sprite, unit: Player) {
        }

        private initUnitGroup(faction: string): Phaser.Group {
            let unitGroup: Phaser.Group = this.add.group();
            unitGroup.enableBody = true;
            unitGroup.physicsBodyType = Phaser.Physics.ARCADE;

            let bullets: Phaser.Group = mechLib.isRebels(faction) ? this.bulletsRebels : this.bulletsEmpire;

            for (let i = 0; i < 30; i++) {
                unitGroup.add(new Player(faction, this.game, 0, 0, bullets));
            }
            unitGroup.setAll('anchor.x', 0.5);
            unitGroup.setAll('anchor.y', 0.5);
            unitGroup.setAll('outOfBoundsKill', false);
            unitGroup.setAll('checkWorldBounds', true);
            unitGroup.setAll('exists', false);

            return unitGroup;
        }

        private initBulletGroup(faction: string): Phaser.Group {
            let bullets: Phaser.Group = this.add.group();
            bullets.enableBody = true;
            bullets.physicsBodyType = Phaser.Physics.ARCADE;
            bullets.createMultiple(50, 'bullet');
            bullets.setAll('anchor.x', 0.5);
            bullets.setAll('anchor.y', 0.5);
            bullets.setAll('outOfBoundsKill', true);
            bullets.setAll('checkWorldBounds', true);

            return bullets;
        }
    }
}
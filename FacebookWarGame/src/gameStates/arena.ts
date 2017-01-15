module FacebookWarGame.Client {

    export class Arena extends Phaser.State {

        background: Phaser.TileSprite;
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        unit: Player;
        bullets: Phaser.Group;

        create() {
            this.physics.startSystem(Phaser.Physics.ARCADE);

            this.background = this.add.tileSprite(0, 0, 1280, 720, 'ground', 32);

            this.bullets = this.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(100, 'bullet');
            this.bullets.setAll('anchor.x', 0.5);
            this.bullets.setAll('anchor.y', 0.5);
            this.bullets.setAll('outOfBoundsKill', true);
            this.bullets.setAll('checkWorldBounds', true);

            this.rebels = this.initUnitGroup('Rebels');
            this.empire = this.initUnitGroup('Empire');

            this.unit = this.rebels.getFirstExists(false, true);

            this.unit.reset(this.world.centerX, this.world.centerX);
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
        }

        private initUnitGroup(faction: string): Phaser.Group {
            let unitGroup: Phaser.Group = this.add.group();
            unitGroup.enableBody = true;
            unitGroup.physicsBodyType = Phaser.Physics.ARCADE;

            for (let i = 0; i < 30; i++) {
                unitGroup.add(new Player(faction, this.game, 0, 0, this.bullets));
            }
            unitGroup.setAll('anchor.x', 0.5);
            unitGroup.setAll('anchor.y', 0.5);
            unitGroup.setAll('outOfBoundsKill', false);
            unitGroup.setAll('checkWorldBounds', true);
            unitGroup.setAll('exists', false);

            return unitGroup;
        }
    }

}
declare module FacebookWarGame.Client {
    class GameEngine extends Phaser.Game {
        constructor();
    }
}
declare let game: FacebookWarGame.Client.GameEngine;
declare function addUnit(name: string): void;
declare module FacebookWarGame.Client {
    enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4,
    }
}
declare module FacebookWarGame.Client {
    class MechLib {
        static isRebels(faction: string): boolean;
        static isEmpire(faction: string): boolean;
    }
}
declare module FacebookWarGame.Client {
    class Bullet extends Phaser.Sprite {
        firedBy: Player;
        constructor(game: Phaser.Game, x: number, y: number);
    }
}
declare module FacebookWarGame.Client {
    class Player extends Phaser.Sprite {
        destination: Phaser.Point;
        direction: Direction;
        game: Phaser.Game;
        bulletsToFire: number;
        private walkingSound;
        private firingSound;
        private bullets;
        private bulletTime;
        private faction;
        private nameLabel;
        private score;
        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group);
        kill(): Phaser.Sprite;
        update(): void;
        private destinationReached();
        private setNewDestination();
        private fireBullet();
    }
}
declare module FacebookWarGame.Client {
    class Boot extends Phaser.State {
        preload(): void;
        create(): void;
    }
}
declare module FacebookWarGame.Client {
    class Arena extends Phaser.State {
        background: Phaser.TileSprite;
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        explodingSound: Array<Phaser.Sound>;
        create(): void;
        update(): void;
        addEmpireUnit(name: string): Player;
        addRebelsUnit(name: string): Player;
        private addUnit(name, units, startX, startY, destX, destY);
        private rebelHit(bullet, unit);
        private empireHit(bullet, unit);
        private unitHit(bullet, unit);
        private initUnitGroup(faction);
        private initBulletGroup(faction);
    }
}
declare module FacebookWarGame.Client {
    class Preloader extends Phaser.State {
        loaderText: Phaser.Text;
        preload(): void;
        create(): void;
        startArena(): void;
    }
}

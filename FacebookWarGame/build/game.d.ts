declare module FacebookWarGame.Client {
    class GameEngine extends Phaser.Game {
        constructor();
    }
}
declare module FacebookWarGame.Client {
    enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4,
    }
}
declare module FacebookWarGame.Client {
    class mechLib {
        static isRebels(faction: string): boolean;
        static isEmpire(faction: string): boolean;
    }
}
declare module FacebookWarGame.Client {
    class Player extends Phaser.Sprite {
        destination: Phaser.Point;
        direction: Direction;
        game: Phaser.Game;
        private walkingSound;
        private bullets;
        private bulletTime;
        private faction;
        private nameLabel;
        private bulletsToFire;
        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group);
        update(): void;
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
        unit: Player;
        bulletsRebels: Phaser.Group;
        bulletsEmpire: Phaser.Group;
        explosions: Phaser.Group;
        create(): void;
        update(): void;
        private rebelHit(bullet, unit);
        private empireHit(bullet, unit);
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

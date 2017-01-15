declare module FacebookWarGame.Client {
    class GameEngine extends Phaser.Game {
        constructor();
    }
}
declare module FacebookWarGame.Client {
}
declare module FacebookWarGame.Client {
    enum Direction {
        Up = 1,
        Right = 2,
        Down = 3,
        Left = 4,
    }
    class Player extends Phaser.Sprite {
        walkingSound: Phaser.Sound;
        game: Phaser.Game;
        bullets: Phaser.Group;
        bulletTime: number;
        direction: Direction;
        faction: string;
        nameLabel: Phaser.Text;
        constructor(faction: string, game: Phaser.Game, x: number, y: number, bullets: Phaser.Group);
        update(): void;
        private fireBullet();
    }
}
declare module FacebookWarGame.Client {
    class Arena extends Phaser.State {
        background: Phaser.TileSprite;
        music: Phaser.Sound;
        rebels: Phaser.Group;
        empire: Phaser.Group;
        unit: Phaser.Sprite;
        bullets: Phaser.Group;
        create(): void;
        update(): void;
        private initUnitGroup(faction);
    }
}
declare module FacebookWarGame.Client {
    class Boot extends Phaser.State {
        preload(): void;
        create(): void;
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

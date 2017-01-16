module FacebookWarGame.Client {

    export class Bullet extends Phaser.Sprite {
        public firedBy: Player;

        constructor(game: Phaser.Game, x: number, y: number) {
            super(game, x, y, 'bullet');
        }

    }
}
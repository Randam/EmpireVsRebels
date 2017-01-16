module FacebookWarGame.Client {

    export class GameEngine extends Phaser.Game {

        constructor() {
            super(1280, 720, Phaser.AUTO, "content", null);

            this.state.add("Boot", Boot, false);
            this.state.add("Preloader", Preloader, false);
            this.state.add("Arena", Arena, false);

            this.state.start("Boot");
        }
    }

}

let game: FacebookWarGame.Client.GameEngine = null;

function addUnit(name: string): void {
    game.state.states.Arena.addEmpireUnit(name);
}

window.onload = () => {
    game = new FacebookWarGame.Client.GameEngine();
};
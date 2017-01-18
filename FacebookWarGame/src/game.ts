/// <reference path="../references.d.ts" />
module FacebookWarGame.Client {

    export class GameEngine extends Phaser.Game {

        constructor() {
            super(1280, 720, Phaser.AUTO, "content", null);

            this.state.add("Boot", Boot, false);
            this.state.add("Preloader", Preloader, false);
            this.state.add("Arena", Arena, false);
            this.state.add("RoundStart", RoundStart, false); 

            this.state.start("Boot");
        }
    }

}

let game: FacebookWarGame.Client.GameEngine = null;

function addUnit(name: string, faction: string): void {
    let user: FacebookWarGame.Client.User = FacebookWarGame.Client.User.list.filter(function (ul) {
        return ul.name == name;
    })[0];

    if (user === undefined) {
        user = new FacebookWarGame.Client.User(name, faction, undefined);
        FacebookWarGame.Client.User.list.push(user);
    }

    game.state.states.Arena.addUnitForUser(user);
}

window.onload = () => {
    game = new FacebookWarGame.Client.GameEngine();
};
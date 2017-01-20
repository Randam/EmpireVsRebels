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

let access_token: string = '1850233771859903|UZReV_K_e2zP6w7y7xxOgfyNauU'; // PASTE HERE YOUR FACEBOOK ACCESS TOKEN
let pageId: string = '314813142252248'; // PAST HERE YOUR PAGE ID
let postId: string = '325905601143002'; // PASTE HERE YOUR POST ID  

let game: FacebookWarGame.Client.GameEngine = null;

function addUnit(name: string, fbId: string, faction: string): void {
    let user: FacebookWarGame.Client.User = FacebookWarGame.Client.User.findById(fbId);

    if (user === undefined) {
        user = new FacebookWarGame.Client.User(name, faction, undefined);
        FacebookWarGame.Client.User.list.push(user);
    }

    game.state.states.Arena.addUnitForUser(user);
}

window.onload = () => {
    game = new FacebookWarGame.Client.GameEngine();

    setInterval(processFacebookData, 4000);
    //processFacebookData();
};

function processFacebookData() {
    // check for new comments containing a faction, and add a user to the game if he hasn't been added already
    FacebookWarGame.Client.FacebookComment.refreshList(pageId, postId, access_token);

    $.each(FacebookWarGame.Client.FacebookComment.list, function (index, comment) {
        if (comment.refreshId === FacebookWarGame.Client.FacebookComment.refreshId) {
            if (comment.isFaction()) {
                if (FacebookWarGame.Client.User.findById(comment.fromId) === undefined) {
                    let user = new FacebookWarGame.Client.User(comment.fromName, comment.getFaction(), comment.fromId);
                    game.state.states.Arena.addUnitForUser(user);
                }
            }
        }
    });

    // check for unique tags, and add/respawn a user if he has tagged someone and was previously in the game
    FacebookWarGame.Client.FacebookTag.refreshList(access_token);

    $.each(FacebookWarGame.Client.FacebookTag.list, function (index, tag) {
        if (tag.refreshId === FacebookWarGame.Client.FacebookComment.refreshId) {
            if (FacebookWarGame.Client.User.findById(tag.userId) !== undefined) {
                let comment = FacebookWarGame.Client.FacebookComment.findByFromId(tag.userId);
                if (comment === undefined) {
                    let user = FacebookWarGame.Client.User.findById(comment.fromId);

                    if (user !== undefined) {
                        game.state.states.Arena.addUnitForUser(user);
                    }
                }
            }
        }
    });
}
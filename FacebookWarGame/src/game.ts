﻿/// <reference path="../references.d.ts" />
module FacebookWarGame.Client {

    export class GameEngine extends Phaser.Game {

        constructor() {
            super(1280, 720, Phaser.CANVAS, "content", null);
            this.forceSingleUpdate = true;
            this.state.add("Boot", Boot, false);
            this.state.add("Preloader", Preloader, false);
            this.state.add("Arena", Arena, false);
            this.state.add("RoundStart", RoundStart, false); 

            this.state.start("Boot");
        }
    }

}
//let access_token: string = '1850233771859903|UZReV_K_e2zP6w7y7xxOgfyNauU';  // PASTE HERE YOUR FACEBOOK ACCESS TOKEN
let access_token: string = 'EAAaSxx65H78BAN1ZCSH9wWVMHLeZBh5a5follRbobXwZBLyIP2njG5dSBkZBXfDWzdPUq7PtHXeTpVzLOddEHzsB9TBo1DNN3rqDhpaNYBZBcXCkZBBfi7leBxI7ucuTlbmcJWUmxzDJqWvxUU8UyijVOHXHplZCQ8ZD'; // get here: https://smashballoon.com/custom-facebook-feed/docs/get-extended-facebook-user-access-token/
let pageId: string = '314813142252248';                                     // PASTE HERE YOUR PAGE ID
let postId: string = '329515904115305';                                     // PASTE HERE YOUR POST ID  
let refreshId: number = 0;
let sharesCount: number = 0;
let doAirRaid: boolean = false;

let game: FacebookWarGame.Client.GameEngine = null;

function addUnit(name: string, fbId: string, faction: string): void {
    let user: FacebookWarGame.Client.User = FacebookWarGame.Client.User.findByName(name);
    
    if (user == undefined || user.fbId == "0") {
        user = new FacebookWarGame.Client.User(name, faction, fbId);
    }

    game.state.states.Arena.addUnitForUser(user);
}

window.onload = () => {
    game = new FacebookWarGame.Client.GameEngine();

    setInterval(processFacebookData, 4000);
    setInterval(updateGame, 500);
};

function processFacebookData() {
    // check for new comments containing a faction, and add a user to the game if he hasn't been added already
    FacebookWarGame.Client.FacebookComment.refreshList(pageId, postId, access_token, refreshId);
    
    // check for unique tags, and add/respawn a user if he has tagged someone and was previously in the game
    FacebookWarGame.Client.FacebookTag.refreshList(access_token, refreshId);

    // check for shares
    //FacebookWarGame.Client.FacebookShare.refreshList(pageId, postId, access_token);

    let url: string = "https://graph.facebook.com/v2.8/" + pageId + "_" + postId + "?fields=shares&access_token=" + access_token;
    $.getJSON(url, function (res) {
        if (res.shares != undefined) {
            let fbShares: number = res.shares.count;

            if (fbShares > sharesCount) {
                sharesCount++;
                doAirRaid = true;
            }
        }
    });

}

function updateGame() {
    if (FacebookWarGame.Client.FacebookComment.updated && FacebookWarGame.Client.FacebookTag.updated) {

        // process spawns & respawns
        $.each(FacebookWarGame.Client.FacebookComment.list, function (index, comment) {
            if (comment.refreshId === refreshId) {
                if (comment.isFaction()) {
                    let user = FacebookWarGame.Client.User.findById(comment.fromId);
                    if (user === undefined) {
                        user = new FacebookWarGame.Client.User(comment.fromName, comment.getFaction(), comment.fromId);
                        FacebookWarGame.Client.User.list.push(user);
                    }
                    game.state.states.Arena.addUnitForUser(user);
                }
            }
        });

        // process respawns
        $.each(FacebookWarGame.Client.FacebookTag.list, function (index, tag) {
            if (tag.refreshId === refreshId) {
                if (FacebookWarGame.Client.User.findById(tag.userId) !== undefined) {
                    let comment = FacebookWarGame.Client.FacebookComment.findByFromId(tag.userId);
                    if (comment !== undefined) {
                        let user = FacebookWarGame.Client.User.findById(comment.fromId);

                        if (user !== undefined) {
                            game.state.states.Arena.addUnitForUser(user);
                        }
                    }
                }
            }
        });

        FacebookWarGame.Client.FacebookComment.updated = false;
        FacebookWarGame.Client.FacebookTag.updated = false;
        refreshId++;
    }

    // process air raids
    if (doAirRaid) {
        if (!game.state.states.Arena.isAirRaidInProgress()) {
            let rebelCount: number = (game.state.states.Arena.rebels.countLiving());
            let empireCount: number = (game.state.states.Arena.empire.countLiving());

            if (rebelCount == empireCount) {
                // choose random faction
                rebelCount += Math.floor(Math.random() * 100);
                empireCount += Math.floor(Math.random() * 100);
            }

            if (rebelCount > empireCount) {
                game.state.states.Arena.prepareAirRaid(new FacebookWarGame.Client.User("Empire AirStrike", "empire", "0"));
                doAirRaid = false;
            } else if (empireCount > rebelCount) {
                game.state.states.Arena.prepareAirRaid(new FacebookWarGame.Client.User("Rebel AirStrike", "rebels", "0"));
                doAirRaid = false;
            } 
        }
    }
}
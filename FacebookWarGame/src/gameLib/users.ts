module FacebookWarGame.Client {
    export class User {
        public static list: Array<User> = [];

        public name: string;
        public fbId: string;
        public faction: string;
        public score: number;
        public respawns: number;
        public kills: number;

        constructor(name?: string, faction?: string, fbId?: string) {
            this.name = name;
            this.fbId = fbId;
            this.faction = faction;
            this.score = 0;
            this.respawns = 0;
            this.kills = 0;
        }
    }
}
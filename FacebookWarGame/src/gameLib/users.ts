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

        static findById(fbId: string): User {
            return User.list.filter(function (ul) {
                return ul.fbId == fbId;
            })[0];
        }

        static findByName(name: string): User {
            return User.list.filter(function (ul) {
                return ul.name == name;
            })[0];
        }

        static clearUserData() {
            User.list.length = 0;
        }
    }

    export class FacebookComment {
        public static list: Array<FacebookComment> = [];
        public static refreshId: number = 0;

        created_time: Date;
        fromName: string;
        fromId: string;
        message: string;
        id: string;
        refreshId: number;

        getFaction(): string {
            if (this.isFaction()) {
                return this.message.toLowerCase();
            }
            else {
                return "";
            }
        }

        isFaction() {
            let faction: string = this.message.toLowerCase();

            return (faction == "rebels" || faction == "empire");
        }

        static refreshList(pageId: string, postId: string, access_token: string) {
            let url: string = 'https://graph.facebook.com/v2.8/?ids=' + pageId + "_" + postId + '&fields=comments&access_token=' + access_token;

            FacebookComment.refreshId++;

            $.ajaxSetup({ 'async': false });
            $.getJSON(url, function (result) {
                result = result[pageId + "_" + postId].comments.data;
                FacebookComment.addRecordsFromJSON(result);
            });
        }

        static addRecordsFromJSON(jsonResult) {
            $.each(jsonResult, function (index, obj) {
                let fbComment = new FacebookComment();

                fbComment.created_time = obj.created_time;
                fbComment.fromId = obj.from.id;
                fbComment.fromName = obj.from.name;
                fbComment.id = obj.id;
                fbComment.message = obj.message;
                fbComment.refreshId = FacebookComment.refreshId;

                if (FacebookComment.findById(fbComment.id) == undefined) {
                    FacebookComment.list.push(fbComment);
                }
            });
        }

        // get the new facebook comments since the last refresh
        static getNew(): Array<FacebookComment> {
            return FacebookComment.list.filter(function (ul) {
                return ul.refreshId == FacebookComment.refreshId;
            });
        }

        static findByFromId(fromId: string): FacebookComment {
            return FacebookComment.list.filter(function (ul) {
                return ul.fromId == fromId;
            })[0];
        }

        static findById(id: string): FacebookComment {
            return FacebookComment.list.filter(function (ul) {
                return ul.id == id;
            })[0];
        }
    }

    export class FacebookTag {
        public static list: Array<FacebookTag> = [];

        userId: string;
        tagId: string;
        refreshId: number;

        constructor(userId: string, tagId: string, refreshId: number) {
            this.userId = userId;
            this.tagId = tagId;
            this.refreshId = refreshId;
        }

        static exists(taggedId: string): boolean {
            return (FacebookTag.list.filter(function (ul) {
                return (ul.tagId == taggedId);
            })).length > 0;
        }       

        static refreshList(access_token: string) {
            // check new facebook comments for tags
            let comments = FacebookComment.getNew();

            let commentIds = [];
            $.each(comments, function (index, obj) {
                if (obj.message.length > 5)
                    commentIds.push(obj.id);
            });

            if (commentIds.length > 0) {
                let url: string = "https://graph.facebook.com/v2.8/?ids=" + commentIds.join(",") + "&fields=message_tags&access_token=" + access_token;
                $.getJSON(url, function (res) {
                    console.log(res.data);
                    $.each(res, function (index, obj) {
                        if (!FacebookTag.exists(obj.message_tags[0].id)) {
                            let userId: string = FacebookComment.findById(obj.id).fromId;
                            FacebookTag.list.push(new FacebookTag(userId, obj.message_tags[0].id, FacebookComment.refreshId));
                        }
                    });
                });
            }
        }
    }
}
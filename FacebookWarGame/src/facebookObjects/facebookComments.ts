module FacebookWarGame.Client {

    export class FacebookComment {
        public static list: Array<FacebookComment> = [];
        public static updated: boolean = false;

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

        static refreshList(pageId: string, postId: string, access_token: string, refreshId: number) {

            if (FacebookComment.updated)
                return;

            let url: string = 'https://graph.facebook.com/v2.8/?ids=' + pageId + "_" + postId + '&fields=comments&access_token=' + access_token;

            $.getJSON(url, function (result) {
                if (result[pageId + "_" + postId] !== undefined) {
                    result = result[pageId + "_" + postId].comments.data;
                    FacebookComment.addRecordsFromJSON(result, refreshId);
                    FacebookComment.updated = true;
                }
            });
        }

        static addRecordsFromJSON(jsonResult, refreshId: number) {
            $.each(jsonResult, function (index, obj) {
                let fbComment = new FacebookComment();

                fbComment.created_time = obj.created_time;
                fbComment.fromId = obj.from.id;
                fbComment.fromName = obj.from.name;
                fbComment.id = obj.id;
                fbComment.message = obj.message;
                fbComment.refreshId = refreshId;

                if (FacebookComment.findById(fbComment.id) == undefined) {
                    FacebookComment.list.push(fbComment);
                }
            });
        }

        // get the new facebook comments since the last refresh
        static getNew(refreshId: number): Array<FacebookComment> {
            return FacebookComment.list.filter(function (ul) {
                return ul.refreshId >= refreshId;
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
}

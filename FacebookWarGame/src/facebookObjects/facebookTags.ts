module FacebookWarGame.Client {

    export class FacebookTag {
        public static list: Array<FacebookTag> = [];
        public static updated: boolean = false;

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

        static refreshList(access_token: string, refreshId: number) {

            if (FacebookTag.updated)
                return;

            if (!FacebookComment.updated)
                return;

            // check new facebook comments for tags
            let comments = FacebookComment.getNew(refreshId);

            if (comments.length == 0) {
                FacebookTag.updated = true;
                return;
            }

            let commentIds = [];
            $.each(comments, function (index, obj) {
                if (obj.message.length > 5)
                    commentIds.push(obj.id);
            });

            if (commentIds.length > 0) {
                let url: string = "https://graph.facebook.com/v2.8/?ids=" + commentIds.join(",") + "&fields=message_tags&access_token=" + access_token;
                $.getJSON(url, function (res) {
                    $.each(res, function (index, obj) {
                        if (obj.message_tags != undefined) {
                            if (!FacebookTag.exists(obj.message_tags[0].id)) {
                                let userId: string = FacebookComment.findById(obj.id).fromId;
                                FacebookTag.list.push(new FacebookTag(userId, obj.message_tags[0].id, refreshId));
                            }
                        }
                    });
                    FacebookTag.updated = true;
                });
            }
        }
    }
}

module FacebookWarGame.Client {

    export class FacebookShare {
        public static list: Array<FacebookShare> = [];
        public static updated: boolean = false;

        userId: string;
        shareId: string;
        consumed: boolean;

        constructor(userId: string, shareId: string) {
            this.userId = userId;
            this.shareId = shareId;
            this.consumed = false;
        }

        static exists(shareId: string): boolean {
            return (FacebookShare.list.filter(function (ul) {
                return (ul.shareId == shareId);
            })).length > 0;
        }

        // get the new facebook shares 
        static getNew(): Array<FacebookShare> {
            return FacebookShare.list.filter(function (ul) {
                return !ul.consumed;
            });
        }

        static refreshList(pageId: string, postId: string, access_token: string) {
            let url: string = "https://graph.facebook.com/v2.8/" + pageId + "_" + postId + "/sharedposts/?access_token=" + access_token;
            $.getJSON(url, function (res) {
                if (res.data != undefined) {
                    $.each(res.data, function (index, obj) {
                        if (!FacebookShare.exists(obj.id)) {
                            let userId: string = obj.id.split("_")[0];
                            FacebookShare.list.push(new FacebookShare(userId, obj.id));
                            FacebookShare.updated = true;
                        }
                    });
                }
            });
        }
    }
}

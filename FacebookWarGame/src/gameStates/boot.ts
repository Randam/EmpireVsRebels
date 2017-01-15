module FacebookWarGame.Client {

    export class Boot extends Phaser.State {
        preload() {
            //You can preload an image here if you dont want to use text for the loading screen
        }

        create() {
            this.stage.setBackgroundColor(0xFFFFFF);

            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            } else {
                // mobile
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.minWidth = 480;
                this.scale.minHeight = 260;
                this.scale.maxWidth = 1280;
                this.scale.maxHeight = 720;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.refresh();
            }

            this.game.state.start('Preloader', true, false);
        }
    }

}
class Smoke {
    constructor(x, y, angle) {
        this.sprite = Global.smokeGroup.create(x, y, "smoke");
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.angle = angle + 270;
        let tween = Global.game.add.tween(this.sprite).to( { alpha: 0 }, 6000, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(() => {
            this.sprite.destroy();
        }, this);
        Global.tweensContainer.push(tween);
    }
};
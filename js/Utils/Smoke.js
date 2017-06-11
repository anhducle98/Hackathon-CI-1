class Smoke {
	constructor(x, y, angle) {
		this.sprite = Nakama.smokeGroup.create(x, y, "smoke");
		this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.angle = angle + 270;
		let tween = Nakama.game.add.tween(this.sprite).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None, true);
		tween.onComplete.add(() => {
			this.sprite.destroy();
		}, this);
	}
};
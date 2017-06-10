class Smoke {
	constructor(x, y) {
		this.sprite = Nakama.smokeGroup.create(x, y, "smoke");
		this.sprite.anchor.setTo(0.5, 0.5);
		Nakama.game.add.tween(this.sprite).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None, true, 0, 3000, true);
		setTimeout(() => {this.sprite.destroy();}, 3000);
	}
};
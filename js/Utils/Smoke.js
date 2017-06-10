class Smoke {
	constructor(x, y, angle) {
		this.sprite = Nakama.smokeGroup.create(x, y, "smoke");
		this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.angle += angle + 270;
		//this.sprite.x -= Math.sin(this.sprite.angle / 180 * 3.14) * 10;
		//this.sprite.y -= Math.cos(this.sprite.angle / 180 * 3.14) * 10;
		Nakama.game.add.tween(this.sprite).to( { alpha: 0 }, 3000, Phaser.Easing.Linear.None, true, 0, 3000, true);
		setTimeout(() => {this.sprite.destroy();}, 3000);
	}
};
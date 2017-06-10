class Item {
	constructor(x, y, spriteName) {
		this.sprite = Nakama.itemGroup.create(x, y, 'assets', spriteName);
		this.sprite.width /= 2;
        this.sprite.height /= 2;
        this.sprite.anchor.setTo(0.5, 0.5);
        let radius = Math.max(this.sprite.width, this.sprite.height) / 2;
        this.sprite.body.setCircle(radius, this.sprite.width / 2, this.sprite.height / 2);
	}
}

class Item {
	constructor(x, y, spriteName) {
		this.sprite = Nakama.itemGroup.create(x, y, 'assets', spriteName);
    	this.sprite.anchor.setTo(0.5, 0.5);
		this.sprite.scale.setTo(0.4, 0.4);
	}
}

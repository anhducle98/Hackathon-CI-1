class StarItem extends Item {
	constructor(x, y) {
		super(x, y, "CollectibleStar.png");
		this.sprite.itemType = "Star";
	}
}
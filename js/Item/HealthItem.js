class HealthItem{
    constructor(x, y, spriteName) {
        this.sprite = Global.itemGroup.create(x, y, 'assets', 'ItemType1.png');
        this.sprite.width /= 2;
        this.sprite.height /= 2;
        this.sprite.anchor.setTo(0.5, 0.5);
        let radius = Math.max(this.sprite.width, this.sprite.height) / 2;
        this.sprite.body.setCircle(radius, this.sprite.width / 2, this.sprite.height / 2);
        this.sprite.scale.setTo(0.7, 0.7);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.itemType = 'Health';
    }
}

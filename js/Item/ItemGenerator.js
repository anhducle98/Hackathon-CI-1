class ItemGenerator {
    constructor(reloadTime, itemConstructor) {
        this.sinceLastTime = 0;
        this.reloadTime = reloadTime;
        this.itemConstructor = itemConstructor;
    }

    generate() {
        this.sinceLastTime += Global.game.time.physicsElapsed;
        if (this.sinceLastTime < this.reloadTime) {
            return null;
        }
        this.sinceLastTime = 0;
        let deltaX = Math.random() * 400 - 200;
        let deltaY = Math.random() * 400 - 200;
        if (deltaX < 0) deltaX -= 200; else deltaX += 200;
        if (deltaY < 0) deltaY -= 200; else deltaY += 200;
        let x = Global.player.sprite.x + deltaX;
        let y = Global.player.sprite.y + deltaY;
        return new this.itemConstructor(x, y);
    }
}
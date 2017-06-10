class ItemGenerator {
	constructor(reloadTime, itemConstructor) {
		this.sinceLastTime = 0;
		this.reloadTime = reloadTime;
		this.itemConstructor = itemConstructor;
	}

	generate() {
		this.sinceLastTime += Nakama.game.time.physicsElapsed;
		if (this.sinceLastTime < this.reloadTime) {
			return;
		}
		this.sinceLastTime = 0;
		let deltaX = Math.random() * 600 - 300;
		let deltaY = Math.random() * 600 - 300;
		if (deltaX < 0) deltaX -= 400; else deltaX += 400;
  		if (deltaY < 0) deltaY -= 400; else deltaY += 400;
		let x = Nakama.player.sprite.x + deltaX;
		let y = Nakama.player.sprite.y + deltaY;
		new this.itemConstructor(x, y);
	}
}
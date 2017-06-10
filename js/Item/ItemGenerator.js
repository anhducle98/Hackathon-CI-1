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
		let deltaX = Math.random() * 400 - 200;
		let deltaY = Math.random() * 400 - 200;
		if (deltaX < 0) deltaX -= 200; else deltaX += 200;
  		if (deltaY < 0) deltaY -= 200; else deltaY += 200;
		let x = Nakama.player.sprite.x + deltaX;
		let y = Nakama.player.sprite.y + deltaY;
		new this.itemConstructor(x, y);
	}
}
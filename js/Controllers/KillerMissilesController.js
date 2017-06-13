class KillerMissilesController extends MissilesController {
    constructor(x, y, configs) {
        super(x, y, Object.assign(configs, {
            WOBBLE_LIMIT: -1
        }));
        this.velocity = new Phaser.Point(
            this.target.x - this.sprite.x,
            this.target.y - this.sprite.y
        );
        this.velocity = this.velocity.setMagnitude(30);
        this.velocity.x += Math.random() * 10 - 5;
        this.velocity.y += Math.random() * 10 - 5;
        this.sprite.angle = Math.atan2(this.velocity.x, -this.velocity.y) * (180 / Math.PI);
        setTimeout(() => {
            this.sprite.destroy();
        }, 3000);
    }

    update(shift) {
        this.lastSmokeTime += Global.game.time.physicsElapsed;
        if (this.lastSmokeTime > 0.01) {
            this.lastSmokeTime = 0;    
            new Smoke(this.sprite.x, this.sprite.y, this.sprite.angle);
        }
        
        this.sprite.x += this.velocity.x + shift.x;
        this.sprite.y += this.velocity.y + shift.y;
    }
}
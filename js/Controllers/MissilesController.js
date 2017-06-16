class MissilesController extends Controllers {
    constructor(x, y, configs) {
        if (!configs) configs = {};
        let missileType = 2;
        if (configs.WOBBLE_LIMIT == 0) {
            missileType = 3;
        }
        super(x, y, `MissileType${missileType}.png`, Global.missileGroup, Global.player.sprite, Object.assign(
            configs, {
                speed: Global.configs.missile.SPEED,
                turnRate: Global.configs.missile.TURN_RATE
            }
        ));

        this.sprite.scale.setTo(0.5, 0.5);
        this.sprite.itemType = "Missile";
        this.lastSmokeTime = 0;
        this.sprite.alpha = 1;
        this.sprite.health = 1200;
        this.sprite.events.onKilled.add(() => {
            if (this.health <= 0) this.sprite.revive();
            let tween = Global.game.add.tween(this.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            Global.tweensContainer.push(tween);
            tween.onComplete.add(() => { tween.stop(); this.sprite.destroy(); }, this);
        }, this);
    }

    update(shift) {
        this.sprite.damage(1);
        if (this.sprite.health <= 0) return;

        let lastX = this.sprite.x;
        let lastY = this.sprite.y;
        Controllers.prototype.update.call(this, shift);

        this.lastSmokeTime += Global.game.time.physicsElapsed;
        if (this.lastSmokeTime <= 0.03) {
            return;
        }
        this.lastSmokeTime = 0;
        new Smoke(lastX, lastY, this.sprite.angle);
    }
}

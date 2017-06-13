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
        setTimeout(() => {
            let tween = Global.game.add.tween(this.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(() => { tween.stop(); this.sprite.destroy(); }, this);
        }
        ,20000);
    }

    update(shift) {
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

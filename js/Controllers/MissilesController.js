class MissilesController extends Controllers {
    constructor(x, y, configs) {
        if (!configs) configs = {};
        let missileType = 2;
        if (configs.WOBBLE_LIMIT == 0) {
            missileType = 3;
        }
        super(x, y, `MissileType${missileType}.png`, Nakama.missileGroup, Nakama.player.sprite, Object.assign(
            configs, {
                speed: Nakama.configs.missile.SPEED,
                turnRate: Nakama.configs.missile.TURN_RATE
            }
        ));

        this.sprite.scale.setTo(0.5, 0.5);
        this.sprite.itemType = "Missile";
        this.lastSmokeTime = 0;
        this.sprite.alpha = 1;
        setTimeout(() => {
            let tween = Nakama.game.add.tween(this.sprite).to( { alpha: 0 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);
            setTimeout(() => { tween.stop(); this.sprite.kill(); }, 1000);
        }
        ,15000);
    }

    update(shift) {
        let lastX = this.sprite.x;
        let lastY = this.sprite.y;
        Controllers.prototype.update.call(this, shift);

        this.lastSmokeTime += Nakama.game.time.physicsElapsed;
        if (this.lastSmokeTime <= 0.03) {
            return;
        }
        this.lastSmokeTime = 0;
        new Smoke(lastX, lastY, this.sprite.angle);
    }
}

class MissilesController extends Controllers {
    constructor(x, y, configs) {
        if (!configs) configs = {};
        super(x, y, 'MissileType3.png', Nakama.missileGroup, Nakama.player.sprite, Object.assign(
            configs, {
                speed: Nakama.configs.missile.SPEED,
                turnRate: Nakama.configs.missile.TURN_RATE
            }
        ));
        this.sprite.scale.setTo(0.5, 0.5);
        setTimeout(() => {this.sprite.kill()}, 15000);
        /*
    this.SMOKE_LIFETIME = 3000; // milliseconds
        this.smokeEmitter = Nakama.game.add.emitter(0, 0, 100);
        //Nakama.background.addChild(this.smokeEmitter);

        // Set motion paramters for the emitted particles
        this.smokeEmitter.gravity = 0;
        this.smokeEmitter.setXSpeed(0, 0);
        this.smokeEmitter.setYSpeed(0, 0); // make smoke drift upwards

        // Make particles fade out after 1000ms
        this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
                Phaser.Easing.Linear.InOut);
        this.smokeEmitter.makeParticles('smoke');
        //this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);
        //this.smokeEmitter.fixedToCamera = true;
        */
    }

    update(shift) {
        
        Controllers.prototype.update.call(this, shift);
        /*
        this.smokeEmitter.x = this.sprite.x;
        this.smokeEmitter.y = this.sprite.y;
        this.smokeEmitter.emitParticle()
        //this.smokeEmitter.cameraOffset.x -= Nakama.player.velocity.x;
        //this.smokeEmitter.cameraOffset.y -= Nakama.player.velocity.y;
    */
    }
}

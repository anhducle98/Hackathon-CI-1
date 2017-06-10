class ShipController extends Controllers {
  constructor(x, y, configs) {
    super(x, y, 'Spaceship1-Partner.png', Nakama.playerGroup, Nakama.game.input.activePointer, Object.assign(
      configs, {
        speed: Nakama.configs.ship.SPEED,
        turnRate: Nakama.configs.ship.TURN_RATE
      }
    ));
    this.sprite.scale.setTo(0.5, 0.5);

    this.smokeEmitter = Nakama.game.add.emitter(0, 0, 100);

    // Set motion paramters for the emitted particles
    this.smokeEmitter.gravity = 0;
    this.smokeEmitter.setXSpeed(0, 0);
    this.smokeEmitter.setYSpeed(0, 0); // make smoke drift upwards

    // Make particles fade out after 1000ms
    this.smokeEmitter.setAlpha(1, 0, this.SMOKE_LIFETIME,
        Phaser.Easing.Linear.InOut);
    this.smokeEmitter.makeParticles('smoke');
    this.smokeEmitter.start(false, this.SMOKE_LIFETIME, 50);
  }

  update() {
  	Controllers.prototype.update.call(this);
  	this.smokeEmitter.x = Nakama.background.tilePosition.x + Nakama.game.width / 2;
  	this.smokeEmitter.y = Nakama.background.tilePosition.y + Nakama.game.height / 2;
  }
}

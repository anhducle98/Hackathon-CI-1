class ShipController extends Controllers {
  constructor(x, y, configs) {
    super(x, y, 'AirPlaneType1.png', Nakama.playerGroup, Nakama.game.input.activePointer, Object.assign(
      configs, {
        speed: Nakama.configs.ship.SPEED,
        turnRate: Nakama.configs.ship.TURN_RATE
      }
    ));
    this.sprite.scale.setTo(0.5, 0.5);
  }
}

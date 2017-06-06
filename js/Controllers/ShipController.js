class ShipController extends Controllers {
  constructor(x, y, configs) {
    super(x, y, 'Spaceship1-Partner.png', Nakama.playerGroup, Nakama.game.input.activePointer, Object.assign(
      configs, {
        speed: Nakama.configs.ship.SPEED,
        turnRate: Nakama.configs.ship.TURN_RATE
      }
    ));
  }
}
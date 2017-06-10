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
  }
}

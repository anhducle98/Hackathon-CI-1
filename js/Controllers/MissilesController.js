class MissilesController extends Controllers {
  constructor(x, y, configs) {
    super(x, y, 'BulletType2.png', Nakama.missileGroup, Nakama.player.sprite, Object.assign(
      configs, {
        speed: Nakama.configs.missile.SPEED,
        turnRate: Nakama.configs.missile.TURN_RATE
      }
    ));
  }
}

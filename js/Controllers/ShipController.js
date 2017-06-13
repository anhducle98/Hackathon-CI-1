class ShipController extends Controllers {
    constructor(x, y, configs) {
        super(x, y, 'AirPlaneType1.png', Global.playerGroup, Global.game.input.activePointer, Object.assign(
            configs, {
                speed: Global.configs.ship.SPEED,
                turnRate: Global.configs.ship.TURN_RATE
            }
        ));
    }

    upgrade() {
        this.sprite.loadTexture('assets', 'AirPlaneType2.png');
    }

    downgrade() {
        this.sprite.loadTexture('assets', 'AirPlaneType1.png'); 
    }
}

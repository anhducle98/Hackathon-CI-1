class ShipController extends Controllers {
    constructor(x, y, configs) {
        super(x, y, 'AirPlaneType1.png', Nakama.playerGroup, Nakama.game.input.activePointer, Object.assign(
            configs, {
                speed: Nakama.configs.ship.SPEED,
                turnRate: Nakama.configs.ship.TURN_RATE
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

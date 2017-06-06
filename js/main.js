var Nakama = {};
Nakama.configs = {
  ship: {
    SPEED: 300, // pixels/second
    TURN_RATE: 200 // degree/frame
  },
  missile: {
    SPEED: 500,
    TURN_RATE: 130
  }
};

window.onload = function(){
  Nakama.game = new Phaser.Game(800,960,Phaser.AUTO,'',
    {
      preload: preload,
      create: create,
      update: update,
      render: render
    }, false, false
  );
}

// preparations before game starts
var preload = function(){
  Nakama.game.scale.minWidth = 400;
  Nakama.game.scale.minHeight = 480;
  Nakama.game.scale.maxWidth = 800;
  Nakama.game.scale.maxHeight = 960;
  Nakama.game.scale.pageAlignHorizontally = true;
  Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  Nakama.game.time.advancedTiming = true;

  Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
  Nakama.game.load.image('background', 'Assets/sky.png');
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.width, Nakama.game.height, 'background');
  Nakama.playerGroup = Nakama.game.add.physicsGroup();
  Nakama.missileGroup = Nakama.game.add.physicsGroup();

  Nakama.player = new ShipController(Nakama.game.width/2, Nakama.game.height/2, {});

  Nakama.missiles = [];
  Nakama.missiles.push(new MissilesController(300, 400, {}));

  Nakama.game.input.activePointer.x = -Nakama.game.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.height/2;

}

// update game state each frame
var update = function(){
  Nakama.player.update();

  var shift = new Phaser.Point(
    -(Nakama.player.sprite.x - Nakama.game.width/2),
    -(Nakama.player.sprite.y - Nakama.game.height/2)
  );
  for(var i = 0; i < Nakama.missiles.length; i++) {
    Nakama.missiles[i].update(shift);
    console.log(shift);
  }
  Nakama.background.tilePosition.x += shift.x;
  Nakama.background.tilePosition.y += shift.y;
  Nakama.player.sprite.x = Nakama.game.width/2;
  Nakama.player.sprite.y = Nakama.game.height/2;
}

// before camera render (mostly for debug)
var render = function() {

}

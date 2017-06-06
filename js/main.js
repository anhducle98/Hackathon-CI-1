var Nakama = {};
Nakama.configs = {
  ship: {
    SPEED: 10, // pixels/frame
    TURN_RATE: 200 // degree/frame
  },
  missile: {
    SPEED: 13,
    TURN_RATE: 130
  },
  item: {
    COOLDOWN: 1
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
  Nakama.itemGroup = Nakama.game.add.physicsGroup();
  Nakama.playerGroup = Nakama.game.add.physicsGroup();
  Nakama.missileGroup = Nakama.game.add.physicsGroup();

  Nakama.player = new ShipController(Nakama.game.width/2, Nakama.game.height/2, {});

  Nakama.missiles = [];
  Nakama.missiles.push(new MissilesController(300, 400, {}));

  Nakama.game.input.activePointer.x = -Nakama.game.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.height/2;

  Nakama.starGenerator = new ItemGenerator(1, StarItem);
}

var generateItems = function() {
  Nakama.starGenerator.generate();
}

var sinceLastMissile = 0;
var generateMissiles = function() {
  sinceLastMissile += Nakama.game.time.physicsElapsed;
  if (sinceLastMissile < 2) return;
  sinceLastMissile = 0;
  let deltaX = Math.random() * 1000 - 500;
  let deltaY = Math.random() * 1000 - 500;
  let x = Nakama.player.sprite.x + deltaX;
  let y = Nakama.player.sprite.y + deltaY;
  Nakama.missiles.push(new MissilesController(x, y, {}));
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
  }

  Nakama.background.tilePosition.x += shift.x;
  Nakama.background.tilePosition.y += shift.y;

  Nakama.itemGroup.forEach((item) => {
    item.x += shift.x;
    item.y += shift.y;
  });

  Nakama.player.sprite.x = Nakama.game.width/2;
  Nakama.player.sprite.y = Nakama.game.height/2;

  generateItems();
  generateMissiles();

  Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.missileGroup, (ship, missile) => {
    missile.kill();
    //ship.kill();
  });

  Nakama.game.physics.arcade.overlap(Nakama.missileGroup, Nakama.missileGroup, (missile1, missile2) => {
    missile1.kill();
    missile2.kill();
  })

  Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.itemGroup, (ship, item) => {
    console.log(item.itemType);
    item.kill();
  });
}

// before camera render (mostly for debug)
var render = function() {
  Nakama.game.debug.body(Nakama.player.sprite);
  /*
  for (let missile of Nakama.missiles) {
    Nakama.game.debug.body(missile.sprite);
  }
  */
}

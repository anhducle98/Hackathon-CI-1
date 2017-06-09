var Nakama = {};
Nakama.configs = {
  ship: {
    SPEED: 10, // pixels/frame
    TURN_RATE: 200 // degree/frame
  },
  missile: {
    SPEED: 10,
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
  Nakama.game.load.spritesheet('explode', 'Assets/Original Sprites/Explode.png', 128, 128);
}

// initialize the game
var create = function(){
  Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
  Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.width, Nakama.game.height, 'background');
  Nakama.itemGroup = Nakama.game.add.physicsGroup();
  Nakama.playerGroup = Nakama.game.add.physicsGroup();
  Nakama.missileGroup = Nakama.game.add.physicsGroup();
  Nakama.explosionGroup = Nakama.game.add.physicsGroup();

  Nakama.player = new ShipController(Nakama.game.width/2, Nakama.game.height/2, {});

  Nakama.missiles = [];

  Nakama.game.input.activePointer.x = -Nakama.game.width/2;
  Nakama.game.input.activePointer.y = Nakama.game.height/2;

  Nakama.starGenerator = new ItemGenerator(1, StarItem);
}

// update game state each frame
var update = function(){
  if (Nakama.player.sprite.alive) {
    Nakama.player.update();
    var shift = new Phaser.Point(
      -(Nakama.player.sprite.x - Nakama.game.width/2),
      -(Nakama.player.sprite.y - Nakama.game.height/2)
    );
    for(var i = 0; i < Nakama.missiles.length; i++) {
      Nakama.missiles[i].update(shift);

      // if missile isn't alive then destroy it
      if(!Nakama.missiles[i].sprite.alive){
        Nakama.missiles.splice(i, 1);
      }
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

    Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.missileGroup, onMissileHitShip);

    Nakama.game.physics.arcade.overlap(Nakama.missileGroup, Nakama.missileGroup, onMissileHitMissile);

    Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.itemGroup, (ship, item) => {
      item.kill();
    });
  }else {
    // TODO: if player has died then do something
  }
}

// before camera render (mostly for debug)
var render = function() {

}

var generateItems = function() {
  Nakama.starGenerator.generate();
}

// auto generate missiles
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

var onMissileHitShip = function(ship, missile) {
  ship.kill();
  missile.kill();
  getExplosion(ship.body.x, ship.body.y);
}

var onMissileHitMissile = function(missile1, missile2) {
  missile1.kill();
  missile2.kill();
  getExplosion(missile1.body.x, missile2.body.y);
}

var getExplosion = function(x, y) {
  // Get the first dead explosion from the explosionGroup
  var explosion = Nakama.explosionGroup.getFirstDead();

   // If there aren't any available, create a new one
  if (explosion === null) {
    explosion = Nakama.game.add.sprite(0, 0, 'explode');
    explosion.anchor.setTo(0.5, 0.5);

    var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,12,13,14,15], 30, false);
    animation.killOnComplete = true;

    Nakama.explosionGroup.add(explosion);
  }

  explosion.revive();

  explosion.x = x;
  explosion.y = y;

  // Set rotation of the explosion at random for a little variety
   explosion.angle = Nakama.game.rnd.integerInRange(0, 360);

  // Play the animation
  explosion.animations.play('boom');
}

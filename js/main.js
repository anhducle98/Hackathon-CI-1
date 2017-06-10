var Nakama = {};
Nakama.configs = {
    ship: {
        SPEED: 10, // pixels/frame
        TURN_RATE: 200 // degree/frame
    },
    missile: {
        SPEED: 10,
        TURN_RATE: 130,
        COOLDOWN: 1,
        MAX_POPULATION: 5
    },
    item: {
        COOLDOWN: 1
    }
};

window.onload = function(){
    Nakama.game = new Phaser.Game(1600,960,Phaser.AUTO,'',
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
    Nakama.game.scale.maxWidth = 1600;
    Nakama.game.scale.maxHeight = 960;
    Nakama.game.scale.pageAlignHorizontally = true;
    Nakama.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    Nakama.game.time.advancedTiming = true;

    Nakama.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
    Nakama.game.load.image('smoke', 'Assets/rocket.png');
    Nakama.game.load.image('background', 'Assets/backgroundNew.png');
    Nakama.game.load.image('namegame', 'Assets/Original Sprites/NameGame.png');

    Nakama.game.load.spritesheet('button', 'Assets/Original Sprites/ButtonPlay.png', 212, 213);
    Nakama.game.load.spritesheet('pause', 'Assets/Original Sprites/ButtonStop.png', 212, 213);
    Nakama.game.load.spritesheet('explode', 'Assets/Original Sprites/Explode.png', 128, 128);

    Nakama.game.load.audio('AirPlaneExplosive', ['Assets/Mp3/AirPlaneExplosive.mp3']);
    Nakama.game.load.audio('AirPlaneType1', ['Assets/Mp3/AirPlaneType1.mp3']);
    Nakama.game.load.audio('GetItem', ['Assets/Mp3/GetItem.mp3']);
    Nakama.game.load.audio('GetItemStar', ['Assets/Mp3/GetItemStar.mp3']);
    Nakama.game.load.audio('Missile', ['Assets/Mp3/Missile.mp3']);
    Nakama.game.load.audio('MissileExplosive', ['Assets/Mp3/MissileExplosive.mp3']);
    Nakama.game.load.audio('PressButtonPlay', ['Assets/Mp3/PressButtonPlay.mp3']);
}

// initialize the game
var create = function(replay){
    music = Nakama.game.add.audio('AirPlaneType1');
    music.play();
    music.loopFull(1);
    Nakama.explosionSound = Nakama.game.add.audio('AirPlaneExplosive');
    Nakama.getItemSound = Nakama.game.add.audio('GetItem');

    Nakama.game.physics.startSystem(Phaser.Physics.ARCADE);
    Nakama.background = Nakama.game.add.tileSprite(0, 0, Nakama.game.width, Nakama.game.height, 'background');
    //Nakama.background.alpha = 0.95;
    Nakama.smokeGroup = Nakama.game.add.physicsGroup();
    Nakama.warningsGroup = Nakama.game.add.physicsGroup();
    Nakama.itemGroup = Nakama.game.add.physicsGroup();
    Nakama.playerGroup = Nakama.game.add.physicsGroup();
    Nakama.missileGroup = Nakama.game.add.physicsGroup();
    Nakama.explosionGroup = Nakama.game.add.physicsGroup();

    Nakama.player = new ShipController(Nakama.game.width/2, Nakama.game.height/2, {WOBBLE_LIMIT: 0, WOBBLE_SPEED: 0});

    Nakama.health = Nakama.game.add.sprite(Nakama.game.width/2, Nakama.game.height/2, 'assets', 'Shield.png');
    Nakama.health.scale.setTo(0.7, 0.7);
    Nakama.health.anchor.setTo(0.5, 0.5);
    Nakama.health.visible = false;

    Nakama.starScore = 0;
    Nakama.game.add.sprite(Nakama.game.width - 150, 10, 'assets', 'ButtonStar.png');
    Nakama.starScoreText = Nakama.game.add.text(
        Nakama.game.width - 60, 18, Nakama.starScore,
        { font: '34px Arial', fill: 'black', wordWrap: true, wordWrapWidth: 50 }
    );
    Nakama.bonus = 0;

    Nakama.countTime = 0;
    Nakama.game.add.sprite(10, 10, 'assets', 'IconTime.png');
    Nakama.timeScore = Nakama.game.add.text(
        90, 18, Nakama.countTime,
        { font: '34px Arial', fill: 'black', wordWrap: true, wordWrapWidth: 50 }
    );

    Nakama.missiles = [];
    Nakama.killerMissiles = [];

    Nakama.game.input.activePointer.x = -Nakama.game.width/2;
    Nakama.game.input.activePointer.y = Nakama.game.height/2;

    Nakama.starGenerator = new ItemGenerator(3, StarItem);
    Nakama.speedGenerator = new ItemGenerator(10, SpeedItem);
    Nakama.healthGenerator = new ItemGenerator(10, HealthItem);

    Nakama.warningsContainer = new WarningsContainer();
    Nakama.checkPause = false;
    Nakama.buttonpause = Nakama.game.add.button(Nakama.game.width/2, 70, 'pause', actionPause, this);
    Nakama.buttonpause.width = 77;
    Nakama.buttonpause.height = 77;
    Nakama.buttonpause.anchor.setTo(0.5, 0.5);
    Nakama.buttonpause.visible = false;
    Nakama.replayButton = Nakama.game.add.button(
        Nakama.game.world.centerX - 95, 700, 'button', replayOnclick, this
    );
    Nakama.replayButton.visible = false;

    Nakama.timer = Nakama.game.time.events;
    if (!(replay === true)){
        Nakama.button = Nakama.game.add.button(Nakama.game.world.centerX - 95, 700, 'button', actionOnClick, this)
        Nakama.checkPlay = false;
        Nakama.countTime = 0;
        begin();
    }
}

var begin = function(){
    Nakama.name = Nakama.game.add.sprite(Nakama.game.width/2, 100, 'namegame');
    Nakama.name.scale.setTo(0.5, 0.5);
    Nakama.name.anchor.setTo(0.5, 0.5);
}

var updateCounter = function() {
  Nakama.countTime++;
  Nakama.timeScore.setText(Nakama.countTime);
}

function actionOnClick () {
    Nakama.checkPlay = true;
    Nakama.button.visible = false;
    Nakama.buttonpause.visible = true;
    Nakama.name.visible = false;
    Nakama.timer.loop(Phaser.Timer.SECOND, updateCounter, this);
}

// update game state each frame
var update = function(){
    if (Nakama.checkPause) {
        Nakama.timer.pause();
        return;
    }
    if (Nakama.player.sprite.alive) {
        Nakama.timer.resume();
    } else {
        Nakama.timer.pause();
    }
    if (Nakama.checkPlay) {
        if (Nakama.player.sprite.alive) {
            Nakama.player.update();
            generateItems();
        }
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
        for(var i = 0; i < Nakama.killerMissiles.length; i++) {
            Nakama.killerMissiles[i].update(shift);

            // if missile isn't alive then destroy it
            if(!Nakama.killerMissiles[i].sprite.alive){
                Nakama.killerMissiles.splice(i, 1);
            }
        }

        Nakama.background.tilePosition.x += shift.x;
        Nakama.background.tilePosition.y += shift.y;

        Nakama.itemGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Nakama.explosionGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Nakama.smokeGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Nakama.player.sprite.x = Nakama.game.width/2;
        Nakama.player.sprite.y = Nakama.game.height/2;

        generateMissiles();
        generateKillerMissiles();

        Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.missileGroup, onMissileHitShip);
        Nakama.game.physics.arcade.overlap(Nakama.missileGroup, Nakama.missileGroup, onMissileHitMissile);
        Nakama.game.physics.arcade.overlap(Nakama.playerGroup, Nakama.itemGroup, onMissileHitItem);

        Nakama.warningsContainer.update();
    } else {
        Nakama.background.tilePosition.y += Nakama.configs.ship.SPEED;
    }
}

// before camera render (mostly for debug)
var render = function() {
    /*
    Nakama.game.debug.body(Nakama.player.sprite);
    
    Nakama.itemGroup.forEach((item) => {
        Nakama.game.debug.body(item);
    });
    Nakama.missileGroup.forEach((item) => {
        Nakama.game.debug.body(item);
    });
    */
}

var generateItems = function() {
    let star = Nakama.starGenerator.generate();
    if (star != null) {
        Nakama.warningsContainer.putWarning(star.sprite);
    }

    let speed = Nakama.speedGenerator.generate();
    if (speed) {
        Nakama.warningsContainer.putWarning(speed.sprite);
    }
    let health = Nakama.healthGenerator.generate();
    if (health) {
        Nakama.warningsContainer.putWarning(health.sprite);
    }
}

// auto generate missiles
var sinceLastMissile = 0;
var sinceLastKillerMissile = 0;
var generateMissiles = function() {
    sinceLastMissile += Nakama.game.time.physicsElapsed;
    if (sinceLastMissile < Nakama.configs.missile.COOLDOWN) return;
    sinceLastMissile = 0;
    Nakama.missiles.filter((item) => (item.sprite.alive));
    if (Nakama.missiles.length >= Nakama.configs.missile.MAX_POPULATION) return;

    let deltaX = Math.random() * 300 - 150;
    let deltaY = Math.random() * 300 - 150;
    if (deltaX < 0) deltaX -= 800; else deltaX += 800;
    if (deltaY < 0) deltaY -= 800; else deltaY += 800;
    let x = Nakama.player.sprite.x + deltaX;
    let y = Nakama.player.sprite.y + deltaY;

    let limit = Math.random() * 5;
    if (Math.random() < 0.5) limit = 0;
    let missile = new MissilesController(x, y, {WOBBLE_LIMIT: limit, WOBBLE_SPEED: 255});

    Nakama.missiles.push(missile);
    Nakama.warningsContainer.putWarning(missile.sprite);
}

var generateKillerMissiles = function() {
    sinceLastKillerMissile += Nakama.game.time.physicsElapsed;
    if (sinceLastKillerMissile < Nakama.configs.missile.COOLDOWN * 10) return;
    sinceLastKillerMissile = 0;
    for (let it = 1; it <= 5; ++it) {
        let deltaX = Math.random() * 600 - 300;
        let deltaY = Math.random() * 600 - 300;
        if (deltaX < 0) deltaX -= 600; else deltaX += 600;
        if (deltaY < 0) deltaY -= 600; else deltaY += 600;
        let x = Nakama.player.sprite.x + deltaX;
        let y = Nakama.player.sprite.y + deltaY;
        let missile = new KillerMissilesController(x, y, {WOBBLE_LIMIT: 0, WOBBLE_SPEED: 255});
        Nakama.killerMissiles.push(missile);
        Nakama.warningsContainer.putWarning(missile);
    }
}

var playExplosionSound = function() {
    Nakama.explosionSound.play();
}

var getItem = function() {
    Nakama.getItemSound.play();
}

var onMissileHitShip = function(ship, missile) {
    if (Nakama.health.visible){
      Nakama.health.visible = false;
    }
    else {
        ship.kill();
        Nakama.timer.pause();
        // game over
        var style1 = { font: "bold 50px Arial", fill: "black", boundsAlignH: "center", boundsAlignV: "middle" };
        var style2 = { font: "bold 32px Arial", fill: "black", boundsAlignH: "center", boundsAlignV: "middle" };
        var totalScore = Nakama.starScore * 15 + Nakama.bonus + Nakama.countTime;
        var text = 'YOUR SCORE: ' + totalScore;
        Nakama.box = Nakama.game.add.group();
        Nakama.box.addChild(Nakama.game.add.text(0, 0, text, style1));
        Nakama.box.addChild(Nakama.game.add.sprite(80, 300, 'assets', 'IconTime.png'));
        Nakama.box.addChild(Nakama.game.add.sprite(80, 400, 'assets', 'ButtonStar.png'));
        Nakama.box.addChild(Nakama.game.add.text(250, 300, '+' + Nakama.countTime, style2));
        Nakama.box.addChild(Nakama.game.add.text(250, 400, '+' + Nakama.starScore * 15, style2));
        Nakama.box.addChild(Nakama.game.add.text(50, 500, 'Bonus:'), style2);
        Nakama.box.addChild(Nakama.game.add.text(250, 500, '+' + Nakama.bonus, style2));


        if(localStorage.getItem('highscore') === null){
            localStorage.setItem('highscore', totalScore);
        }else if(totalScore > localStorage.getItem('highscore')){
            localStorage.setItem('highscore', totalScore);
        }
        Nakama.box.addChild(Nakama.game.add.text(80, 100, 'HIGHSCORE: ' + localStorage.getItem('highscore'), style2));
        let maxWidth = 0;
        Nakama.box.forEach((text) => {text.update(); maxWidth = Math.max(maxWidth, text.width);});
        Nakama.box.x = Nakama.game.width / 2 - maxWidth / 2;
        Nakama.box.y = 100;
        console.log(maxWidth);
        console.log(Nakama.game.width);
        Nakama.replayButton.visible = true;
        Nakama.buttonpause.visible = false;
    }
    missile.kill();
    getExplosion(ship.body.x, ship.body.y);
    playExplosionSound();
}

var onMissileHitMissile = function(missile1, missile2) {
    getExplosion(missile1.body.x, missile1.body.y);
    playExplosionSound();
    missile1.kill();
    missile2.kill();

    Nakama.bonus += 10;
    var style = { font: '34px Arial', fill: 'orange' };
    var bonusPrompt = Nakama.game.add.text(Nakama.game.width - 100, 90, '+10', style);
    Nakama.game.time.events.add(500, function() {
        Nakama.game.add.tween(bonusPrompt).to({y: 100}, 1500, Phaser.Easing.Linear.None, true);
        Nakama.game.add.tween(bonusPrompt).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    }, this);
    bonusPrompt.destroy();
}

var onMissileHitItem = function(ship, item) {
    item.kill();
    checkItem(item);
    if (item.itemType == "Star") {
        Nakama.starScore += 1;
        Nakama.starScoreText.text = Nakama.starScore;
    }
    getItem();
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
    explosion.angle = Nakama.game.rnd.integerInRange(0, 360);
    explosion.animations.play('boom');
}

var replayOnclick = function() {
    console.log("replayed");
    Nakama.game.world.removeAll();
    create(true);
    Nakama.timer.resume();
    Nakama.replayButton.kill();
    Nakama.buttonpause.visible = true;
}

var checkItem = function(item) {
    if (item.itemType == 'Speed'){
        Nakama.player.configs.speed = Nakama.configs.ship.SPEED * 1.25;
        setTimeout(function(){
            Nakama.player.configs.speed = Nakama.configs.ship.SPEED;
        }, 10000);
    }
    if (item.itemType == 'Health'){
        Nakama.health.visible = true;
        setTimeout(function(){
            Nakama.health.visible = false;
        }, 10000);
    }
}

var actionPause = function(){
    let newName = 'button';
    if (Nakama.checkPause) newName = 'pause';
    Nakama.buttonpause.loadTexture(newName);
    Nakama.buttonpause.width = 77;
    Nakama.buttonpause.height = 77;
    Nakama.checkPause = !Nakama.checkPause;
    if (Nakama.checkPause) {
        Nakama.timer.pause();
    } else {
        Nakama.timer.resume();
    }
}

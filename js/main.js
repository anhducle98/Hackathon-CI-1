var Global = {};
Global.configs = {
    ship: {
        SPEED: 10, // pixels/frame
        TURN_RATE: 250 // degree/frame
    },
    missile: {
        SPEED: 12,
        TURN_RATE: 180,
        COOLDOWN: 3,
        MAX_POPULATION: 5
    },
    item: {
        COOLDOWN: 1
    }
};

window.onload = function(){
    Global.game = new Phaser.Game(1600,960,Phaser.AUTO,'',
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
    Global.game.scale.minWidth = 400;
    Global.game.scale.minHeight = 480;
    Global.game.scale.maxWidth = 1600;
    Global.game.scale.maxHeight = 960;
    Global.game.scale.pageAlignHorizontally = true;
    Global.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    Global.game.time.advancedTiming = true;

    Global.game.load.atlasJSONHash('assets', 'Assets/assets.png', 'Assets/assets.json');
    Global.game.load.image('smoke', 'Assets/rocket.png');
    Global.game.load.image('background', 'Assets/backgroundNew.png');
    Global.game.load.image('namegame', 'Assets/Original Sprites/NameGame.png');

    Global.game.load.spritesheet('button', 'Assets/Original Sprites/ButtonPlay.png', 212, 213);
    Global.game.load.spritesheet('pause', 'Assets/Original Sprites/ButtonStop.png', 212, 213);
    Global.game.load.spritesheet('explode', 'Assets/Original Sprites/Explode.png', 128, 128);

    Global.game.load.audio('AirPlaneExplosive', ['Assets/Mp3/AirPlaneExplosive.mp3']);
    Global.game.load.audio('AirPlaneType1', ['Assets/Mp3/AirPlaneType1.mp3']);
    Global.game.load.audio('GetItem', ['Assets/Mp3/GetItem.mp3']);
    Global.game.load.audio('GetItemStar', ['Assets/Mp3/GetItemStar.mp3']);
    Global.game.load.audio('Missile', ['Assets/Mp3/missileSound.mp3']);
    Global.game.load.audio('MissileExplosive', ['Assets/Mp3/MissileExplosive.mp3']);
    Global.game.load.audio('PressButtonPlay', ['Assets/Mp3/PressButtonPlay.mp3']);

    Global.pauseKey = Global.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    Global.pauseKey.onDown.add(actionPause, this);
}

// initialize the game
var create = function(replay){
    Global.music = Global.game.add.audio('AirPlaneType1');
    Global.music.play();
    Global.music.loopFull(1);
    Global.missileSound = Global.game.add.audio('Missile');
    Global.missileSound.play();
    Global.missileSound.loopFull(1);
    Global.missileSound.volume = 0;

    Global.explosionSound = Global.game.add.audio('AirPlaneExplosive');
    Global.getItemSound = Global.game.add.audio('GetItem');

    Global.game.physics.startSystem(Phaser.Physics.ARCADE);
    Global.background = Global.game.add.tileSprite(0, 0, Global.game.width, Global.game.height, 'background');
    //Global.background.alpha = 0.95;
    Global.smokeGroup = Global.game.add.physicsGroup();
    Global.warningsGroup = Global.game.add.physicsGroup();
    Global.itemGroup = Global.game.add.physicsGroup();
    Global.playerGroup = Global.game.add.physicsGroup();
    Global.missileGroup = Global.game.add.physicsGroup();
    Global.explosionGroup = Global.game.add.physicsGroup();
    Global.tweensContainer = [];
    Global.player = new ShipController(Global.game.width/2, Global.game.height/2, {WOBBLE_LIMIT: 0, WOBBLE_SPEED: 0});

    Global.health = Global.game.add.sprite(Global.game.width/2, Global.game.height/2, 'assets', 'Shield.png');
    Global.health.scale.setTo(0.7, 0.7);
    Global.health.anchor.setTo(0.5, 0.5);
    Global.health.visible = false;

    Global.starScore = 0;
    Global.game.add.sprite(Global.game.width - 150, 10, 'assets', 'ButtonStar.png');
    Global.starScoreText = Global.game.add.text(
        Global.game.width - 60, 18, Global.starScore,
        { font: '34px Arial', fill: 'black', wordWrap: true, wordWrapWidth: 50 }
    );
    Global.bonus = 0;

    Global.countTime = 0;
    Global.game.add.sprite(10, 10, 'assets', 'IconTime.png');
    Global.timeScore = Global.game.add.text(
        90, 18, Global.countTime,
        { font: '34px Arial', fill: 'black', wordWrap: true, wordWrapWidth: 50 }
    );
    updateTimeText();

    Global.starCount = 0;
    Global.healthCount = 0;
    Global.speedCount = 0;
    Global.sinceLastMissile = 0;
    Global.sinceLastKillerMissile = 0;

    Global.missiles = [];
    Global.killerMissiles = [];

    Global.game.input.activePointer.x = -Global.game.width/2;
    Global.game.input.activePointer.y = Global.game.height/2;

    Global.starGenerator = new ItemGenerator(3, StarItem);
    Global.speedGenerator = new ItemGenerator(10, SpeedItem);
    Global.healthGenerator = new ItemGenerator(10, HealthItem);

    Global.warningsContainer = new WarningsContainer();
    Global.checkPause = false;
    Global.buttonpause = Global.game.add.button(Global.game.width/2, 70, 'pause', actionPause, this);
    Global.buttonpause.width = 77;
    Global.buttonpause.height = 77;
    Global.buttonpause.anchor.setTo(0.5, 0.5);
    Global.buttonpause.visible = false;
    Global.replayButton = Global.game.add.button(
        Global.game.world.centerX - 95, 700, 'button', replayOnclick, this
    );
    Global.replayButton.visible = false;

    Global.timer = Global.game.time.events;
    if (Global.eventHealth) clearTimeout(Global.eventHealth);
    if (Global.eventSpeed) clearTimeout(Global.eventSpeed);

    if (!(replay === true)){
        Global.button = Global.game.add.button(Global.game.world.centerX - 95, 700, 'button', actionOnClick, this)
        Global.checkPlay = false;
        Global.countTime = 0;
        begin();
    }
}

var begin = function(){
    Global.name = Global.game.add.sprite(Global.game.width/2, 100, 'namegame');
    Global.name.scale.setTo(0.5, 0.5);
    Global.name.anchor.setTo(0.5, 0.5);
}

var updateTimeText = function() {
  let pad2 = (number) => (number < 10 ? '0' : '') + number;
  Global.timeScore.setText(Math.floor(Global.countTime / 60) + ":" + pad2(Global.countTime % 60));
}

var updateCounter = function() {
  Global.countTime++;
  updateTimeText();
}

function actionOnClick () {
    Global.checkPlay = true;
    Global.button.visible = false;
    Global.buttonpause.visible = true;
    Global.name.visible = false;
    Global.timer.loop(Phaser.Timer.SECOND, updateCounter, this);
}

function adjustMissileVolume() {
    let minDist = 1e9;
    let distance = (x, y, u, v) => Math.sqrt((x - u) * (x - u) + (y - v) * (y - v));
    for (let it of Global.missiles) if (it.sprite.alive) {
        minDist = Math.min(minDist, distance(it.sprite.x, it.sprite.y, Global.player.sprite.x, Global.player.sprite.y));
    }
    Global.missileSound.volume = 1.0 / Math.pow(2, minDist / 50.0);
}

// update game state each frame
var update = function(){
    if (Global.checkPause) {
        Global.timer.pause();
        return;
    }
    if (Global.player.sprite.alive) {
        Global.timer.resume();
    } else {
        Global.timer.pause();
    }
    if (Global.checkPlay) {
        Global.tweensContainer.filter((it) => it.alive);

        if (Global.player.sprite.alive) {
            Global.player.update();
            generateItems();
        }
        var shift = new Phaser.Point(
            -(Global.player.sprite.x - Global.game.width/2),
            -(Global.player.sprite.y - Global.game.height/2)
        );
        for(var i = 0; i < Global.missiles.length; i++) {
            Global.missiles[i].update(shift);

            // if missile isn't alive then destroy it
            if(!Global.missiles[i].sprite.alive){
                Global.missiles.splice(i, 1);
            }
        }
        for(var i = 0; i < Global.killerMissiles.length; i++) {
            Global.killerMissiles[i].update(shift);

            // if missile isn't alive then destroy it
            if(!Global.killerMissiles[i].sprite.alive){
                Global.killerMissiles.splice(i, 1);
            }
        }

        Global.background.tilePosition.x += shift.x;
        Global.background.tilePosition.y += shift.y;

        Global.itemGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Global.explosionGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Global.smokeGroup.forEach((item) => {
            item.x += shift.x;
            item.y += shift.y;
        });

        Global.player.sprite.x = Global.game.width/2;
        Global.player.sprite.y = Global.game.height/2;

        generateMissiles();
        generateKillerMissiles();

        Global.game.physics.arcade.overlap(Global.playerGroup, Global.missileGroup, onMissileHitShip);
        Global.game.physics.arcade.overlap(Global.missileGroup, Global.missileGroup, onMissileHitMissile);
        Global.game.physics.arcade.overlap(Global.playerGroup, Global.itemGroup, onMissileHitItem);

        Global.warningsContainer.update();
        adjustMissileVolume();
    } else {
        Global.background.tilePosition.y += Global.configs.ship.SPEED;
    }
}

// before camera render (mostly for debug)
var render = function() {}

var generateItems = function() {
    if (Global.starCount < 5) {
        let star = Global.starGenerator.generate();
        if (star != null) {
            Global.warningsContainer.putWarning(star.sprite);
            Global.starCount += 1;
        }
    }
    if (Global.speedCount < 2) {
        let speed = Global.speedGenerator.generate();
        if (speed) {
            Global.warningsContainer.putWarning(speed.sprite);
            Global.speedCount += 1;
        }
    }
    if (Global.healthCount < 2) {
        let health = Global.healthGenerator.generate();
        if (health) {
            Global.warningsContainer.putWarning(health.sprite);
            Global.healthCount += 1;
        }
    }
}

// auto generate missiles
var generateMissiles = function() {
    Global.sinceLastMissile += Global.game.time.physicsElapsed;
    if (Global.sinceLastMissile < Global.configs.missile.COOLDOWN) return;
    Global.sinceLastMissile = 0;
    Global.missiles.filter((item) => (item.sprite.alive));
    if (Global.missiles.length >= Global.configs.missile.MAX_POPULATION) return;

    let deltaX = Math.random() * 300 - 150;
    let deltaY = Math.random() * 300 - 150;
    if (deltaX < 0) deltaX -= 800; else deltaX += 800;
    if (deltaY < 0) deltaY -= 800; else deltaY += 800;
    let x = Global.player.sprite.x + deltaX;
    let y = Global.player.sprite.y + deltaY;

    let limit = Math.random() * 5;
    if (Math.random() < 0.5) limit = 0;
    let missile = new MissilesController(x, y, {WOBBLE_LIMIT: limit, WOBBLE_SPEED: 255});

    Global.missiles.push(missile);
    Global.warningsContainer.putWarning(missile.sprite);
}

var generateKillerMissiles = function() {
    Global.sinceLastKillerMissile += Global.game.time.physicsElapsed;
    if (Global.sinceLastKillerMissile < Global.configs.missile.COOLDOWN * 6) return;
    Global.sinceLastKillerMissile = 0;
    for (let it = 1; it <= 5; ++it) {
        let deltaX = Math.random() * 1000 - 500;
        let deltaY = Math.random() * 1000 - 500;
        if (deltaX < 0) deltaX -= 1500; else deltaX += 1500;
        if (deltaY < 0) deltaY -= 1500; else deltaY += 1500;
        let x = Global.player.sprite.x + deltaX;
        let y = Global.player.sprite.y + deltaY;
        let missile = new KillerMissilesController(x, y, {WOBBLE_LIMIT: 0, WOBBLE_SPEED: 255});
        Global.killerMissiles.push(missile);
        Global.warningsContainer.putWarning(missile.sprite);
    }
}

var playExplosionSound = function() {
    Global.explosionSound.play();
}

var getItem = function() {
    Global.getItemSound.play();
}

var onMissileHitShip = function(ship, missile) {
    if (Global.health.visible){
      Global.health.visible = false;
    }
    else {
        ship.kill();
        Global.timer.pause();
        // game over
        var style1 = { font: "bold 50px Arial", fill: "black", boundsAlignH: "center", boundsAlignV: "middle" };
        var style2 = { font: "bold 32px Arial", fill: "black", boundsAlignH: "center", boundsAlignV: "middle" };
        var totalScore = Global.starScore * 15 + Global.bonus + Global.countTime;
        var text = 'YOUR SCORE: ' + totalScore;
        Global.box = Global.game.add.group();
        Global.box.addChild(Global.game.add.text(0, 0, text, style1));
        Global.box.addChild(Global.game.add.sprite(90, 200, 'assets', 'IconTime.png'));
        Global.box.addChild(Global.game.add.sprite(90, 300, 'assets', 'ButtonStar.png'));
        Global.box.addChild(Global.game.add.text(260, 200, '+' + Global.countTime, style2));
        Global.box.addChild(Global.game.add.text(260, 300, '+' + Global.starScore * 15, style2));
        Global.box.addChild(Global.game.add.text(60, 400, 'Bonus:'), style2);
        Global.box.addChild(Global.game.add.text(260, 400, '+' + Global.bonus, style2));


        if(localStorage.getItem('highscore') === null){
            localStorage.setItem('highscore', totalScore);
        }else if(totalScore > localStorage.getItem('highscore')){
            localStorage.setItem('highscore', totalScore);
        }
        Global.box.addChild(Global.game.add.text(90, 100, 'HIGHSCORE: ' + localStorage.getItem('highscore'), style2));
        let maxWidth = 0;
        Global.box.forEach((text) => {text.update(); maxWidth = Math.max(maxWidth, text.width);});
        Global.box.x = Global.game.width / 2 - maxWidth / 2;
        Global.box.y = 100;
        Global.replayButton.visible = true;
        Global.buttonpause.visible = false;
        Global.music.stop();
        Global.missileSound.stop();
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

    Global.bonus += 10;
    var style = { font: '34px Arial', fill: 'orange' };
    var bonusPrompt = Global.game.add.text(Global.game.width - 100, 90, '+10', style);
    Global.game.time.events.add(500, function() {
        Global.game.add.tween(bonusPrompt).to({y: 100}, 1500, Phaser.Easing.Linear.None, true);
        Global.game.add.tween(bonusPrompt).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    }, this);
    bonusPrompt.destroy();
}

var onMissileHitItem = function(ship, item) {
    item.kill();
    if (item.itemType == "Star") Global.starCount -= 1;
    if (item.itemType == "Health") Global.healthCount -= 1;
    if (item.itemType == "Speed") Global.speedCount -= 1;

    checkItem(item);
    if (item.itemType == "Star") {
        Global.starScore += 1;
        Global.starScoreText.text = Global.starScore;
    }
    getItem();
}

var getExplosion = function(x, y) {
    // Get the first dead explosion from the explosionGroup
    var explosion = Global.explosionGroup.getFirstDead();

     // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = Global.game.add.sprite(0, 0, 'explode');
        explosion.anchor.setTo(0.5, 0.5);

        var animation = explosion.animations.add('boom', [0,1,2,3,4,5,6,7,8,9,10,12,13,14,15], 30, false);
        animation.killOnComplete = true;

        Global.explosionGroup.add(explosion);
    }
    explosion.revive();
    explosion.x = x;
    explosion.y = y;
    explosion.angle = Global.game.rnd.integerInRange(0, 360);
    explosion.animations.play('boom');
}

var replayOnclick = function() {
    Global.game.world.removeAll();
    create(true);
    Global.timer.resume();
    Global.music.play();
    Global.missileSound.volume = 0;
    Global.missileSound.play();
    Global.replayButton.kill();
    Global.buttonpause.visible = true;
}

var checkItem = function(item) {
    if (item.itemType == 'Speed'){
        Global.player.configs.speed = Global.configs.ship.SPEED * 1.25;
        Global.player.upgrade();
        if (Global.eventSpeed) clearTimeout(Global.eventSpeed);
        Global.eventSpeed = setTimeout(function(){
            Global.player.configs.speed = Global.configs.ship.SPEED;
            Global.player.downgrade();
        }, 10000);
    }
    if (item.itemType == 'Health'){
        Global.health.visible = true;
        if (Global.eventHealth) clearTimeout(Global.eventHealth);
        Global.eventHealth = setTimeout(function(){
            Global.health.visible = false;
        }, 10000);
    }
}

var actionPause = function(){
    let newName = 'button';
    if (Global.checkPause) newName = 'pause';
    Global.buttonpause.loadTexture(newName);
    Global.buttonpause.width = 77;
    Global.buttonpause.height = 77;
    Global.checkPause = !Global.checkPause;
    if (Global.checkPause) {
        Global.timer.pause();
        Global.music.stop();
        Global.missileSound.stop();
        for (let tween of Global.tweensContainer) {
            tween.pause();
        }
    } else {
        Global.timer.resume();
        Global.music.play();
        Global.missileSound.volume = 0;
        Global.missileSound.play();
        for (let tween of Global.tweensContainer) {
            tween.resume();
        }
    }
    //Global.game.physics.arcade.isPaused = (Global.game.physics.arcade.isPaused) ? false : true;

}

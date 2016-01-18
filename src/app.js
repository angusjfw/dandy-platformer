var game = new Phaser.Game(
  800, 600,
  Phaser.AUTO, '',
  { preload: preload, create: create, update: update, render: render }
);

var game, cursors, player, platforms, ledge;

function preload() {
  game.load.image('sky', 'assets/bg-tile.png');
  game.load.image('hills', 'assets/BG.png');
  game.load.image('player', 'assets/dandy.png');
  game.load.image('particle', 'assets/white-smoke.png');
  game.load.image('platform', 'assets/platform.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.setBounds(0, 0, 8000, 6000);
  game.add.tileSprite(0, 0, 8000, 6000, 'hills');
  game.add.tileSprite(0, 0, 8000, 5400, 'sky');

  emitter = game.add.emitter(game.world.centerX, 500, 400);
  emitter.makeParticles('particle');
  emitter.setAlpha(0.1, 0.25, 3000);
  emitter.setScale(0.04, 0.5, 0.04, 0.2, 6000, Phaser.Easing.Quintic.Out);
  emitter.gravity = -20;
  emitter.start(false, 2500, 100);

  platforms = game.add.group();
  platforms.enableBody = true;
  ledge = platforms.create(240, 200, 'platform');
  ledge = platforms.create(500, 500, 'platform');
  ledge = platforms.create(700, 5700, 'platform');
  ledge = platforms.create(400, 5850, 'platform');
  platforms.setAll('body.immovable', true);
 
  player = game.add.sprite(0, 0, 'player');
  game.physics.arcade.enable(player);
  player.body.setSize(20, 58, 18, 6);
  player.body.collideWorldBounds = true;

  cursors = game.input.keyboard.createCursorKeys();
  game.camera.follow(player);
}

function update() {
  game.physics.arcade.collide(player, platforms);
  processControls(player);
  applyPlayerDrag(player);
  emitTrail();
}

function render() {
  //game.debug.body(player);
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(player, 32, 500);
}

function processControls(player) {
  if (cursors.left.isDown) {
    player.body.velocity.x = -100;
  }

  if (cursors.right.isDown) {
    player.body.velocity.x = 100;
  }

  if (cursors.down.isDown) {
    player.body.gravity.y = 500;
  }
  else {
    player.body.gravity.y = 40;
  }

  if (cursors.up.isDown) {
    if (player.body.touching.down) {
      player.body.velocity.y = -200;
    }
    else {
      player.body.velocity.y =  -50;
    }
  }
}

function applyPlayerDrag(player) {
  if (player.body.touching.down) {
    player.body.drag.x = 800;
  }
  else {
    player.body.drag.x = 50;
  }
}

function emitTrail() {
  if (cursors.up.isDown) {
    var px = player.body.velocity.x * -0.2;
    var py = player.body.velocity.y * -0.2;
    emitter.minParticleSpeed.set(px, py);
    emitter.maxParticleSpeed.set(px, py);
    emitter.emitX = player.x + 28;
    emitter.emitY = player.y + 10;
    emitter.on = true;
  } else {
    emitter.on = false;
  }
}

var game = new Phaser.Game(
  800, 600,
  Phaser.AUTO, '',
  { preload: preload, create: create, update: update }
);

var game, cursors, player, platforms, ground, ledge;

function preload() {
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.spritesheet('player', 'assets/dandy.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'sky');

  player = game.add.sprite(32, game.world.height - 150, 'player');
  game.physics.arcade.enable(player);

  platforms = game.add.group();
  platforms.enableBody = true;
  ground = platforms.create(0, game.world.height - 64, 'ground');
  ground.scale.setTo(2, 2);
  ledge = platforms.create(400, 400, 'ground');
  ledge = platforms.create(-150, 250, 'ground');
  platforms.setAll('body.immovable', true);
 
  cursors = game.input.keyboard.createCursorKeys();
}

function update () {
  game.physics.arcade.collide(player, platforms);
  processControls(player);
  applyPlayerDrag(player);
  game.world.wrap(player, 20);
}

function processControls(player) {
  if (cursors.left.isDown) {
    player.body.velocity.x = -100;
  }

  if (cursors.right.isDown) {
    player.body.velocity.x = 100;
  }

  if (cursors.down.isDown) {
    player.body.gravity.y = 1000;
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

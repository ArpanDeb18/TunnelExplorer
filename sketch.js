var undergroundImg, underground;
var invisibleGround;
var alien, alien_move, alienJumping;
var obstacle1, obstacle2, obstaclesGroup;
var flyObstacle, flyingObstaclesGroup;
var gameState;
var gameOver, gameOverImg, gameOverSound;
var reset, resetImg;
var jumpSound;
var score;
var playButton, playButtonImg;
var getReady, getReadyImg;
var homeButton, homeButtonImg;
var highScoreImg;
var console, consoleImg;
var arrow, arrowImg;
var press, pressImg;

localStorage["HighestScore"] = 0;

function preload() {

  undergroundImg = loadImage("underground.png");
  alien_move = loadAnimation("alien_1.png", "alien_2.png");
  obstacle1 = loadAnimation("obs_1_1.png", "obs_1_2.png");
  obstacle2 = loadAnimation("obs_2_1.png", "obs_2_2.png");
  flyObstacle = loadAnimation("fly1.png", "fly2.png");
  alienJumping = loadAnimation("alienJump.png");
  playButtonImg = loadImage("play.png");
  getReadyImg = loadImage("getReady.png");
  gameOverImg = loadImage("gameOver.png");
  resetImg = loadImage("restart2.png");
  homeButtonImg = loadImage("home.png");
  gameOverSound = loadSound("gameOverSound.wav");
  jumpSound = loadSound("jumpSound.wav");
  highScoreImg = loadImage("high-score.png");
  consoleImg = loadImage("CONSOLE.png");
  arrowImg = loadImage("leftArrow.png");
  pressImg = loadImage("pressSpace.jpg");

}

function setup() {

  createCanvas(400, 400);

  underground = createSprite(200, 200);
  underground.addImage("tunnel img", undergroundImg);
  

  invisibleGround = createSprite(200, 380, 200, 10);
  invisibleGround.width = underground.width;
  invisibleGround.visible = false;

  alien = createSprite(40, 370, 10, 10);
  alien.addAnimation("movement", alien_move);
  alien.addAnimation("jumping", alienJumping);
  alien.scale = 0.8;

  playButton = createSprite(200, 250);
  playButton.addImage(playButtonImg);
  playButton.scale = 0.1;
  
  getReady = createSprite(200, 150);
  getReady.addImage(getReadyImg);
  getReady.scale = 0.8;
  
  gameOver = createSprite(200, 200, 50, 50);
  gameOver.addImage("game over img", gameOverImg);
  gameOver.scale = 0.8;


  reset = createSprite(200, 270);
  reset.addImage(resetImg);
  reset.scale = 0.2;
  
  homeButton = createSprite(370, 30);
  homeButton.addImage(homeButtonImg);
  homeButton.scale = 0.8;
  
  /*highScore = createSprite(350, 20);
  highScore.addImage(highScoreImg);
  highScore.scale = 0.1;
  highScore.visible = false;*/

  console = createSprite(40, 370);
  console.addImage(consoleImg);
  console.scale = 0.5;

  arrow = createSprite(40, 100);
  arrow.addImage(arrowImg);
  arrow.scale = 0.05;
  
  press = createSprite(200, 235);
  press.addImage(pressImg);
  press.scale = 0.2;

  obstaclesGroup = new Group();
  flyingObstaclesGroup = new Group();

  score = 0;
  
  gameState = "start";

}

function draw() {

  background(180);
  
  if (gameState === "start") {
    
  homeButton.visible = false;
  gameOver.visible = false;
  reset.visible = false;
  alien.visible = false;
  arrow.visible = false;
  press.visible = false;
  playButton.visible = true;
  getReady.visible = true;
  console.visible = true;
  obstaclesGroup.destroyEach();
  flyingObstaclesGroup.destroyEach();
  underground.velocityX = 0;
    
    
  if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"] = score;
  }
    score = 0;
    
  }
  
  if (mousePressedOver(playButton) && gameState === "start") {
    gameState = "play";
  }
  
  if (mousePressedOver(console) && gameState === "start") {
    gameState = "about";
  }
  
  if (gameState === "about"){
  
    homeButton.visible = false;
    gameOver.visible = false;
    reset.visible = false;
    alien.visible = false;
    playButton.visible = false;
    getReady.visible = false;
    console.visible = false;
    arrow.visible = true;
    press.visible = true;
    obstaclesGroup.destroyEach();
    flyingObstaclesGroup.destroyEach();
    underground.velocityX = 0;
    
    
  }


  if (mousePressedOver(arrow) && gameState === "about") {
    gameState = "start";
  }
  
  if (gameState === "play") {

    homeButton.visible = false;
    reset.visible = false;
    gameOver.visible = false;
    playButton.visible = false;
    getReady.visible = false;
    console.visible = false;
    press.visible = false;

    score = score + Math.round(getFrameRate() / 60);
    
    underground.velocityX = -(4 + 3 * score/100);


    alien.visible = true;
    
    if (underground.x < 50) {
      underground.x = underground.width / 2;
    }

    if (keyDown("space") && alien.y >= 250) {
      alien.velocityY = -10;
      jumpSound.play();
    }

    alien.changeAnimation("movement", alien_move);
    alien.velocityY = alien.velocityY + 0.8;

    alien.collide(invisibleGround);

    spawnObstacles();
    spawnFlyingObstacles();

    if (obstaclesGroup.isTouching(alien) || flyingObstaclesGroup.isTouching(alien)) {
      gameState = "end";
      gameOverSound.play();
    }


  } else if (gameState === "end") {
    underground.velocityX = 0;
    alien.velocityY = 0;
    //obstaclesGroup.destroyEach();
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    flyingObstaclesGroup.setLifetimeEach(-1);
    flyingObstaclesGroup.setVelocityXEach(0);
    //alien.destroy();
    gameOver.visible = true;
    reset.visible = true;
    homeButton.visible = true;
  arrow.visible = false;
  press.visible = false;
  playButton.visible = false;
  getReady.visible = false;
  console.visible = false;
    
    alien.changeAnimation("jumping", alienJumping);
    
  }

  if (mousePressedOver(reset) && gameState === "end") {
    restart();
    
  }
  
  if (mousePressedOver(homeButton) && gameState === "end") {
    gameState = "start";
  }


  drawSprites();
    
  fill("white");
  textSize(20);
  text("Score : " + score, 20, 40);
  
  fill("white");
  textSize(20);
  text("High Score : " + localStorage["HighestScore"], 20, 60);
  
  if(gameState === "about") {
     fill("white");
     textSize(20);
     text("Avoid the obstacles to score higher 😉",  45, 350);
    
     fill("white");
     textSize(19);
     text("Alex, the alien came to visit Earth but ",  75, 90);
    
     fill("white");
     textSize(19);
     text("he got lost inside an underground",  75, 120);
    
     fill("white");
     textSize(19);
     text("tunnel. Help him escape the tunnel! ",  75, 150);
  }

    if(gameState === "start") {
     fill("black");
     textSize(20);
     text("<- Instructions",  75, 380);
  }

}

function spawnObstacles() {

  if (frameCount % 100 === 0) {
    var obstacle = createSprite(425, 370, 50, 50);
    obstacle.velocityX = -(6 + score/100);
    //obstacle.debug = true;
    //obstacle.setCollider("circle", 0, 0, 45);

    obstacle.y = Math.round(random(285, 370));

    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addAnimation("obs 1 img", obstacle1);
        break;
      case 2:
        obstacle.addAnimation("obs 2 img", obstacle2);
        break;
    }

    obstacle.scale = 0.55;
    obstacle.lifetime = 300;

    obstaclesGroup.add(obstacle);
  }
}

function spawnFlyingObstacles() {

  if (score % 80 === 0 && score > 200) {
    var flyingObstacle = createSprite(425, 370, 10, 20);
    flyingObstacle.velocityX = -(3.5 + score/100);
    //obstacle.debug = true;
    //obstacle.setCollider("circle", 0, 0, 45);

    flyingObstacle.y = Math.round(random(100, 280));

    flyingObstacle.addAnimation("flying obs", flyObstacle);
        

    flyingObstacle.scale = 0.55;
    flyingObstacle.lifetime = 300;
    
    gameOver.depth = flyingObstacle.depth;
    flyingObstacle.depth = flyingObstacle.depth + 1;

    flyingObstaclesGroup.add(flyingObstacle);
  }
}

function restart() {
  gameState = "play";
  gameOver.visible = false;
  reset.visible = false;
  homeButton.visible = false;
  alien.changeAnimation("movement", alien_move);
  obstaclesGroup.destroyEach();
  flyingObstaclesGroup.destroyEach();
  underground.velocityX = -4;
  
 if(localStorage["HighestScore"] < score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
}
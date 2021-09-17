var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var boy, boy_running,boy_collided;
var ground, invisibleground;

var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

function preload(){
  boy_running =   loadAnimation("boy1.png","boy2.png","boy3.png","boy4.png","boy5.png","boy6.png","boy7.png","boy8.png");
 // groundImage = loadImage("ground.png");
  boy_collided=loadAnimation("boy1.png","boy2.png")
  coin = loadImage("coin.png");
  obstacle1 = loadImage("stone.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("reset.png");
  backgroundImage=loadImage("backgroundImage.jpg");
  //jumpSound = loadSound("");
  //collidedSound = loadSound("");
}

function setup() {
  createCanvas(600, 600);

  //ground = createSprite(200,470,400,20);
  //ground.addImage("ground",groundImage);
  //ground.scale=1
  //ground.x = width /2;

  boy = createSprite(200,400,50,50);
  boy.addAnimation("running", boy_running);
  boy.addAnimation("collided", boy_collided);
  boy.scale = 0.8;
  boy.setCollider("circle",0,0,300)
    
  invisibleGround = createSprite(400,530,1600,10);
  invisibleGround.visible = true;

  gameOver = createSprite(400,170);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(550,210);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  
  coinsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(backgroundImage);
  
  boy.x=camera.position.x-270;
   
  if (gameState===PLAY){

    
   console.log(boy.y)
    if(keyDown("space")&& boy.y>270) {
      boy.velocityY = -16;
    }
    boy.velocityY = boy.velocityY + 0.8
    spawnCoins();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(boy)){
      gameState = END;
    }
    if(coinsGroup.isTouching(boy)){
      score = score + 1;
      coinsGroup.destroyEach();
    }
    
    if (keyIsDown(LEFT_ARROW) && boy.positionX > width / 2 - 50) {
      boy.positionX -= 5;
      boy.update();
    }
  }
  else if (gameState === END) {
    gameOver.x=camera.position.x;
    restart.x=camera.position.x;
    gameOver.visible = true;
    restart.visible = true;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
        reset();
    }
  }

  else if (gameState === WIN) {
    ground.velocityX = 0;
    boy.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);

    boy.changeAnimation("collided",boy_collided);

    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
  }
  
  boy.collide(invisibleGround);
  drawSprites();

  textSize(20);
  stroke(3);
  fill("black")
  text("Score: "+ score, camera.position.x,50);
  
  if(score >= 5){
    boy.visible = false;
    textSize(30);
    stroke(3);
    fill("black");
    text("Congragulations!! You win the game!! ", 70,200);
    gameState = WIN;
  }
}

function spawnCoins() {
 
  if (frameCount % 150 === 0) {

    var coins = createSprite(camera.position.x+500,330,40,10);
    coins.addImage(coin);

    coins.velocityX = -(6 + 3*score/100)
    coins.scale = 0.6;

    var rand = Math.round(random(1,3));
       
    coins.scale = 0.15;
    coins.lifetime = 400;
    
    coins.setCollider("rectangle",0,0,coins.width/2,coins.height/2)
    coinsGroup.add(coins);
  }
    
  
}

function spawnObstacles() {
  if(frameCount % 120 === 0) {

    var obstacle = createSprite(camera.position.x+400,330,40,40);
    obstacle.setCollider("rectangle",0,0,200,200)
    obstacle.addImage(obstacle1);
    obstacle.velocityX = -(6 + 3*score/100)
    obstacle.scale = 0.40;      

    obstacle.lifetime = 400;
    obstaclesGroup.add(obstacle);
    
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  boy.visible = true;
  boy.changeAnimation("running",
               boy_running);
  obstaclesGroup.destroyEach();
  coinsGroup.destroyEach();
  score = 0;
}

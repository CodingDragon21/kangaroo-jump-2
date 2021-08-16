/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisbleGround;

var obstaclesGroup,obstacleImg

var score=0;
var button
var gameOver, restart;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacleImg = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png")
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  jungle = createSprite(400,100,400,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.3
  jungle.x = width /2;

  kangaroo = createSprite(130,200, 10,10)
  kangaroo.addAnimation("jump", kangaroo_running)
  kangaroo.addAnimation("stop", kangaroo_collided)
  kangaroo.changeAnimation("jump")
  kangaroo.scale = 0.17
  //kangaroo.debug = true
  kangaroo.setCollider("circle", 0,0,300)

 invisbleGround = createSprite(400,390, 800,50)
 invisbleGround.visible = false

restart = createSprite(400, 200, 50, 50)
restart.addImage("redo", restartImg)
restart.scale = 0.1
restart.visible = false

 gameOver = createSprite(400, 250, 50,50)
 gameOver.addImage("lost", gameOverImg)
 gameOver.scale = 0.4
 gameOver.visible = false
  
  shrubsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

}

function draw() {
  background(255);
  kangaroo.x = camera.position.x -270
  kangaroo.collide(invisbleGround)

  if(gameState === PLAY){
  jungle.setVelocity(-7, 0)
  
  if(jungle.x < 50){
    jungle.x = 400
  }

  if(keyDown("space") && kangaroo.y > 290){
    kangaroo.setVelocity(0,-12)
    jumpSound.play()
    }
    kangaroo.velocityY = kangaroo.velocityY + 0.5

    spawnShrubs()
    spawnObstacles()

    if(kangaroo.isTouching(shrubsGroup)){
      score = score + 1
      shrubsGroup.destroyEach()
    }

    if(kangaroo.isTouching(obstaclesGroup)){
      gameState = END
      collidedSound.play()
    }
  }
 
  drawSprites();
  if(gameState === END){
   kangaroo.changeAnimation("stop")
   shrubsGroup.setVelocityEach(0,0)
   obstaclesGroup.setVelocityEach(0,0)
   jungle.setVelocity(0,0)
   kangaroo.setVelocity(0,0)
   obstaclesGroup.setLifetimeEach(-1)
   shrubsGroup.setLifetimeEach(-1)
   restart.visible = true
   gameOver.visible = true

   if(mousePressedOver(restart)){
    restart.visible = false
    gameOver.visible = false
    reset();
  }

  }
 
  if(score === 5){
    gameState = WIN
  }
  if(gameState === WIN){
    fill("orange")
    textFont("impact")
    textSize(40)
   text("YOU WIN!", 350, 200)

   kangaroo.changeAnimation("stop")
   shrubsGroup.setVelocityEach(0,0)
   obstaclesGroup.setVelocityEach(0,0)
   jungle.setVelocity(0,0)
   kangaroo.setVelocity(0,0)
   obstaclesGroup.setLifetimeEach(-1)
   shrubsGroup.setLifetimeEach(-1)
  

   


  }


fill("black")
textSize(25)
textFont("impact")
text("SCORE:" + score, 700, 50)
}
function spawnShrubs(){
  if(frameCount % 150 === 0){
    var shrub = createSprite(camera.position.x + 500, 340,40,10)
    var randomImage = Math.round(random(1,3))
    switch(randomImage){
    case 1: 
    shrub.addImage("bush1", shrub1)
    break;
    case 2:
    shrub.addImage("bush2", shrub2)
    break;
    case 3:
      shrub.addImage("bush3", shrub3)
      break;
      default: 
      break;
    }
    shrub.scale = 0.08
    shrub.velocityX = -7
    shrub.lifetime = 140
    shrubsGroup.add(shrub)

  }
}

function spawnObstacles(){
  if(frameCount % 230 === 0){
    var obstacle = createSprite(camera.position.x + 500, 330,40,10)
    obstacle.addImage("rock", obstacleImg)
    obstacle.scale = 0.16
    obstacle.velocityX = -7
    obstacle.lifetime = 140
    obstaclesGroup.add(obstacle)

  }
}
function reset(){

  gameState = PLAY

obstaclesGroup.destroyEach()
shrubsGroup.destroyEach()
 
kangaroo.changeAnimation("jump")
score = 0
}


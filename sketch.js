var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var jumpSound , checkPointSound, dieSound;

var score=0;

var gameOver, restart;


function preload(){
  trex_running =   loadAnimation("Images/trex1.png","Images/trex3.png","Images/trex4.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  
  groundImage = loadImage("Images/ground2.png");
  
  cloudImage = loadImage("Images/cloud.png");
  
  obstacle1 = loadImage("Images/obstacle1.png");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.png");
  obstacle4 = loadImage("Images/obstacle4.png");
  obstacle5 = loadImage("Images/obstacle5.png");
  obstacle6 = loadImage("Images/obstacle6.png");
  
  gameOverImg = loadImage("Images/gameOver.png");
  restartImg = loadImage("Images/restart.png");

  jumpSound = loadSound("Sounds/jump.mp3")
  dieSound = loadSound("Sounds/die.mp3")
  checkPointSound = loadSound("Sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth-10,displayHeight+10);
  
  trex = createSprite(60,300,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(300,300,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2 - 1100;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(100,170);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(100,200);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,310,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(255);
  
  textSize(20);
  text("Score: "+ score, camera.position.x+300,camera.position.y-200);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(4 + 3*score/100);

    if(score>0 && score%100 === 0){
      checkPointSound.play(); 
   }

    camera.position.x = trex.x;
    camera.position.y = trex.y 
  
    if(keyDown("space") && trex.y >= 159) {
      trex.velocityY = -12;
      jumpSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < camera.position.x){
      ground.x = 300;
    }
  
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,200,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 350;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,290,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}

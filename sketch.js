var trex,trexr,trexc;
var PLAY,END,gameState;
var ground,invground,groundi;
var cloudImg,obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;

var ObstaclesGroup,CloudsGroup;
var gameOver,restart,gameOverImg,restartImg;
var count;

function preload(){
  trexr=loadAnimation('trex1.png','trex3.png','trex4.png');
  trexc=loadAnimation('trex_collided.png');
  groundi=loadAnimation('ground2.png');
  
  gameOverImg=loadImage('gameOver.png');
  restartImg=loadImage('restart.png');
  
  cloudImg=loadImage('cloud.png');
  obstacle1=loadImage('obstacle1.png');
  obstacle2=loadImage('obstacle2.png');
  obstacle3=loadImage('obstacle3.png');
  obstacle4=loadImage('obstacle4.png');
  obstacle5=loadImage('obstacle5.png');
  obstacle6=loadImage('obstacle6.png');
}

function setup() {
  createCanvas(600, 200);
  
  trex=createSprite(50,155,10,50);
  trex.addAnimation('running',trexr);
  trex.addAnimation('collided',trexc);
  trex.scale=0.5;
  trex.setCollider("circle",0,0,30);
  
  ground=createSprite(200,180,400,10);
  ground.addAnimation('ground',groundi)
  ground.velocityX=-4;
  
  invground=createSprite(200,190,400,5);
  invground.visible=false;
  
 PLAY = 1;
 END = 0;
 gameState = PLAY;
  
  ObstaclesGroup = new Group();
 CloudsGroup = new Group();

//place gameOver and restart icon on the screen
gameOver = createSprite(300,100);
restart = createSprite(300,140);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
  
restart.addImage(restartImg);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;
  
  count=0;

}

function draw() {
 //set background to white
  background("white");
  //display score
  text("Score: "+ count, 450, 50);
  console.log(trex.y);
  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count = count + Math.round(getFrameRate()/60);
    
   /* if (count>0 && count%100 === 0){
      
    }*/
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 172){
      trex.velocityY = -12 ;
      //playSound("jump.mp3");
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
     
      gameState = END;
     // playSound("die.mp3");
    }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation('collided',trexc);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //console.log(trex.y);
  
  //stop trex from falling down
  trex.collide(invground);
  
  drawSprites();
  
}

function reset(){
  gameState=PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ObstaclesGroup.destroyEach();
  CloudsGroup.destroyEach();
  trex.changeAnimation("running",trexr);
  count=0;
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1); break;
     case 2: obstacle.addImage(obstacle2); break;
      case 3: obstacle.addImage(obstacle3); break;
       case 4: obstacle.addImage(obstacle4); break;
        case 5: obstacle.addImage(obstacle5); break;
        case 6: obstacle.addImage(obstacle6); break;
        default: break;
    }
        
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloudImg);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200 ;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}

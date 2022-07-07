var backgroundImg;
var balloonImg, balloonAnimation;
var balloonObstacle, birdObstacle;
var upObstacles, downObstacles;
var building1, building2, pole;
var borders;

var dedSound, jumpSound;

var buttomSprite, buttomImg;
var gameOverSprite, gameOverImg

var points = 0;

var buildingsCollider, flyingCollider;
var ded;

var inGame = 1;
var End = 2;

var gameState = inGame

function preload(){

  backgroundImg = loadImage("./assets/bg.png");
  balloonAnimation = loadAnimation("./assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");
  balloonObstacle = loadImage("./assets/obsTop1.png");
  birdObstacle = loadImage("./assets/obsTop2.png");
  gameOverImg = loadImage("./assets/fimdejogo.png");
  buttomImg = loadImage("./assets/restart.png");

  ded = loadAnimation("./assets/balloon1.png");
  dedSound = loadSound("./assets/die.mp3");

  jumpSound = loadSound("./assets/jump.mp3");

  building1 = loadImage("./assets/obsBottom1.png");
  building2 = loadImage("./assets/obsBottom3.png");
  pole = loadImage("./assets/obsBottom2.png");

}

function setup() {

    createCanvas(windowWidth - 25, windowHeight - 25);
    balloonImg = createSprite(372,716);
    balloonImg.addAnimation("balloonAnimation",balloonAnimation);
    balloonImg.addAnimation("ballonbabaia", ded);
    balloonImg.scale = 1.2;
    balloonImg.frameDelay = 15;

    gameOverSprite = createSprite(width/2, height/2 - 250);
    gameOverSprite.addImage(gameOverImg);
    gameOverSprite.scale = 3;


    buttomSprite = createSprite(width/2, height/2);
    buttomSprite.addImage(buttomImg);
    buttomSprite.scale = 3;

    buildingCollider = new Group();
    flyingCollider = new Group();

    balloonImg.debug = false;
    balloonImg.setCollider("RECTANGLE", 0,0, 100,200);

    borders = createEdgeSprites();
}

function draw() {

    background("green")
    image(backgroundImg,0,0,windowWidth - 25,windowHeight - 25);
    //console.log(mouseX);
    //console.log(mouseY);
    
    if(gameState === inGame){

        if(keyDown("UP_ARROW")){
        balloonImg.velocityY = - 15;
        //jumpSound.playMode("untilDone")
        //jumpSound.play();
        //jumpSound.setVolume(2);

        }
            
        balloonImg.velocityY += 2;
        DownObstacles();
        UpObstacles();

        points += frameRate()/35;
        points.toFixed(1);

        

        gameOverSprite.visible = false;
        buttomSprite.visible = false;

        if(
            buildingCollider.isTouching(balloonImg) || 
            flyingCollider.isTouching(balloonImg) || 
            balloonImg.isTouching(borders[3])){
            gameState = End;
            dedSound.play();
            dedSound.setVolume(2);
        }
    }

    if(gameState === End){

        balloonImg.velocityY = 0
        buildingCollider.setVelocityXEach(0);
        flyingCollider.setVelocityXEach(0);

        buildingCollider.setLifetimeEach(-1);
        flyingCollider.setLifetimeEach(-1);
        balloonImg.changeAnimation("ballonbabaia");

        gameOverSprite.visible = true;
        buttomSprite.visible = true;

        

        if(mousePressedOver(buttomSprite)){

            reset();
        }
    }
   
    drawSprites();
    textSize(100);
    text(points, width - 200, height/2);

}

function reset(){

    gameState = inGame;
    flyingCollider.destroyEach();
    buildingCollider.destroyEach();
    points = 0;

    balloonImg.y = 716;
}


function UpObstacles(){

    if(World.frameCount%Math.round(random(30,90)) === 0){
        
        upObstacles = createSprite(width, 50,50,50);
        upObstacles.velocityX = -25;
        upObstacles.y = Math.round(random(1,height/2 - 50));
        upObstacles.lifetime = 60*4;

        var switchObstacle = Math.round(random(1,2));

        switch(switchObstacle){
            case 1: upObstacles.addImage(balloonObstacle);
            upObstacles.scale = 0.70;

            break;

            case 2: upObstacles.addImage(birdObstacle);
            upObstacles.scale = 0.45;

            break;

            default: break;
        }

        flyingCollider.add(upObstacles);
        
    }
}

function DownObstacles(){

    if(World.frameCount%Math.round(random(30,90)) === 0){
        downObstacles = createSprite(width,height- 100,50,50);
        downObstacles.velocityX = -25;
        downObstacles.lifetime = 60*4;

        var switchObstacle = Math.round(random(1,3));

        switch(switchObstacle){
            case 1: downObstacles.addImage(building1);
            downObstacles.scale = 0.70;
            downObstacles.y = height - 600

            break;

            case 2: downObstacles.addImage(building2);
            downObstacles.scale = 0.70;
            downObstacles.y = height - 670;

            break;

            case 3: downObstacles.addImage(pole);
            downObstacles.y = height - 250
            downObstacles.scale = 0.45;

            break;

            default: break;
        }

        downObstacles.depth = gameOverSprite.depth;
        gameOverSprite.depth += 1;

        downObstacles.depth = buttomSprite.depth;
        buttomSprite.depth += 1;

        buildingCollider.add(downObstacles);
    }
}
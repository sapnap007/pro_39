const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

//creating variables
var engine, world;
var trex, trex1, trex2, trex3, trex_running, trexCollided, trexCollidedImg;
var ground, groundImg, invisGround;
var cloud, cloudImg, cloudGroup;
var bird, birdFlying, bird1, bird2, birdsGroup;
var cactus, cactus1, cactus1Img, cactus2, cactus2Img, cactus3, cactus3Img, cactusGroup;
var gameOver, gameOverImg;
var restartButton, restartImg;
var jumpSound;
var score;
var bg;
var gameState = "PLAY";

function preload(){
    //loading images, animations, and sounds
    trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
    trexCollidedImg = loadAnimation("trex4.png");

    jumpSound = loadSound("jumpSound.mp3");

    bg = loadImage("faded-blue.png");

    groundImg = loadImage("Images/ground.png");

    cloudImg = loadImage("Images/cloud.png");

    birdFlying = loadAnimation("Images/bird1.png", "Images/bird2.png");

    cactus1Img = loadImage("Images/cactus1.png");
    cactus2Img = loadImage("Images/cactus2.png");
    cactus3Img = loadImage("Images/cactus3.png");

    gameOverImg = loadImage("Images/gameOver.png");
    restartImg = loadImage("Images/restart.png");
}

function setup(){
    //creating sprites and groups
    createCanvas(displayWidth - 600, displayHeight - 350);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    ground = createSprite(width/2, height - 30, width, 50);
    ground.addImage(groundImg);
    ground.x = width/2;

    trex = createSprite(width/2 - 450, height - 70, 20, 50);
    trex.addAnimation("trexRunning", trex_running);
    trex.addAnimation("collided", trexCollidedImg);
    trex.setCollider("rectangle", 0, 0, 70, 90);
    trex.scale = 0.5;

    invisGround = createSprite(width/2, height - 25, width, 40);
    invisGround.visible = false;

    gameOver = createSprite(width/2, height/2 - 50, width, 125);
    gameOver.addImage(gameOverImg);
    gameOver.scale = 0.5;
    gameOver.visible = false;

    restartButton = createSprite(width/2, height/2 + 40, 20, 20);
    restartButton.addImage(restartImg);
    restartButton.scale = 0.5;
    restartButton.visible = false;

    cloudGroup = new Group();
    cactusGroup = new Group();
    birdsGroup = new Group();

    score = 0;

}

function draw(){
    background(bg);
    Engine.update(engine);

    textSize(20);
    fill("black");
    stroke("black");
    text("Score: " + score, windowWidth - windowWidth + 20, windowHeight - windowHeight + 50);

    //the game plays when gameState is === "PLAY"
    if (gameState === "PLAY"){
        //trex.debug = true;
        score = score + Math.round(getFrameRate()/60);
        ground.velocityX = -(6 + 3 * score/100);

        if (ground.x < 450){
            ground.x = width/2 + 70;
        }

        //when the trex jumps
        if (keyDown("SPACE") && trex.y >= height - 100){
            trex.velocityY = -15;
            jumpSound.play();
        }

        trex.velocityY = trex.velocityY + 1;
        trex.collide(invisGround);

        spawnClouds();
        spawnCactus();
        spawnBirds();

        if (cactusGroup.isTouching(trex)){
            gameState = "END";
        }
    }

    //what happens when the game ends
    if (gameState === "END"){
        trex.velocityY = 0;
        trex.changeAnimation("collided", trexCollidedImg);

        ground.velocityX = 0;
        
        cactusGroup.setVelocityXEach(0);
        cactusGroup.setLifetimeEach(-1);

        cloudGroup.setVelocityXEach(0);
        cloudGroup.setLifetimeEach(-1);

        birdsGroup.setVelocityXEach(0);
        birdsGroup.setLifetimeEach(-1);

        gameOver.visible = true;
        restartButton.visible = true;

        if (keyDown("space")){
            reset();
        }
    }


    drawSprites();
}

//spawning cacti function
function spawnCactus(){
    if (frameCount % 120 === 0){
        var cactus = createSprite(camera.x + 480, camera.y + 210, 20, 20);
        cactus.setCollider("rectangle", 0, 0, 90, 90);
        //cactus.debug = true;

        cactus.velocityX = -(6 + 3 * score/100);

        var rand = Math.round(random(1, 3));
        switch(rand){
            case 1: cactus.addImage(cactus1Img);
                break;
            case 2: cactus.addImage(cactus2Img);
                break;
            case 3: cactus.addImage(cactus3Img);
                break;
            default: break;
        }

        cactus.scale = 0.5;
        cactus.lifetime = width/cactus.velocityX;
        cactus.depth = trex.depth;

        trex.depth = trex.depth + 1;

        cactusGroup.add(cactus);
    }

}

//spawning clouds function
function spawnClouds(){
    if (frameCount % 100 === 0){
        var cloud = createSprite(camera.x + 500, camera.y + 200, 20, 20);
        cloud.addImage(cloudImg);
        cloud.scale = 0.4;
        cloud.y = Math.round(random(camera.y - 350, camera.y - 50));
        cloud.velocityX = -3;

        cloud.lifetime = width/cloud.velocityX;

        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        cloudGroup.add(cloud);
    }

}

//spawning birds function
function spawnBirds(){
    if (frameCount % 300 === 0){
        var bird = createSprite(camera.x + 500, camera.y + 200, 20, 20);
        bird.addAnimation("flying", birdFlying);
        bird.scale = 0.4;
        bird.y = Math.round(random(camera.y - 250, camera.y + 100));
        bird.velocityX = -5;

        bird.lifetime = width/bird.velocityX;

        bird.depth = trex.depth;
        trex.depth = trex.depth + 1;

        birdsGroup.add(bird);
    }

}

//reseting the game function
function reset(){
    gameState = "PLAY";

    trex.changeAnimation("trexRunning", trex_running);
    trex.x = width/2 - 450;
    trex.y = height - 75;

    gameOver.visible = false;
    restartButton.visible = false;

    cactusGroup.destroyEach();
    cloudGroup.destroyEach();
    birdsGroup.destroyEach();

    score = 0;
}
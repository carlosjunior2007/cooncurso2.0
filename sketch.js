// creamos todas las variables que ocupamos en nuetro codigo
var ground;
var lander;
var lander_img;
var bg_img;
var visibleGround;
var Edge;
var enemigosg;
var meteoritoImg;
var alienImg;
var cancion;
// la variable 'a' es un estados de juego que consta de 3 numeros para el juegos 
var a = 2;
var score = 0;
var bala1g;
// la variable 'constante' es para subir la deficultad de el juego
var constante = 80;
var balaImg;
// esta es la variable que marca el mejor score
var scorem = 0;
var vx = 0;
// estas 2 vaiables sirven para la gravedad
var g = 0.05;
var vy = 0;
var retro;
var prc;

// precargamos todas las imagenes eh audios 
function preload(){

    lander_img = loadImage("normal.png");
    bg_img = loadImage("bg.png");
    meteoritoImg = loadImage("meteorito.png");
    alienImg = loadImage("alien.png");
    cancion = loadSound("cancion de fondo.mp3");
    balaImg = loadImage("rayo laser.png");
    retro = loadSound("retroalimentacion.mp3");
    prc = loadImage("linea.png");

}

function setup() {
  
  // creamos el lugar de juegos con pantalla responsiba para que sirva para cualquier dispositivo 
  createCanvas(displayWidth,displayHeight);
  frameRate(80);

// creo al personaje principal la nave que intentara caer en la luna 
  lander = createSprite(displayWidth-displayWidth+100,displayHeight-displayHeight+50,30,30);
  lander.addImage(lander_img);
  lander.scale = 0.1;
  lander.setCollider("rectangle", 0, 0, 1200, 600);

  // este es el piso principal en que caera la nave
  visibleGround = createSprite(displayWidth-displayWidth+250,displayHeight-300/2,450,20);
  visibleGround.addImage(prc);
  visibleGround.scale=0.7;
  visibleGround.setCollider("rectangle", 0, 0, 600, 70);

  // paredes del lada izquierdo y derecho
  visibleGround2 = createSprite(displayWidth-displayWidth-10,displayHeight/2,10,displayHeight);
  visibleGround3 = createSprite(displayWidth+10,displayHeight/2,10,displayHeight);

  // creo 2 grupos para las funciones que cree
  enemigosg=new Group();
  bala1g=new Group();

  // reproduscola retroalimentacion del juego y un audio de fondo 
  cancion.play();
  retro.play();

}


function draw() {

// la imagen de fondo 
  background(51);
  image(bg_img,0,0,displayWidth,displayHeight);

  // este es para cuando la nave se caega de la plataforma principal que salga un mensaje de señal perdida
  if(lander.y >= displayHeight){
       fill(rgb(246,114,117));
      textSize(45);
      text("señal perdida",displayWidth-displayWidth+550,displayHeight/2);
  }

  // este es el score y el high score junto que su funcionamiento
   textSize(45);
    text("score : " + score , displayWidth-200,displayHeight-displayHeight+75);
    text("HIGH SCORE : " + scorem,displayWidth-displayWidth,displayHeight-displayHeight+75);

  if(score >= scorem){
      scorem = score;
  }

  // las collisiones de la nave con las paredes 

    lander.collide(visibleGround);
    lander.collide(visibleGround2);
    lander.collide(visibleGround3);

  //hago que los pisos si se hagan invisibles
    visibleGround2.visible=false;
    visibleGround3.visible=false;

  // caída
    vy +=g;
    lander.position.y+=vy;

  // movimiento de la nave
  if(keyDown("RIGHT_ARROW")){
      lander.x=lander.x+4;
  }

  if(keyDown("LEFT_ARROW")){
      lander.x=lander.x-4;
  }

  if(touches.length > 0 || keyDown("UP_ARROW")){
      lander.y=lander.y-8;
      touches =[];
  }

  if(keyDown("DOWN_ARROW")){
      lander.y=lander.y+0.5;
  }

  // le aplico gravedad para que no se pueda salir de el planeta
  if(lander.y <= 10){
      lander.y=lander.y+round(vy)+8;
  }

  // pongo retroalimentacion para que sepa que no se puede alejar 
  if(lander.y <= displayHeight-displayHeight+5){
      fill(rgb(255,0,0));
      textSize(25)
      text("no puedes alegarte de este mundo",displayWidth-displayWidth+550,displayHeight/2);
  }

  // si los enemigos me toca 
  if(lander.isTouching(enemigosg)  ||  a === 1){
      a=1;
      enemigosg.destroyEach();
      lander.visible=false;
      score = score-score;
      fill(rgb(111,160,246));
      textSize(45);
      text("lo siento perdiste",displayWidth-displayWidth+550,displayHeight/2);
      text("preciona R para volverlo a intentar",displayWidth-displayWidth+550,displayHeight/2+100);
  }

// boton de reinio
  if(touches.length > 0 || keyDown("r")){
      a=0;
      lander.visible=true;
      touches =[];
  }

// mensaje de inicio para el jugador 
  if(a===2){

    scorem = scorem-scorem;
    score = score-score;
    fill(rgb(127,191,191));
    textSize(45);
    text("Al llegar a 40 puntos tendras una habilidad extra",displayWidth-1400,displayHeight/2);
    text("Presiona la tecla r para iniciar",displayWidth-1400,displayHeight-500);
    enemigosg.destroyEach();

  }

  // si la bala del jugador toca a los enemigos 
  if(bala1g.isTouching(enemigosg)){
      enemigosg.destroyEach();
      bala1g.destroyEach();
      score = score+2;
  }

 // aumento el score con el tiempo 
  if(frameCount % 300 === 0){
      score = score+1;
  }

  // aumento la dificultad
  if(frameCount % 200 === 0){
      constante = 40;
  }

  // les hablo a mis funciones 
    enemigos();
    bala();
    drawSprites();
}

// esta funcion es para los enemigos 
function enemigos(){
  if (frameCount % constante === 0){
      var enemigos=createSprite(displayWidth+100,random(0,displayHeight),10,10);
      enemigos.velocityX=-4;
      enemigos.lifetime=displayWidth/enemigos.velocityX;
      var num = Math.round(random(1,2));
      // utilizo el switch para las imagenes 
        switch(num){
          case 1:
              enemigos.addImage(meteoritoImg);
              enemigos.scale=0.7;
              enemigos.setCollider("rectangle", 0, 0, 200, 80);
              //enemigos.setCollider("circle",0,0,40);
          break;
          case 2:
              enemigos.addImage(alienImg);
              enemigos.scale=0.3;
          break;
          default:break;
    }
        enemigosg.add(enemigos);
  }
}

// esta es la funcion bala
function bala(){
  if(frameCount % constante === 0 && score >= 40){
      var bala = createSprite(lander.x,lander.y,30,30);
      bala.addImage(balaImg);
      bala.angle=90;
      bala.velocityX=5;
      bala.scale=0.3;
      bala.lifetime=displayWidth/bala.velocityX;
      bala1g.add(bala);
  }
}
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== סאונד =====
const collectSound = new Audio("assets/collect.mp3");
const hitSound = new Audio("assets/hit.mp3");
const music = new Audio("assets/desert.mp3");
music.loop = true;

// ===== תמונות =====
const mosheImg = new Image();
mosheImg.src = "assets/moshe.png";

const soldierImg = new Image();
soldierImg.src = "assets/soldier.png";

const matzaImg = new Image();
matzaImg.src = "assets/matza.png";

// ===== מצב משחק =====
let running = false;

function startGame(){
  document.getElementById("startScreen").style.display = "none";
  running = true;
  music.play();
}

// ===== שחקן =====
let player = { x:60, y:300, size:50 };

let touchY = player.y;

// ===== אויבים ופריטים =====
let enemies = [];
let items = [];

let score = 0;
let level = 1;
let gameOver = false;

// שליטה במגע
canvas.addEventListener("touchmove",(e)=>{
  touchY = e.touches[0].clientY;
});

// יצירה
function spawnEnemy(){
  enemies.push({x:canvas.width,y:Math.random()*canvas.height,size:50,speed:3+level});
}

function spawnItem(){
  items.push({x:canvas.width,y:Math.random()*canvas.height,size:30});
}

// התנגשות
function collide(a,b){
  return a.x < b.x + b.size &&
         a.x + a.size > b.x &&
         a.y < b.y + b.size &&
         a.y + a.size > b.y;
}

let et=0,it=0;

function update(){
  if(!running || gameOver) return;

  player.y += (touchY - player.y)*0.12;

  enemies.forEach(e=>e.x-=e.speed);
  items.forEach(i=>i.x-=2);

  // איסוף מצות
  items = items.filter(i=>{
    if(collide(player,i)){
      score += 10;
      collectSound.play();
      return false;
    }
    return i.x > -100;
  });

  // פגיעה
  enemies.forEach(e=>{
    if(collide(player,e)){
      gameOver = true;
      hitSound.play();
    }
  });

  et++;
  if(et>70){ spawnEnemy(); et=0; }

  it++;
  if(it>110){ spawnItem(); it=0; }

  // שלבים
  if(score > 200) level = 3;   // ים סוף
  else if(score > 100) level = 2; // מדבר
  else level = 1;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // רקע לפי שלב
  if(level==1) ctx.fillStyle="#87CEEB";
  if(level==2) ctx.fillStyle="#e6d2a3";
  if(level==3) ctx.fillStyle="#b0e0e6";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // דמות משה
  ctx.drawImage(mosheImg,player.x,player.y,50,50);

  // אויבים
  enemies.forEach(e=>{
    ctx.drawImage(soldierImg,e.x,e.y,50,50);
  });

  // מצות
  items.forEach(i=>{
    ctx.drawImage(matzaImg,i.x,i.y,30,30);
  });

  // UI
  ctx.fillStyle="black";
  ctx.font="18px Arial";
  ctx.fillText("Score: "+score,20,30);
  ctx.fillText("Level: "+level,20,55);

  if(gameOver){
    ctx.font="40px Arial";
    ctx.fillText("Game Over",canvas.width/2-120,canvas.height/2);
  }
}

function loop(){
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

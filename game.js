const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== מצב משחק =====
let running = false;
let gameOver = false;

let score = 0;
let level = 1;

// ===== שחקן =====
let player = {
  x: 60,
  y: canvas.height / 2,
  size: 40
};

let touchY = player.y;

// ===== אויבים / פריטים =====
let enemies = [];
let items = [];

// ===== ים סוף =====
let seaOpen = false;
let seaX = canvas.width - 120;

// ===== UI =====
const scoreUI = document.getElementById("score");
const levelUI = document.getElementById("level");
const seaBtn = document.getElementById("seaBtn");

// ===== התחלה =====
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  running = true;
}

// ===== פתיחת ים =====
function openSea() {
  seaOpen = true;
  seaBtn.style.display = "none";
}

// ===== שליטה במובייל =====
canvas.addEventListener("touchmove", (e) => {
  touchY = e.touches[0].clientY;
});

// ===== יצירה =====
function spawnEnemy() {
  enemies.push({
    x: canvas.width,
    y: Math.random() * canvas.height,
    size: 40,
    speed: 3 + level
  });
}

function spawnItem() {
  items.push({
    x: canvas.width,
    y: Math.random() * canvas.height,
    size: 25
  });
}

// ===== התנגשות =====
function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

let enemyTimer = 0;
let itemTimer = 0;

// ===== עדכון =====
function update() {
  if (!running || gameOver) return;

  player.y += (touchY - player.y) * 0.12;

  enemies.forEach(e => e.x -= e.speed);
  items.forEach(i => i.x -= 2);

  // איסוף מצות
  items = items.filter(i => {
    if (collide(player, i)) {
      score += 10;
      return false;
    }
    return i.x > -50;
  });

  // פגיעה
  enemies.forEach(e => {
    if (collide(player, e)) {
      gameOver = true;
    }
  });

  enemyTimer++;
  if (enemyTimer > 70) {
    spawnEnemy();
    enemyTimer = 0;
  }

  itemTimer++;
  if (itemTimer > 110) {
    spawnItem();
    itemTimer = 0;
  }

  // שלבים
  if (score > 200) level = 3;
  else if (score > 100) level = 2;
  else level = 1;

  scoreUI.innerText = "Score: " + score;
  levelUI.innerText = "Level: " + level;

  // הצגת כפתור ים סוף
  if (level === 3) seaBtn.style.display = "block";
}

// ===== ציור =====
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // רקע לפי שלב
  if (level === 1) ctx.fillStyle = "#87CEEB";
  if (level === 2) ctx.fillStyle = "#e6d2a3";
  if (level === 3) ctx.fillStyle = "#b0e0e6";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // שחקן
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // אויבים
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.fillRect(e.x, e.y, e.size, e.size);
  });

  // מצות
  ctx.fillStyle = "gold";
  items.forEach(i => {
    ctx.fillRect(i.x, i.y, i.size, i.size);
  });

  // ים סוף
  if (level === 3) {
    ctx.fillStyle = "blue";

    if (!seaOpen) {
      ctx.fillRect(seaX, 0, 80, canvas.height);
    } else {
      ctx.fillRect(seaX - 150, 0, 60, canvas.height);
      ctx.fillRect(seaX + 150, 0, 60, canvas.height);
    }
  }

  // Game Over
  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
  }
}

// ===== לולאה =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

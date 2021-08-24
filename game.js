const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const drawRect = (x, y, w, h, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

const drawCircleF = (x, y, r, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.closePath();
  ctx.fill();
};

const drawCircleS = (x, y, w, r, color) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
};

const drawText = (text, x, y, color) => {
  ctx.fillStyle = color;
  ctx.font = "50px sans-serif";
  ctx.fillText(text, x, y);
};

const user = {
  x: 20,
  y: canvas.height / 2 - 50,
  w: 10,
  h: 100,
  color: "#fff",
  score: 0,
};
const computer = {
  x: canvas.width - 30,
  y: canvas.height / 2 - 50,
  w: 10,
  h: 100,
  color: "#fff",
  score: 0,
};
const balls = [
  {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 9,
    color: "#fff",
    speed: 5,
    velocityX: 3,
    velocityY: 4,
    stop: true,
  },
];

const movePaddle = (e) => {
  let rect = canvas.getBoundingClientRect();
  user.y = e.clientY - rect.top - user.h / 2;
};

canvas.addEventListener("mousemove", movePaddle);

const collision = (b, p) => {
  if (!b || !p) {
    return;
  }
  b.top = b.y - b.r;
  b.bottom = b.y + b.r;
  b.left = b.x - b.r;
  b.right = b.x + b.r;

  p.top = p.y;
  p.bottom = p.y + p.h;
  p.left = p.x;
  p.right = p.x + p.w;

  return (
    b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left
  );
};

const updateBalls = () => {
  balls.forEach((ball) => {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0)
      ball.velocityY = -ball.velocityY;
  });
};

const closestBall = () => {
  let closestDistance = 999999;
  let ballToReturn = null;
  balls.forEach((ball) => {
    function distance(point, toPoint) {
      return (
        Math.pow(point.x - toPoint.x, 2) + Math.pow(point.y - toPoint.y, 2)
      );
    }

    if (closestDistance > distance(ball, computer)) {
      closestDistance = distance(ball, computer);
      ballToReturn = ball;
    }
  });
  return ballToReturn;
};

const havaiFisekGosterVeCanvasiKapat = () => {
  document.getElementById("pyroContainer").style.display = "block";
  document.getElementById("game").style.width = "0";
  document.getElementById("game").style.height = "0";
};

const update = () => {
  if (window.keremBitirdi) {
    return;
  }
  let computerLvl = 0.1;
  // computer.y += (ball.y - (computer.y + computer.h / 2)) * computerLvl;

  updateBalls();

  let totalBallY = 0;
  balls.forEach((ball) => {
    totalBallY += ball.y;
  });

  computer.y += (closestBall().y - (computer.y + computer.h / 2)) * computerLvl;

  balls.forEach((ball) => {
    let player = ball.x < canvas.width / 2 ? user : computer;
    if (collision(ball, player)) {
      let intersctY = ball.y - (player.y + player.h / 2);
      intersctY /= player.h / 2;

      let maxBounceRate = Math.PI / 3;
      let bounceAngle = intersctY + maxBounceRate;

      balls.push({
        x: canvas.width / 2,
        y: canvas.height / 2 + (Math.random() * canvas.height) / 4,
        r: 9,
        color: "#fff",
        speed: 5,
        velocityX: 3,
        velocityY: 4,
        stop: true,
      });

      let direction = ball.x < canvas.width / 2 ? 1 : -1;
      ball.velocityY = ball.speed + Math.cos(bounceAngle);
      ball.velocityX = direction * (ball.speed + Math.sin(bounceAngle));
    } else {
      balls.forEach((ball, index) => {
        if (ball.x < 0) {
          balls.splice(index, 1);
          computer.score++;
          if (user.score > 10) {
            havaiFisekGosterVeCanvasiKapat();
            alert("kazandın");
            window.keremBitirdi = true;

            // location.reload();
          } else if (computer.score > 10) {
            havaiFisekGosterVeCanvasiKapat();
            alert("GG WP BROOO");
            window.keremBitirdi = true;

            // location.reload();
          }
        } else if (ball.x > canvas.width) {
          balls.splice(index, 1);
          user.score++;
          if (user.score > 10) {
            havaiFisekGosterVeCanvasiKapat();
            alert("kazandın");
            window.keremBitirdi = true;
          } else if (computer.score > 10) {
            havaiFisekGosterVeCanvasiKapat();
            alert("GG WP BROOO");
            window.keremBitirdi = true;
          }
        }
      });
    }
  });
};

const render = () => {
  drawRect(0, 0, canvas.width, canvas.height, "#52B34F9C");
  drawRect(canvas.width / 2 - 2, 0, 4, canvas.height, "#fff");
  drawCircleF(canvas.width / 2, canvas.height / 2, 8, "#fff");
  drawCircleS(canvas.width / 2, canvas.height / 2, 50, 4, "#fff");
  drawText(user.score, canvas.width / 4, 100, "#fff");
  drawText(computer.score, (3 * canvas.width) / 4, 100, "#fff");

  drawRect(user.x, user.y, user.w, user.h, user.color);
  drawRect(computer.x, computer.y, computer.w, computer.h, computer.color);
  balls.forEach((ball) => {
    drawCircleF(ball.x, ball.y, ball.r, ball.color);
  });
};
const game = () => {
  update();
  render();
};

const fps = 50;
setInterval(game, 1000 / fps);

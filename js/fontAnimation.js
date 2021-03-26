/**
 * demo.js
 */

var fontCanvas = document.querySelector("#titleCanvas"),
  fontctx = fontCanvas.getContext("2d"),
  link = document.createElement('link');
  fontctx.fillStyle = 'rgba(0,0,0,0)';
  particles = [],
  amount = 0,
  mouse = { x: -9999, y: -9999 },
  radius = 1,
  colors = [
    "rgba(0,222,255,0.85)",
    "rgba(12,253,74,0.75)",
    "rgba(193,253,12,0.85)",
    "rgba(192,213,255,0.85)",
    "rgba(244,223,254,0.75)"
  ],
  headline = document.querySelector("#headline"),
  //  ww = window.innerWidth,
  //  wh = window.innerHeight;
  ww = 320,
  wh = 160;

function Particle(x, y) {
  this.x = Math.random() * ww;
  this.y = Math.random() * wh;
  this.dest = { x: x, y: y };
  this.r = Math.random() * 0.8 * Math.PI;
  this.vx = (Math.random() - 0.5) * 25;
  this.vy = (Math.random() - 0.5) * 25;
  this.accX = 0;
  this.accY = 0;
  this.friction = Math.random() * 0.025 + 0.94;
  this.color = colors[Math.floor(Math.random() * 2.75)];
}

Particle.prototype.render = function () {
  this.accX = (this.dest.x - this.x) / 200;
  this.accY = (this.dest.y - this.y) / 200;
  this.vx += this.accX;
  this.vy += this.accY;
  this.vx *= this.friction;
  this.vy *= this.friction;
  this.x += this.vx;
  this.y += this.vy;

  fontctx.fillStyle = this.color;
  fontctx.beginPath();
  fontctx.arc(this.x, this.y, this.r, Math.PI * 2, false);
  fontctx.fill();

  var a = this.x - mouse.x;
  var b = this.y - mouse.y;

  var distance = Math.sqrt(a * a + b * b);
  if (distance < (radius * 25)) {
    this.accX = (this.x - mouse.x) / 200;
    this.accY = (this.y - mouse.y) / 200;
    this.vx += this.accX;
    this.vy += this.accY;
  }
}

function onMouseMove(e) {
  // console.log(e)
  // mouse.x = e.clientX;
  // mouse.y = e.clientY;
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
}

function onTouchMove(e) {
  if (e.touches.length > 0) {

    // mouse.x = e.touches[0].clientX;
    // mouse.y = e.touches[0].clientY;
    mouse.x = e.touches[0].offsetX;
    mouse.y = e.touches[0].offsetY;
  }
}

function onTouchEnd(e) {

  mouse.x = -9999;
  mouse.y = -9999;
}

function initScene() {
  // ww = fontCanvas.width = window.innerWidth;
  // wh = fontCanvas.height = window.innerHeight;
  ww = fontCanvas.width = ww;
  wh = fontCanvas.height = wh;

  fontctx.clearRect(0, 0, fontCanvas.width, fontCanvas.height);

  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'https://fonts.googleapis.com/css?family=Abril+Fatface';
  document.getElementsByTagName('head')[0].appendChild(link);

  fontctx.font = 'bold 60px "Abril Fatface"';
  fontctx.textAlign = "center";
  fontctx.fillText(headline.innerHTML, ww / 2, wh / 1.6);

  var data = fontctx.getImageData(0, 0, ww, wh).data;

  fontctx.clearRect(0, 0, fontCanvas.width, fontCanvas.height);
  fontctx.globalCompositeOperation = "screen";

  particles = [];
  for (var i = 0; i < ww; i += Math.round(ww / 200)) {
    for (var j = 0; j < wh; j += Math.round(ww / 200)) {
      if (data[((i + j * ww) * 4) + 3] > 200) {

        particles.push(new Particle(i, j));
      }
    }
  }
  amount = particles.length;
}

function render(a) {
  requestAnimationFrame(render);
  fontctx.clearRect(0, 0, fontCanvas.width, fontCanvas.height);
  for (var i = 0; i < amount; i++) {
    particles[i].render();
  }
}

headline.addEventListener("keyup", initScene);
window.addEventListener("resize", initScene);
$('#titleCanvas').on("mousemove", onMouseMove);
$('#titleCanvas').on("touchmove", onTouchMove);
$('#titleCanvas').on("touchend", onTouchEnd);
// window.addEventListener("mousemove", onMouseMove);
// window.addEventListener("touchmove", onTouchMove);
// window.addEventListener("touchend", onTouchEnd);
initScene();
requestAnimationFrame(render);
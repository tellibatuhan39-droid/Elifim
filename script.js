window.requestAnimationFrame =
window.__requestAnimationFrame ||
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
(function () {
    return function (callback, element) {
        var lastTime = element.__lastTime || 0;
        var currTime = Date.now();
        var timeToCall = Math.max(1, 33 - (currTime - lastTime));
        window.setTimeout(callback, timeToCall);
        element.__lastTime = currTime + timeToCall;
    };
})();

window.isDevice =
(/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
((navigator.userAgent || navigator.vendor || window.opera)).toLowerCase()
));

var loaded = false;

var init = function () {
if (loaded) return;
loaded = true;

var mobile = window.isDevice;
var koef = mobile ? 0.5 : 1;

var canvas = document.getElementById('heart');
var ctx = canvas.getContext('2d');

var width = canvas.width = koef * innerWidth;
var height = canvas.height = koef * innerHeight;

var rand = Math.random;

ctx.fillStyle = "rgba(0,0,0,1)";
ctx.fillRect(0, 0, width, height);

/* ❤️ YAZI (RİTİMLE BÜYÜR) */
function drawText(beat) {
    ctx.save();

    var fontSize = 36 + beat * 6; // ← ritim etkisi
    ctx.font = "bold " + fontSize + "px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "red";
    ctx.shadowBlur = 25 + beat * 10;

    ctx.fillText(
        "Elifim seni çok seviyorum ❤️",
        width / 2,
        height / 2 - 230
    );

    ctx.restore();
}

var heartPosition = function (rad) {
    return [
        Math.pow(Math.sin(rad), 3),
        -(15 * Math.cos(rad)
        - 5 * Math.cos(2 * rad)
        - 2 * Math.cos(3 * rad)
        - Math.cos(4 * rad))
    ];
};

var scaleAndTranslate = function (pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
};

window.addEventListener('resize', function () {
    width = canvas.width = koef * innerWidth;
    height = canvas.height = koef * innerHeight;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, width, height);
});

var traceCount = mobile ? 20 : 50;
var pointsOrigin = [];
var i;
var dr = mobile ? 0.3 : 0.1;

for (i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
for (i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
for (i = 0; i < Math.PI * 2; i += dr)
    pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));

var heartPointsCount = pointsOrigin.length;
var targetPoints = [];

var pulse = function (kx, ky) {
    for (i = 0; i < pointsOrigin.length; i++) {
        targetPoints[i] = [];
        targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
        targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
    }
};

var e = [];
for (i = 0; i < heartPointsCount; i++) {
    var x = rand() * width;
    var y = rand() * height;
    e[i] = {
        vx: 0,
        vy: 0,
        speed: rand() + 5,
        q: ~~(rand() * heartPointsCount),
        D: 2 * (i % 2) - 1,
        force: 0.2 * rand() + 0.7,
        f: "hsla(0," + ~~(40 * rand() + 60) + "%," + ~~(60 * rand() + 20) + "%,.3)",
        trace: []
    };
    for (var k = 0; k < traceCount; k++) {
        e[i].trace[k] = { x: x, y: y };
    }
}

var config = {
    traceK: 0.4,
    timeDelta: 0.01
};

var time = 0;

var loop = function () {
    var n = -Math.cos(time);
    var beat = (1 + n) * 0.5; // ❤️ NABIZ DEĞERİ

    pulse(1 + beat * 0.1, 1 + beat * 0.1);

    time += ((Math.sin(time)) < 0 ? 9 : (n > 0.8) ? .2 : 1) * config.timeDelta;

    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect

onload = plotCirclesWithText()

function plotCirclesWithText() {
  let elements = document.getElementById("technologies").getElementsByTagName("li");
  var toPlot = {};
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    toPlot[element.innerText] = parseInt(element.dataset.radius) / 2;
  }
  console.log(toPlot);
  // const toPlot = { "matlab": 4, "c++": 5, "python": 7, "check": 5, hello: 6, welcoe: 10 }

  // console.clear();
  var log = console.log.bind(console);

  const MAX_TURNS = 3;
  const MAX_ATTEMPTS = 50;
  const RATING_RANGE = 15;
  const SAFETY_MARGIN = 4;

  var verbose = 0;

  const t = Object.values(toPlot);
  const expansionFactor = Math.floor(window.innerHeight / (RATING_RANGE * SAFETY_MARGIN))
  const pad = expansionFactor * Math.max.apply(null, t);

  const approxArea = Math.PI * ((sum(t) * expansionFactor) ** 2) / t.length

  // Reduce vw and vh to ensure full circles come into picture.(made sure by origin shift)
  const widthForCircles = window.innerWidth - 2 * pad;
  const heigthForCircles = (approxArea * SAFETY_MARGIN / window.innerWidth) - 2 * pad;
  const generateStart = performance.now();

  let turn = 0; // Current Turn
  let wanted = { intialize: "just dont keep this empty" };

  var circlesToPlot = [];
  let circles = [];
  let collisions = 0;

  while (Object.values(wanted).length != 0 && turn < MAX_TURNS) {
    wanted = { intialize: "just dont keep this empty" };
    circles = [];

    collisions = 0;
    for (const key in toPlot) { wanted[key] = toPlot[key]; };

    while (Object.keys(wanted).length != 0 && collisions < MAX_ATTEMPTS) {
      if (verbose)
        console.log("entered here in turn", turn);
      generateCircles();
    }
    if (verbose)
      console.log("turn", turn, circles);

    if (circles.length > circlesToPlot.length) {
      if (verbose)
        console.log("changing circles to plot from", circlesToPlot, "to", circles);
      circlesToPlot = [...circles] // Incase repeated turns are required for circle coordinates and all circles not matched with corrdinates till the last, use the one with maximum matches.
    }
    turn++;
  }
  let generateTime = performance.now() - generateStart;


  // circles.sort(sortSize);
  let context;
  drawCircles();
  addText();

  log("GENERATE TIME", Math.round(generateTime * 100) / 100);
  log("TURNS", turn)

  // function sortSize(a, b) {
  //   return a.radius - b.radius;
  // }

  function overlap(circle1, circle2) {
    distance = Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2)
    if (circle1.radius + circle2.radius > distance) {
      return true; // circles are overlapping.
    }
    return false; // circles do not overlap
  }

  function randomInt(min, max) {
    if (max == null) { max = min; min = 0; }
    if (min > max) { let tmp = min; min = max; max = tmp; }
    return Math.floor(min + (max - min + 1) * Math.random());
  }

  function sum(arr) {
    return arr.reduce(function (a, b) {
      return a + b;
    }, 0);
  }

  function generateCircles() {
    if (wanted.hasOwnProperty("intialize")) {
      delete wanted["intialize"]
    }
    collisions++;
    var x = randomInt(widthForCircles);
    var y = randomInt(heigthForCircles);
    var radius = Math.max.apply(null, Object.values(wanted)); // Max of the array

    if (verbose)
      console.log("working on circle with radius", radius);
    radius = radius * expansionFactor;

    const thisCircle = { "x": x, "y": y, "radius": radius }
    if (verbose)
      console.log("all circles", circles, circles.length);

    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      if (overlap(circle, thisCircle)) {
        return;
      }
    }
    if (verbose)
      console.log("In collision number", collisions, "pushed this circle", thisCircle);
    let language = Object.keys(wanted).find(key => wanted[key] * expansionFactor === radius);
    thisCircle["text"] = language;
    circles.push(thisCircle);
    delete wanted[language];
    if (verbose)
      console.log("now left", wanted);
  }

  function drawCircles() {
    const vw = window.innerWidth;
    const vh = approxArea * SAFETY_MARGIN / vw;

    const canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    const resolution = window.devicePixelRatio || 1;

    canvas.width = vw * resolution;
    canvas.height = vh * resolution;

    canvas.style.width = vw + "px";
    canvas.style.height = vh + "px";

    context.scale(resolution, resolution);
    context.strokeStyle = "rgba(0,0,0,0.7)";
    context.shadowColor = "rgba(0,0,0,0.75)";
    context.shadowOffsetX = 2.5;
    context.shadowOffsetY = 2.5;
    context.shadowBlur = 5;

    for (let i = 0; i < circlesToPlot.length; i++) {
      let c = circlesToPlot[i];
      // let h = Math.round(200 + c.radius / 5);
      // let l = randomInt(50, 70);
      // let color = "hsl(" + h + ",80%," + l + "%)";
      // context.fillStyle = color;
      context.fillStyle = getRandomColor();
      context.beginPath();
      context.arc(c.x + pad, c.y + pad, c.radius, 0, Math.PI * 2);
      context.closePath();
      context.fill();
    }
  }

  function addText() {
    context.fillStyle = "black"; // font color to write the text with
    context.font = "16px comic sans";
    for (let i = 0; i < circlesToPlot.length; i++) {
      const c = circlesToPlot[i];
      // Move it down by half the text height and left by half the text width
      var width = context.measureText(c["text"]).width;
      var height = context.measureText("w").width; // this is a GUESS of height
      context.fillText(c["text"], c.x + pad - (width / 2), c.y + pad + (height / 2));
    }
  }
}

// #RGB
function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// var c, ctx;
// onload = setInterval(randomize, 100);

// //function to generate random circle parameters, x,y and radius

// function randomize() {
//   // console.log("here");
//   c = document.getElementById("canvas");
//   ctx = c.getContext("2d");
//   var rr = Math.ceil((30 * Math.random()) + 5);
//   var rx = Math.ceil(290 * Math.random());
//   var ry = Math.ceil(290 * Math.random());
//   drawCircle(rx, ry, rr);
// }
// function drawCircle(rx, ry, rr) {
//   var myColors = ["blue", "red", "green", "yellow"];
//   var colorPicker = Math.ceil(4 * Math.random() - 1);
//   ctx.strokeStyle = myColors[colorPicker];
//   ctx.beginPath();
//   ctx.arc(rx, ry, rr, 0, 2 * Math.PI);
//   ctx.stroke();
//   ctx.closePath();
// }

// #RGB
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

onload = setRadius()
function setRadius() {
  var elements = document.getElementById("technologies").getElementsByTagName("li");
  for (var i = 0; i < elements.length; i++) {
    style = elements[i].style;
    style.height = style.width = style.lineHeight = elements[i].dataset.radius + 'rem';
    style.backgroundColor = getRandomColor();
  }
  setup();
}



// follows this tutorial:
// https://www.youtube.com/watch?v=XATr_jdh-44

// Uses P5.js for canvas creation and drawing
function setup() {
  var circles = [],
    circle = {},
    overlapping = false,
    NumCircles = 200,
    protection = 10000,
    counter = 0,
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight;

  createCanvas(canvasWidth, canvasHeight);

  // populate circles array
  // brute force method continues until # of circles target is reached
  // or until the protection value is reached
  while (circles.length < NumCircles &&
    counter < protection) {
    circle = {
      x: random(width),
      y: random(height),
      r: random(3, 36)
    };
    overlapping = false;

    // check that it is not overlapping with any existing circle
    // another brute force approach
    for (var i = 0; i < circles.length; i++) {
      var existing = circles[i];
      var d = dist(circle.x, circle.y, existing.x, existing.y)
      if (d < circle.r + existing.r) {
        // They are overlapping
        overlapping = true;
        // do not add to array
        break;
      }
    }

    // add valid circles to array
    if (!overlapping) {
      circles.push(circle);
    }

    counter++;
  }

  // circles array is complete
  // draw canvas once
  background("#233")
  fill("#2AC1A6");
  noStroke();
  for (var i = 0; i < circles.length; i++) {
    ellipse(circles[i].x, circles[i].y,
      circles[i].r * 2, circles[i].r * 2);
  }
}

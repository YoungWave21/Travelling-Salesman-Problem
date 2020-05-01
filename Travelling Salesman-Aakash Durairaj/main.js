"use strict";
initGraphics(800, 600);
// global variables
let cities = [];
let cityCount = 8;
let finished = false;
let order = [];
let shotestDistance = cityCount * cnv.width;
let bestOrder = [];
let allperms = [];
let totalperm = Math.factorial(cityCount);
let count = 0;
// setting the position of the city to a random x and y
for (let i = 0; i < cityCount; i++) {
    cities[i] = { x: Math.random() * cnv.width, y: Math.random() * cnv.height / 2 };
    order[i] = i;
}
for (let i = 0; i < Math.factorial(cityCount); i++) {
    shuffle();
}
requestAnimationFrame(draw);
function draw() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    for (let index = 0; index < 100; index++) {
        let d = calcDistance(cities, allperms[count]);
        // validates if the shortest d is shorter than the sortest distcne and setting d to it
        if (d < shotestDistance) {
            shotestDistance = d;
            bestOrder = allperms[count].slice();
        }
        count++;
        // all the possible permutation are done with and stops the for loop
        if (count >= allperms.length) {
            finished = true;
            break;
        }
    }
    drawLines(bestOrder, 0, "green", 3);
    drawLines(order, cnv.height / 2, "white", 1);
    // stops the loop if the prmutations are done
    if (count >= allperms.length) {
        finished = true;
        return;
    }
    // changing the current order 
    order = allperms[count].slice();
    ctx.font = "36px Ariel"
    ctx.fillStyle = "white";
    if (count * 100 / totalperm > 100) {
        count = totalperm;
    }
    // displaying the percent of how much is done
    ctx.fillText(`${(count * 100 / totalperm).toFixed(2)}%`, 0, 36);
    // keeps looping until the permutaitons are all one with
    if (!finished) {
        requestAnimationFrame(draw);
    }
}
function drawLines(array, y_off_set, color, linewidth) {
    // drawing function that draws lines and points based on the array that is apassed into it
    ctx.strokeStyle = color;
    ctx.fillStyle = "white";
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    for (let i = 0; i < cities.length; i++) {
        ctx.lineTo(cities[array[i]].x, cities[array[i]].y + y_off_set);
    }
    ctx.stroke();
    for (let i = 0; i < cities.length; i++) {
        ctx.fillCircleXYR(cities[i].x, cities[i].y + y_off_set, 4);
    }
}
function calcDistance(points, positionalOrder) {
    // calculating the over all distance the route takes based on the order and sends back the sum
    let sumOfDistance = 0;
    for (let i = 0; i < positionalOrder.length - 1; i++) {
        let PrevCity = points[positionalOrder[i]];
        let NextCity = points[positionalOrder[i + 1]];
        let d = ctx.distance(PrevCity.x, PrevCity.y, NextCity.x, NextCity.y);
        sumOfDistance += d;
    }
    return sumOfDistance;
}
function shuffle() {
    // suffles thorough every all the possible permutations 
    let largestX = -1;
    for (let x = 0; x < order.length - 1; x++) {
        if (order[x] < order[x + 1]) {
            largestX = x;
        }
    }
    let largestY = -1;
    for (let y = 0; y < order.length; y++) {
        if (order[largestX] < order[y]) {
            largestY = y;
        }
    }
    swap(order, largestX, largestY);
    let endArray = order.splice(largestX + 1);
    endArray.reverse();
    order = order.concat(endArray);
    allperms.push(order.slice());
}
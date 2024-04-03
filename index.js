/*
    Game IDEA
    5 minutes to try and solve as many dilations as you can
    Every time you press next validate with colours if all green then wait 500ms and go to next one
 */
var calculator = ""
var finishtime;
var score = -1;
var attempts = 0;
const timems = 1000 * 60 * 5;
const gridSize = 20
const factors = [
    0.25,
    0.5,
    1.5,
    2
]
// Function to find orientation of triplet (p, q, r).
// The function returns following values:
// 0 --> p, q and r are colinear
// 1 --> Clockwise
// 2 --> Counterclockwise
function orientation(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) -
        (q[0] - p[0]) * (r[1] - q[1]);

    if (val == 0) return 0;  // colinear
    return (val > 0) ? 1 : 2; // clock or counterclock wise
}
function getPercent(val,of) {
    return (val/of) * 100 + "%"
}

// Prints convex hull of a set of n points.
function convexHull(points) {
    // There must be at least 3 points
    let n = points.length;
    if (n < 3) return [];

    // Initialize result
    let hull = [];

    // Find the leftmost point
    let l = 0;
    for (let i = 1; i < n; i++)
        if (points[i][0] < points[l][0])
            l = i;

    // Start from leftmost point, keep moving counterclockwise
    // until reach the start point again. This loop runs O(h)
    // times where h is number of points in result or output.
    let p = l, q;
    do {
        // Add current point to result
        hull.push(points[p]);

        // Search for a point 'q' such that orientation(p, x,
        // q) is counterclockwise for all points 'x'. The idea
        // is to keep track of last visited most counterclock-
        // wise point in q. If any point 'i' is more counterclock-
        // wise than q, then update q.
        q = (p + 1) % n;
        for (let i = 0; i < n; i++) {
            // If i is more counterclockwise than current q, then
            // update q
            if (orientation(points[p], points[i], points[q]) == 2)
                q = i;
        }

        // Now q is the most counterclockwise with respect to p
        // Set p as q for next iteration, so that q is added to
        // result 'hull'
        p = q;

    } while (p != l);  // While we don't come to first point

    return hull;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function evalExpression(expression) {
    try {
        var exp = math.evaluate(expression);
        switch (exp) {
            case undefined: {
                return "Math Error"
            }
            default: {
                return exp
            }
        }
    } catch (error) {
        if (error.toString().startsWith("SyntaxError") || error.toString().startsWith("Error: Undefined symbol")) {
            return "Syntax Error";
        } else {
            return "Unknown";
        }
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function getRandomArray(amount, min, max) {
    var ret = []
    for (let i = 0; i < amount; i++) {
        ret.push(getRandomInt(min, max))
    }
    return ret
}

function getRandomCorArray(amount, min, max) {
    var ret = []
    for (let i = 0; i < amount; i++) {
        ret.push([getRandomInt(min, max), getRandomInt(min, max)])
    }
    return ret
}

function convertMSToTime(ms) {
    let seconds = Math.floor(ms / 1000);

    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;

    let time = '';
    if (hours > 0) {
        time += hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    } else {
        time += minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    return time;
}

finishtime = Date.now() + timems
document.querySelectorAll(".calculator .rows row button").forEach(btn => {
    btn.addEventListener("click", () => {
        var btnt = btn.innerHTML
        if (btnt == "×") btnt = "*"
        if (btnt == "÷") btnt = "/"
        if (btnt !== "=") {
            calculator = calculator + btnt
            document.getElementById("output").innerText = calculator
        } else {
            document.getElementById("output").innerText = evalExpression(calculator)
            calculator = ""
        }
    })
})
setInterval(() => {
    document.getElementById("time").innerText = convertMSToTime(finishtime - Date.now())
    var isitgoing = true
    document.querySelectorAll("table tr#new-cords td input").forEach((ele, index2) => {
        if (ele.value == "") {
            isitgoing = false
        }
    })
    if (isitgoing) {
        document.getElementById("next").removeAttribute("disabled")
    } else {
        document.getElementById("next").setAttribute("disabled", "true")
    }
    document.getElementById("score").innerText = `Score: ${score}`
    if(finishtime - Date.now() < 100) {
        location.href = `/done.html?state=${btoa(JSON.stringify({score,attempts,reportto:null}))}`
    }
}, 10)
var newpoints = []
document.getElementById("next").onclick = function () {
    var isallright = true
    document.querySelectorAll("table tr#new-cords td input").forEach((ele, index2) => {
        var isx = index2 % 2 == 0
        var inputcord = ele.value
        if (newpoints[Math.floor(index2 / 2)][isx ? 0 : 1] == inputcord) {
            ele.style.backgroundColor = "#7cff7e"
        } else {
            ele.style.backgroundColor = "#ff7c7c"
            isallright = false
        }
    })
    attempts++
    if(isallright) {
        setTimeout(() => {
            newPoints()
        },500)
    }
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height

function getPosPX(pos) {
    return [pos[0] * gridSize + width / 2, (0 - pos[1]) * gridSize + height / 2]
}

function createPoint(x, y, color) {
    ctx.beginPath()
    var origfill = ctx.fillStyle
    var origstyle = ctx.strokeStyle
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.arc(getPosPX([x, y])[0], getPosPX([x, y])[1], 4, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = origfill
    ctx.strokeStyle = origstyle
}

function drawPointLine(points, col) {
    points = convexHull(points)
    var origstyle = ctx.strokeStyle
    points.forEach(point => {
        createPoint(point[0], point[1], col)
    })
    ctx.strokeStyle = col
    ctx.beginPath()
    ctx.moveTo(getPosPX(points[0])[0], getPosPX(points[0])[1])
    points.forEach(point => {
        ctx.lineTo(getPosPX(point)[0], getPosPX(point)[1])
    })
    ctx.lineTo(getPosPX(points[0])[0], getPosPX(points[0])[1])
    ctx.stroke()
    ctx.strokeStyle = origstyle
    return points
}

function newPoints() {
    score++
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("table").innerHTML = ` <tr id="cords"></tr>
    <tr id="new-cords"></tr>`
    // X
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
// Y
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

// grid
    ctx.strokeStyle = '#ddd';

    for (let x = gridSize / 2; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }

    for (let y = gridSize / 2; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    var points = getRandomCorArray(getRandomInt(3, 6), -6, 6)
    var sf = getRandomInArray(factors)
    document.getElementById("sf").innerText = `Scale Factor: ${sf}`
    newpoints = []
    points.forEach(p => {
        newpoints.push([p[0] * sf, p[1] * sf])
    })
    points = drawPointLine(points, "blue")
    newpoints = convexHull(newpoints)
    points.forEach((point, index) => {
        var span = document.createElement("td")
        span.innerText = `${point[0]}, ${point[1]}`
        var e2 = document.createElement("td")
        var x = document.createElement("input")
        var y = document.createElement("input")
        var span2 = document.createElement("span")
        span2.innerText = ", "
        e2.append(x)
        e2.append(span2)
        e2.append(y)
        document.getElementById("new-cords").append(e2)
        document.getElementById("cords").append(span)
    })
}
newPoints()
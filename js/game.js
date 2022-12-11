var gridsize = 20;

var turncount = 0;
const colors = ["red", "blue", "black", "green", "cyan", "magenta", "purple", "gray", "yellow",
    "darkred", "darkblue"]
var winddata
var windDataScroller;
var boatSize = 32;

var windscenario;
var windscenariocontrol;
var windtype = 0;

const startLineSize = 15;

var boatsvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 32" class="boat-full-svg">
        <g>
            <polygon points="8,0 0,32 16,32" fill="white" stroke="currentColor"/>
            <line y1="10" x1="8" y2="28" x2="8" fill="none" stroke="black"></line>
        </g>
    </svg>
    `;
var boathidesvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 32" class="boat-hidden-svg">
        <g>
            <ellipse rx="2" ry="2" cx="8" cy="16" stroke-width="3" fill="currentColor"
                stroke="currentColor"></ellipse>
        </g>
    </svg>`
var marksvg =
    `<g>
        <ellipse cx="8" cy="8" rx="7" ry="7" fill="none" stroke="#000" stroke-width="0.25"/>
        <ellipse cx="8" cy="8" rx="2" ry="2" fill="#6d2121"/>
    </g>`;

var startx = 6;
var starty = 28;

var upMarkLanelines;

function formatCssPx(val) {
    return val.toFixed(3) + "px";
}

function formatCssDeg(val) {
    return val.toFixed(3) + "deg";
}

function turn() {
    turncount++;

    for (var i = 0; i < game.players.length; i++) {
        game.players[i].turn();
    }

    setTimeout(() => {
        redrawTracks();
    }, 200);

    drawAll();
}

function redrawTracks() {
    for (var i = 0; i < game.players.length; i++) {
        redrawTrack(game.players[i]);
    }
}

function redrawTrack(player) {
    var points = "";

    for (var i = 0; i < turncount + 1; i++) {
        for (var j = 0; j < player.turns[i].points.length; j++) {
            var pt = player.turns[i].points[j];

            points += " " + pt.x.toFixed(3) + "," + pt.y.toFixed(3);
        }
    }
    player.track.setAttribute("points", points);
}

function backTurn() {
    if (turncount > 0) {
        turncount--;

        for (var i = 0; i < game.players.length; i++) {
            game.players[i].back();
        }
        setTimeout(redrawTracks, 200);
        drawAll();
    } else {
        document.body.className = "start";
    }

    updateControls();
}

function drawAll() {
    windDataInit();
    for (var i = 0; i < game.players.length; i++) {
        drawBoat(game.players[i]);
    }
    drawMarks();
    console.log("draw");
    setTimeout(drawWindArrow, 250);
    drawLines()
    updateControls();
}

function drawLines() {
    var linesSvg = document.getElementById("lines-svg");
    linesSvg.setAttribute("viewBox", `0 0 ${game.width} ${game.height}`);
    document.getElementById("lines-container").style.rotate = formatCssDeg(game.getwind(turncount + 1));

    var linesDrawing = document.getElementById("lines-drawing");
    linesDrawing.innerHTML = "";

    for (var i = 0; i < game.height * 2; i++) {
        var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newLine.setAttribute("x1", 0);
        newLine.setAttribute("x2", game.width);
        newLine.setAttribute("y1", i);
        newLine.setAttribute("y2", i);
        linesDrawing.appendChild(newLine);
    }
}

function drawWindArrow() {
    var windDerection = game.getwind(turncount + 1);
    var e = document.getElementById("wind");
    e.style.rotate = formatCssDeg(windDerection * 2);
    if (windDerection > 0) {
        windDerection = "+" + windDerection;
    }
    document.getElementById("wind-label").innerText = `${windDerection}º`
}

function windDataInit() {
    winddata.innerHTML = "";

    var showfuturewind = document.getElementById("show-future-wind").checked;

    if (showfuturewind) {
        document.getElementById("wind-scroll-cont").hidden = false;
    } else {
        document.getElementById("wind-scroll-cont").hidden = true;
        renderGridSize();
        return;
    }
    renderGridSize();


    for (var i = game.wind.length - 1; i >= 1; i--) {
        var isshow;
        isshow = showfuturewind || i < turncount + 2;
        var newelem = document.createElement("li");
        newelem.className = "list-group-item";
        if (i == turncount + 1) {
            newelem.classList.add("active");
        }

        var newlabel = document.createElement("label");
        newlabel.innerText = i.toString() + ":";
        newelem.appendChild(newlabel);

        var newlabel = document.createElement("label");
        var windtext = game.getwind(i);
        if (isshow) {
            if (windtext > 0) {
                windtext = "+" + windtext;
            }
            windtext += "º";
        } else {
            windtext = "??";
        }
        newlabel.innerText = windtext.toString();;
        newlabel.style.position = "absolute";
        newlabel.style.right = "50px";
        newlabel.style.width = "50px";
        newlabel.style.textAlign = "right";
        newlabel.className = "font-monospace";
        newelem.appendChild(newlabel);

        var img = document.createElement("img");
        if (isshow) {
            img.src = "img/wind.svg";
            img.className = "wind-data-arrow wind";
            img.style.rotate = formatCssDeg(game.getwind(i) * 2);
        } else {
            img.src = "img/wind-hide.svg";
            img.className = "pn-wind-hide";
        }
        newelem.appendChild(img);
        winddata.appendChild(newelem);
    }
    windDataScroller.scrollTop = (30 * (game.wind.length - turncount)) - window.innerHeight * 0.5;
}


function drawBoat(player) {
    player.html.style.left = formatCssPx(player.x * gridsize);
    player.html.style.top = formatCssPx(player.y * gridsize);
    player.html.style.rotate = formatCssDeg(player.rotation);
}

function drawMarks() {
    var marksHtmlelem = document.getElementById("marks");
    marksHtmlelem.innerHTML = "";
    for (var i = 0; i < game.marks.length; i++) {
        var newmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var newmarkcont = document.createElement("div");
        newmark.innerHTML = marksvg;
        newmark.setAttribute("viewBox", "0 0 16 16");
        newmarkcont.style.left = formatCssPx(game.marks[i].x * gridsize);
        newmarkcont.style.top = formatCssPx(game.marks[i].y * gridsize);
        newmarkcont.className = "game-elem pn-mark";
        newmarkcont.appendChild(newmark);
        marksHtmlelem.appendChild(newmarkcont);
    }

    upMarkLanelines.style.left = formatCssPx(game.marks[2].x * gridsize);
    upMarkLanelines.style.top = formatCssPx(game.marks[2].y * gridsize);
    upMarkLanelines.style.rotate = formatCssDeg(game.getwind(turncount + 1));

    var startlinecontainer = document.getElementById("start-line");
    startlinecontainer.innerHTML = "";
    for (var i = game.marks[0].x; i < game.marks[1].x; i++) {
        var newelem = document.createElement("img");
        newelem.src = "img/startline.svg";
        newelem.className = "pn-start-line";
        newelem.style.left = formatCssPx(i * gridsize);
        newelem.style.top = formatCssPx(game.marks[0].y * gridsize);
        startlinecontainer.appendChild(newelem);
    }
}
var w;
function renderGridSize() {
    var gamecont = document.getElementById("game-cont");
    var gamearea = document.getElementById("game-area");
    document.getElementById("track").setAttribute("viewBox", `0 0 ${game.width} ${game.height}`)
    document.getElementById("background").setAttribute("viewBox", `0 0 ${game.width} ${game.height}`)

    w = gamecont.clientWidth;
    var h = gamecont.clientHeight;
    if (h / game.height < w / game.width) {
        gamearea.style.scale = h / (game.height * gridsize);
        gamearea.style.top = formatCssPx(0);
    } else {
        gamearea.style.scale = w / (game.width * gridsize);
        gamearea.style.top = formatCssPx((h - game.height * gamearea.style.scale * gridsize) / 2);
    }
    gamearea.style.height = formatCssPx(game.height * gridsize);
    gamearea.style.width = formatCssPx(game.width * gridsize);
}

function windChange() {
    windscenario = windscenariocontrol.selectedIndex;
    if (game.windscenario.israndom) {
        game.setWindFromRandom();
    } else {
        game.setWindFromScenario();
    }

    localStorage.setItem(localStorageNames.selectedWind, windscenario);

    for (var i = 0; i < game.players.length; i++) {
        game.players[i].y = game.height - 2;
    }
    windDataInit();
    drawAll()
}

function addWind() {
    windscenariocontrol.innerHTML = "";
    var oldtype;
    var optgroup;
    for (var i = 0; i < wind.length; i++) {
        if (oldtype != wind[i].type) {
            optgroup = document.createElement("optgroup");
            optgroup.label = wind[i].type;
            windscenariocontrol.appendChild(optgroup);
            oldtype = wind[i].type;
        }
        var newoption = document.createElement("option");
        newoption.innerText = wind[i].name;
        optgroup.appendChild(newoption);
    }


}
function addPlayer() {
    var gamearea = document.getElementById("boats");

    var newColor = game.findFreeColor();
    if (newColor == null) {
        alert("too many boats")
        return;
    }

    var newPlayer = new Boat(6, starty, false, newColor);

    game.players.push(newPlayer);

    var newboatcont = document.createElement("div");
    newboatcont.className = "game-elem pn-boat";
    newboatcont.style.color = newPlayer.color;

    newPlayer.html = newboatcont;
    gamearea.appendChild(newboatcont);

    applySettings();
    addControll(newPlayer);
    newPlayer.tackBtn.checked = true;

    newPlayer.startPositionChange();
    game.placeBoatsOnStart();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
        new bootstrap.Tooltip(tooltipTriggerEl))
    new bootstrap.Tooltip(document.getElementById("edit-btn"))
    new bootstrap.Tooltip(document.getElementById("add-wind-btn"))
}

addEventListener("load", init);

function init() {
    windscenario = readIntSetting(localStorageNames.selectedWind, 0);
    winddata = document.getElementById("wind-data");
    windDataScroller = document.getElementById("wind-data.scroller");
    windscenariocontrol = document.getElementById("select-wind");
    var gamearea = document.getElementById("game-area");
    upMarkLanelines = document.createElement("img");
    upMarkLanelines.src = "img/marklaneline.svg";
    upMarkLanelines.className = "pn-lines game-elem";
    gamearea.insertBefore(upMarkLanelines, document.getElementById("wind"));
    document.getElementById("btn-nowember").addEventListener("click", function () {
        for (var i = 0; i < game.players.length; i++) {
            var player = game.players[i];
            player.tack = false;
            player.rotation = -45;
            player.turns = [];
            player.isStart = true;
            player.finished = false;
            player.startInputs[1].checked = true;
            player.startPos = 1;
            player.startPriority = game.currentStartPriority++;
            player.saveTurn(turnTupes.forward, [{ x: player.x, y: player.y }]);
            player.track.setAttribute("points", "");
        }
        windChange();
        document.body.className = "start";
        turncount = 0;
        game.placeBoatsOnStart();
        drawAll();
    });
    windInit();
    windInit();
    settingsInit();
    createGame(2);
    addWind();
    windscenariocontrol.selectedIndex = windscenario;
    createContolls();
    drawAll();
    console.log("load");
    document.getElementById("show-future-wind").addEventListener("click", windDataInit);
    document.getElementById("edit-btn").addEventListener("click", function () {
        windEditorStart(false);
    });

    document.getElementById("add-wind-btn").addEventListener("click", function () {
        windEditorStart(true);
    });

    addEventListener("resize", function () {
        renderGridSize();
        drawAll()
    });

    var track = document.getElementById("track");
    track.setAttribute("viewBox", "0 0 " + game.width + " " + game.height);

    applySettings();
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function distance(x1, y1, x2, y2) {
    dx = Math.abs(x1 - x2);
    dy = Math.abs(y1 - y2);
    return Math.sqrt((dx * dx) + (dy * dy));
}
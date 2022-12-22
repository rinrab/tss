var gridsize = 20;

const colors = ["red", "blue", "black", "green", "cyan", "magenta", "purple", "gray", "yellow",
    "darkred", "darkblue", "goldenrod"]
var boatSize = 32;

var windscenario;
var windscenariocontrol;
var windtype = 0;

const startLineSize = 15;

var boatsvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -10 14 20" class="boat-full-svg">
        <path d="M -4 7.5 L 4 7.5 C 5 1.5 5 -2.5 2.5 -9 L -2.5 -9 C -5 -2.5 -5 1.5 -4 7.5 Z" stroke="gray" stroke-width=".5" fill="currentColor" />
        <path d="M 0 -6 C 2 -4 3 -1 2 6" stroke="white" fill="none" stroke-width="1" />
        <ellipse rx="0.7" ry="0.7" cx="0" cy="-6" />
    </svg>
    `;
var boathidesvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -10 14 20" class="boat-hidden-svg">
        <g>
            <ellipse rx="2" ry="2" cx="0" cy="0" stroke-width="3" fill="currentColor"
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

function formatSvgViewBox(left, top, width, height) {
    return (
        left.toFixed(3) + " " +
        top.toFixed(3) + " " +
        width.toFixed(3) + " " +
        height.toFixed(3));
}

function turn() {
    game.turncount++;

    for (var i = 0; i < game.players.length; i++) {
        game.players[i].turn();
    }

    setTimeout(() => {
        redrawTracks();
    }, 200);

    drawAll();
    updateSaveGame();
}

function redrawTracks() {
    for (var i = 0; i < game.players.length; i++) {
        redrawTrack(game.players[i]);
    }
}

function redrawTrack(player) {
    var points = "";

    for (var i = 0; i < game.turncount + 1; i++) {
        for (var j = 0; j < player.turns[i].points.length; j++) {
            var pt = player.turns[i].points[j];

            points += " " + pt.x.toFixed(3) + "," + pt.y.toFixed(3);
        }
    }
    player.track.setAttribute("points", points);
}

function backTurn() {
    if (game.turncount > 0) {
        game.turncount--;

        for (var i = 0; i < game.players.length; i++) {
            game.players[i].back();
        }
        setTimeout(redrawTracks, 200);
        drawAll();
    } else {
        document.body.className = "start";
        game.isStart = true;
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
    linesSvg.setAttribute("viewBox", formatSvgViewBox(0, 0, game.width, game.height));
    document.getElementById("lines-container").style.rotate = formatCssDeg(game.getwind(game.turncount + 1));

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
    var windDerection = game.getwind(game.turncount + 1);
    var e = document.getElementById("wind");
    e.style.rotate = formatCssDeg(windDerection * 2);
    if (windDerection > 0) {
        windDerection = "+" + windDerection;
    }
    document.getElementById("wind-label").innerText = `${windDerection}º`
}

function getSvgPathCommand(commandName, x1, y1) {
    return `${commandName}${x1.toString()} ${y1.toString()} `;
}

function getSvgLine(x1, y1, x2, y2) {
    return (
        getSvgPathCommand("M", x1, y1) +
        getSvgPathCommand("L", x2, y2))
}

function windDataInit() {
    var windDataContainer = document.getElementById("wind-data-container");

    var showfuturewind = document.getElementById("show-future-wind").checked;

    if (showfuturewind) {
        windDataContainer.hidden = false;
    } else {
        windDataContainer.hidden = true;
    }
    renderGridSize();

    // TODO: add typical overage race lenght to wind scenario
    var size = Math.round((game.height - 4) / Math.sin(Math.PI / 4));
    if (size < game.turncount + 10) {
        size = game.turncount + 10;
    }
    var drawedWind = [];
    for (var i = 0; i < size; i++) {
        drawedWind.push(game.getwind(i));
    }
    windDataContainer.innerHTML = "";
    windDataContainer.appendChild(getWindSvg(drawedWind, game.turncount));
}

function getWindSvg(wind, turncount, width = 200, height = 500, uiScale = 1) {
    // width -= 30;
    const moveLeft = 20;
    const scaleX = (width - moveLeft - 10 * uiScale) / 40;
    const lineWidth = scaleX * 20;
    var fontSize = 10 * uiScale;

    var size = wind.length;
    var step = (height - fontSize * 2) / (size - 1.6);

    var windDataSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    windDataSvg.setAttribute("viewBox", formatSvgViewBox(0, 0, width, height));

    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    windDataSvg.appendChild(group);

    var pathWind = document.createElementNS("http://www.w3.org/2000/svg", "path");
    var pathGrid = document.createElementNS("http://www.w3.org/2000/svg", "path");

    var y = fontSize * 2;

    var dStrWind = getSvgPathCommand("M", 20 * scaleX + moveLeft, fontSize * 1.5);
    var dStrWind = getSvgPathCommand("M", 20 * scaleX + moveLeft, y);
    var dStrGrid = "";
    dStrGrid += getSvgPathCommand("M", moveLeft, y);
    dStrGrid += getSvgPathCommand("L", 2 * lineWidth + moveLeft, y);
    for (var i = wind.length - 1; i > 1; i--) {
        if (i != wind.length - 1) {
            dStrWind += getSvgPathCommand("L", (wind[i] + 20) * scaleX + moveLeft, y);
        }
        dStrWind += getSvgPathCommand("L", (wind[i - 1] + 20) * scaleX + moveLeft, y);

        dStrGrid += getSvgPathCommand("M", moveLeft, y + step);
        dStrGrid += getSvgPathCommand("L", 2 * lineWidth + moveLeft, y + step);
        if (i % 5 == 2) {
            dStrGrid += getSvgPathCommand("L", lineWidth * 2 + moveLeft, y);
            dStrGrid += getSvgPathCommand("L", moveLeft, y);
        }
        if (game.turncount % wind.length + 2 == i) {

        }

        y += step;
    }

    pathGrid.setAttribute("d", dStrGrid);
    pathGrid.setAttribute("stroke-width", "0.3");
    pathGrid.setAttribute("vector-effect", "non-scaling-stroke");
    pathGrid.setAttribute("stroke", "gray");
    pathGrid.setAttribute("fill-opacity", "0.2");
    pathGrid.setAttribute("fill", "gray");
    group.appendChild(pathGrid);

    for (var i = 0; i < 9; i++) {
        if (i % 2 == 0) {
            var newText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            var x = i * 5;

            newText.setAttribute("x", x * scaleX + moveLeft);
            newText.setAttribute("y", fontSize);
            newText.setAttribute("text-anchor", "middle");
            newText.setAttribute("dominant-baseline", "auto");
            newText.style.fontSize = fontSize + "px";

            var label = (i - 4) * 5;
            if (i - 4 > 0) {
                label = "+" + label;
            }
            newText.appendChild(document.createTextNode(label));
            group.appendChild(newText);
        }
        var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        newLine.setAttribute("x1", i * 5 * scaleX + moveLeft);
        newLine.setAttribute("y1", fontSize * 1.5)
        newLine.setAttribute("x2", i * 5 * scaleX + moveLeft);
        newLine.setAttribute("y2", y + fontSize + 10);

        if (i == 4) {
            newLine.setAttribute("stroke", "red");
            newLine.setAttribute("stroke-width", 2);
        } else if (i % 2 == 0) {
            newLine.setAttribute("stroke", "black");
            newLine.setAttribute("stroke-width", 0.5);
        } else {
            newLine.setAttribute("stroke", "gray");
            newLine.setAttribute("stroke-width", 0.25);
        }
        group.appendChild(newLine);
    }

    dStrWind += getSvgPathCommand("L", (wind[1] + 20) * scaleX + moveLeft, y)
    dStrWind += getSvgPathCommand("L", 20 * scaleX + moveLeft, y)
    pathWind.setAttribute("d", dStrWind);
    pathWind.setAttribute("stroke", "black");
    pathWind.setAttribute("stroke-width", "2");
    pathWind.setAttribute("vector-effect", "non-scaling-stroke");
    pathWind.setAttribute("fill", "#c6c5ff");
    pathWind.setAttribute("fill-opacity", "0.8");
    group.appendChild(pathWind);

    var newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    newRect.setAttribute("x", moveLeft - 5)
    newRect.setAttribute("y", ((wind.length * step) + (fontSize * 2)) - (game.turncount + 3) * step);
    newRect.setAttribute("height", step);
    newRect.setAttribute("width", width - moveLeft - 10 + 10);
    newRect.setAttribute("fill", "#fd7e14");
    newRect.setAttribute("fill-opacity", "0.45");
    newRect.setAttribute("ry", "3");
    newRect.setAttribute("rx", "3");
    newRect.setAttribute("stroke", "#495057");
    newRect.setAttribute("stroke-width", "0.3");
    group.appendChild(newRect);

    return windDataSvg;
}

function drawBoat(player) {
    player.html.style.left = formatCssPx(player.x * gridsize);
    player.html.style.top = formatCssPx(player.y * gridsize);
    player.html.style.rotate = formatCssDeg(player.rotation);
    var sx = 1;
    if (player.tack) {
        sx = 1;
    } else {
        sx = -1;
    }
    player.html.style.transform = `scaleX(${sx})`;
}

function drawMarks() {
    var marksHtmlelem = document.getElementById("marks");
    marksHtmlelem.innerHTML = "";
    for (var i = 0; i < game.marks.length; i++) {
        var newmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        var newmarkcont = document.createElement("div");
        newmark.innerHTML = marksvg;
        newmark.setAttribute("viewBox", formatSvgViewBox(0, 0, 16, 16));
        newmarkcont.style.left = formatCssPx(game.marks[i].x * gridsize);
        newmarkcont.style.top = formatCssPx(game.marks[i].y * gridsize);
        newmarkcont.className = "game-elem pn-mark";
        newmarkcont.appendChild(newmark);
        marksHtmlelem.appendChild(newmarkcont);
    }

    upMarkLanelines.style.left = formatCssPx(game.marks[2].x * gridsize);
    upMarkLanelines.style.top = formatCssPx(game.marks[2].y * gridsize);
    upMarkLanelines.style.rotate = formatCssDeg(game.getwind(game.turncount + 1));

    var startlinecontainer = document.getElementById("start-line-svg");
    startlinecontainer.setAttribute("viewBox", formatSvgViewBox(0, 0, game.width * gridsize, game.height * gridsize));

    var startline = document.getElementById("start-line");
    startline.setAttribute("x1", game.marks[0].x * gridsize);
    startline.setAttribute("y1", game.marks[0].y * gridsize);
    startline.setAttribute("x2", game.marks[1].x * gridsize);
    startline.setAttribute("y2", game.marks[1].y * gridsize);
}

function renderGridSize() {
    var gamecont = document.getElementById("game-cont");
    var gamearea = document.getElementById("game-area");
    document.getElementById("track").setAttribute("viewBox", formatSvgViewBox(0, 0, game.width, game.height));
    document.getElementById("background").setAttribute("viewBox", formatSvgViewBox(0, 0, game.width, game.height));

    var w = gamecont.clientWidth;
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
    game.placeBoatsOnStart()
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
        var tooManyBoatsAlert = new bootstrap.Toast(document.getElementById("too-many-boats-alert"));
        tooManyBoatsAlert.show()
        return;
    }

    var newPlayer = new Boat(6, starty, false, newColor);

    game.players.push(newPlayer);

    var newboatcont = getNewBoat(newPlayer);
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

function getNewBoat(player) {
    var newboatcont = document.createElement("div");
    newboatcont.className = "game-elem pn-boat";
    newboatcont.style.color = player.color;

    return newboatcont;
}

addEventListener("load", init);

function init() {
    windscenario = readIntSetting(localStorageNames.selectedWind, 0);
    windscenariocontrol = document.getElementById("select-wind");
    var gamearea = document.getElementById("game-area");
    upMarkLanelines = document.createElement("img");
    upMarkLanelines.src = "img/marklaneline.svg";
    upMarkLanelines.className = "pn-lines game-elem";
    gamearea.insertBefore(upMarkLanelines, document.getElementById("marks"));
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
        game.isStart = true;
        game.turncount = 0;
        game.placeBoatsOnStart();
        drawAll();
    });
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
    track.setAttribute("viewBox", formatSvgViewBox(0, 0, game.width, game.height));

    var helpModal = new bootstrap.Modal(document.getElementById('help-modal'));

    const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    addEventListener("keydown", function (e) {
        if (e.code == "Backspace") {
            if (!game.isStart) {
                e.preventDefault();
                backTurn();
            }
        } else if (e.code == "Space") {
            if (!game.isStart) {
                e.preventDefault();
                turn();
            }
        } else if (e.code == "Slash") {
            e.preventDefault();
            helpModal.hide();
            helpModal.show();
        } else {
            if (!game.isStart) {
                var index = keys.findIndex(function (a) { return a == e.key });
                var player = game.players[index];

                if (player != undefined) {
                    e.preventDefault();
                    if (player.tackBtn.checked) {
                        player.forwardBtn.checked = true;
                    } else {
                        player.tackBtn.checked = true;
                    }
                }
            }
        }
    });

    var fullscreenToggle = document.getElementById("full-screen");
    fullscreenToggle.addEventListener("click", function () {
        if (fullscreenToggle.checked) {
            openFullscreen(document.documentElement);
        } else {
            closeFullscreen(document.documentElement);
        }
    });

    fullscreenToggle.disabled = !isFullscreenSupported();
    fullscreenToggle.checked = isFullscreenMode();

    document.addEventListener("fullscreenchange", function () {
        fullscreenToggle.checked = isFullscreenMode();
    });

    windDataInit();

    applySettings();

    var fileInput = document.getElementById("load-race-file");
    fileInput.addEventListener("change", function () {
        var fileReader = new FileReader()
        fileReader.readAsText(fileInput.files[0])
        fileReader.result;
        fileReader.addEventListener("load", () => {
            var parsedData = JSON.parse(fileReader.result);
            console.log(parsedData);
            var newGame = new Game();

            newGame.marks = parsedData.marks;
            newGame.width = parsedData.width;
            newGame.height = parsedData.height;
            newGame.wind = parsedData.wind;
            newGame.turncount = parsedData.turncount;

            newGame.players = [];

            document.getElementById("controlls").innerHTML = "";
            document.getElementById("boats").innerHTML = "";

            for (var i in parsedData.players) {
                var parsedPlayer = parsedData.players[i];
                var player = new Boat();
                player.x = parsedPlayer.x;
                player.y = parsedPlayer.y;
                player.rotation = parsedPlayer.rotation;
                player.tack = parsedPlayer.tack;
                player.color = parsedPlayer.color;
                player.turns = [];
                for (var j in parsedPlayer.turns) {
                    player.turns.push(structuredClone(parsedPlayer.turns[j]));
                }
                player.finished = parsedPlayer.finished;
                player.html = getNewBoat(player);
                document.getElementById("boats").appendChild(player.html);
                newGame.players[i] = player;
                addControll(player);
                player.name = parsedPlayer.name;
                player.nameText.value = player.name;
                player.nameTextFinish.value = player.name;
            }
            console.log(newGame);
            game = newGame;
            document.body.className = "race";
            renderGridSize();
            redrawTracks();
            drawAll();
            applySettings();
            updateControls();
        }, false);
    })
}

function updateSaveGame() {
    if (game.isStart) {
        document.getElementById("save-game-btn").classList.add("disabled");
    } else {
        var file = new Blob([JSON.stringify(game)], { type: "application/json" });
        setSaveGameBlob(file, `${game.windscenario.name}.json`);
        document.getElementById("save-game-btn").classList.remove("disabled");
    }
}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
}

function closeFullscreen(elem) {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function isFullscreenMode() {
    return (document.fullscreenElement != null) ||
        (document.webkitFullscreenElement != null);
}

function isFullscreenSupported() {
    return (document.fullscreenEnabled || document.webkitFullscreenEnabled);
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function distance(x1, y1, x2, y2) {
    dx = Math.abs(x1 - x2);
    dy = Math.abs(y1 - y2);
    return Math.sqrt((dx * dx) + (dy * dy));
}
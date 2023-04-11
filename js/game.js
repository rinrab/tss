var gridsize = 20;

const colors = ["red", "blue", "black", "green", "cyan", "magenta", "purple", "gray", "yellow",
    "darkred", "darkblue", "goldenrod"]
var boatSize = 32;

var windscenario;
var windscenariocontrol;
var windtype = 0;

function confirmation(state) {
    localStorage.setItem(localStorageNames.confirmation, state);
}

const startLineSize = 15;

const boatsvg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -10 14 20" class="boat-full-svg">
      <path d="M -4 7.5 L 4 7.5 C 5 1.5 5 -2.5 2.5 -9 L -2.5 -9 C -5 -2.5 -5 1.5 -4 7.5 Z" stroke="gray" stroke-width=".5" fill="currentColor" />
      <path d="M 0 -6 C 2 -4 3 -1 2 6" stroke="white" fill="none" stroke-width="1" />
      <ellipse rx="0.7" ry="0.7" cx="0" cy="-6" />
    </svg>`;
const boathidesvg = 
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-7 -10 14 20" class="boat-hidden-svg">
      <ellipse rx="2" ry="2" cx="0" cy="0" stroke-width="3" fill="currentColor" stroke="currentColor"></ellipse>
    </svg>`;
const marksvg =
    `<ellipse cx="8" cy="8" rx="7" ry="7" fill="none" stroke="#000" stroke-width="0.25"/>
    <ellipse cx="8" cy="8" rx="2" ry="2" fill="#6d2121"/>`;
const upMarkSvg =
    `<ellipse cx="8" cy="8" rx="7" ry="7" fill="none" stroke="#000" stroke-width="0.25" stroke-dasharray="0.5" />
    <ellipse cx="8" cy="8" rx="1.5" ry="1.5" fill="#6d2121" />`;

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
}

function redrawTracks() {
    for (var i = 0; i < game.players.length; i++) {
        redrawTrack(game.players[i]);
    }
}

function redrawTrack(player) {
    var points = "";

    for (var i = 0; i < player.turns.length && i < game.turncount + 1; i++) {
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
    newRect.setAttribute("y", ((wind.length * step) + (fontSize * 2)) - (turncount + 3) * step);
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
        if (i == 2) {
            newmark.innerHTML = upMarkSvg;
        } else {
            newmark.innerHTML = marksvg;
        }
        newmark.setAttribute("viewBox", formatSvgViewBox(0, 0, 16, 16));
        newmarkcont.style.left = formatCssPx(game.marks[i].x * gridsize);
        newmarkcont.style.top = formatCssPx(game.marks[i].y * gridsize);
        newmarkcont.className = "game-elem pn-mark";
        if (i == 2) {
            newmarkcont.classList.add("pn-up-mark");
        }
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

    var scale;
    var left = 0;

    if (h / game.height < w / game.width) {
        scale = h / (game.height * gridsize);
        gamearea.style.top = formatCssPx(0);
    } else {
        scale = w / (game.width * gridsize);
        gamearea.style.top = formatCssPx((h - game.height * gamearea.style.scale * gridsize) / 2);
    }

    if (zoomType == zoomTypes.upMark) {
        scale *= 3;

        left = -game.width * scale * gridsize / 2 + gamecont.clientWidth / 2;

        gamearea.style.top = formatCssPx(0);

        gamearea.style.setProperty("--boat-scale", 0.7);
    } else {
        gamearea.style.setProperty("--boat-scale", 1.2);
    }

    gamearea.style.left = formatCssPx(left);
    gamearea.style.scale = scale;
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
    addControl(newPlayer);
    newPlayer.tackBtn.checked = true;

    newPlayer.startPositionChange();
    game.placeBoatsOnStart();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
        new bootstrap.Tooltip(tooltipTriggerEl))
}

function getNewBoat(player) {
    var newboatcont = document.createElement("div");
    newboatcont.className = "game-elem pn-boat";
    newboatcont.style.color = player.color;

    return newboatcont;
}

addEventListener("load", init);

const zoomTypes = {
    race: 0,
    upMark: 1,
}

let zoomType = zoomTypes.race;

function reset(addToCup) {
    game.turncount = 0;
    if (addToCup) {
        addRaceToCup();
    }
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
    game.placeBoatsOnStart();
    drawAll();
}

function init() {
    windscenario = readIntSetting(localStorageNames.selectedWind, 0);
    windscenariocontrol = document.getElementById("select-wind");
    var gamearea = document.getElementById("game-area");

    upMarkLanelines = document.getElementById("upmarklines");

    document.getElementById("btn-reset").addEventListener("click", function () {
        reset(false);
    });
    document.getElementById("btn-reset-and-addtocup").addEventListener("click", function () {
        reset(true);
        updateRaceCount();
        saveAllCups();
    });

    windInit();
    settingsInit();
    createGame(2);
    addWind();
    windscenariocontrol.selectedIndex = windscenario;
    createContolls();
    drawAll();
    console.log("load");
    document.getElementById("show-future-wind").addEventListener("click", function () {
        renderGridSize();
        drawAll();
        windDataInit();
    });

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

    addEventListener("orientationchange", function () {
        renderGridSize();
        drawAll();
    })

    const zoomCheck = document.getElementById("zoom-check");
    zoomCheck.checked = false;
    zoomCheck.addEventListener("change", function () {
        zoomType = (zoomCheck.checked) ? zoomTypes.upMark : zoomTypes.race;
        renderGridSize();
        drawAll();
    });

    const manangeWindsModal = document.getElementById("manange-winds-modal");
    manangeWindsModal.addEventListener("show.bs.modal", wmUpdate);

    cupInit();

    var track = document.getElementById("track");
    track.setAttribute("viewBox", formatSvgViewBox(0, 0, game.width, game.height));

    var helpModal = new bootstrap.Modal(document.getElementById('help-modal'));

    const keysDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    addEventListener("keydown", function (e) {
        if (e.target.tagName == "INPUT" && e.target.type != "radio") {
            return;
        }
        if (e.code == "KeyA") {
            if (game.isStart) {
                addPlayer();
                drawAll();
            }
            e.preventDefault();
        }
        if (!game.isStart) {
            if (e.code == "Digit1" && e.ctrlKey) {
                for (let p of game.players) {
                    if (!p.finished) {
                        p.forwardBtn.checked = true;
                    }
                }
                e.preventDefault();
            }
            if (e.code == "Digit2" && e.ctrlKey) {
                for (let p of game.players) {
                    if (!p.finished) {
                        p.tackBtn.checked = true;
                    }
                }
                e.preventDefault();
            }
            if (e.code == "Digit3" && e.ctrlKey) {2
                for (let p of game.players) {
                    if (!p.finished) {
                        p.toMarkBtn.checked = true;
                    }
                }
                e.preventDefault();
            }
        }
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
            if (!game.isStart && !e.ctrlKey) {
                var index = keysDigits.findIndex(function (a) { return a == e.key });
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

    addEventListener("beforeunload", function (e) {
        if (localStorage.getItem(localStorageNames.confirmation) != "false") {
            e.preventDefault();
        }
    })

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
        fileReader.addEventListener("load", () => {
            loadGameFromFile(fileReader.result);
        });
        if (Math.random() < 0.1) {
            const modal = new bootstrap.Modal("#install-tsspreview-modal");
            modal.show();
        }
    });

    document.getElementById("install-tsspreview-btn").addEventListener("click", function () {
        const modal = document.getElementById("install-tsspreview-modal");
        modal.remove();
        document.querySelector(".modal-backdrop").remove();
    });

    document.getElementById("save-game-btn").addEventListener("click", function () {
        var file = new Blob([game.save()], { type: "data:text/json" });
        var name = `${game.windscenario.name}.tss`;
        var url = URL.createObjectURL(file);
        console.log(file)
        try {
            var linkElem = document.createElement("a");
            linkElem.href = url;
            linkElem.download = name;
            linkElem.click();
        }
        finally {
            URL.revokeObjectURL(url);
        }
    });

    for (var e of document.querySelectorAll(".tsspreview")) {
        e.href = "https://github.com/rinrab/TssPreview/releases/download/v0.1.1/TssPreview.exe";
    };
}

function wmUpdate() {
    const wmlist = document.getElementById("wm-list");
    wmlist.innerHTML = "";
    winds = {};
    idx = {};
    let i = 0;
    for (const w of wind) {
        if (!winds[w.type]) {
            winds[w.type] = [];
            idx[w.type] = {};
        }
        winds[w.type].push(w);
        idx[w.type][w.name] = i;
        i++;
    }

    const addFolder = (type) => {
        const nf = document.createElement("div");
        nf.className = "list-group mb-2";
        wmlist.appendChild(nf);

        const ne = document.createElement("li");
        ne.className = "list-group-item text-center fw-bold";
        ne.innerText = type;
        nf.appendChild(ne);

        for (const w of winds[type]) {
            const ne = document.createElement("li");
            ne.className = "list-group-item list-group-item-action pl-3";
            nf.appendChild(ne);

            const rightContainer = document.createElement("div");
            rightContainer.className = "position-absolute end-0 px-2";
            let btns = "";
            let editBtnId = getRandomId();
            let rmBtnId = getRandomId();
            if (w.type != "Presets") {
                btns = `
                    <button class="btn btn-primary btn-sm wm-btn" id="${editBtnId}" data-bs-dismiss="modal">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                           fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <use href="#edit-icon"></use>
                      </svg>
                    </button>
                    <button class="btn btn-danger btn-sm wm-btn" id="${rmBtnId}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                        <use href="#delete-svg"></use>
                      </svg>
                    </button>`
            }
            rightContainer.innerHTML = `
                <div class="btn-group">
                  ${btns}
                </div>
                <span class="text-body-secondary text-end" style="width: 4rem;display: inline-block;">${w.width} x ${w.height}<span>`;
            ne.appendChild(rightContainer);

            const ns = document.createElement("span");
            ns.innerText = w.name;
            ne.appendChild(ns);

            if (w.type != "Presets") {
                document.getElementById(editBtnId).addEventListener("click", () => {
                    windscenariocontrol.selectedIndex = idx[type][w.name];
                    windChange();
                    document.getElementById("edit-btn").click();
                });

                document.getElementById(rmBtnId).addEventListener("click", () => {
                    const windscenario = idx[type][w.name];
                    wind.splice(windscenario, 1);
                    const scenario = windscenario - 1;
                    saveWind();
                    windChange();
                    addWind();
                    windscenariocontrol.selectedIndex = scenario;
                    wmUpdate();
                });
            }
        }
    }

    for (const wind in winds) {
        addFolder(wind);
    }
}

function tryGetVal(val) {
    if (val) {
        return val;
    } else {
        throw "Invalid value";
    }
}

function loadGameFromFile(result) {
    try {
        newGame = Game.load(result);
    } catch (ex) {
        alert(ex);
        return;
    }

    if (newGame) {
        console.log(newGame);
        game = newGame;

        document.getElementById("wind-scenario-name-inrace-alert").innerText = game.name;

        document.getElementById("controlls").innerHTML = "";
        document.getElementById("boats").innerHTML = "";
        document.getElementById("track").innerHTML = "";
        for (var i in game.players) {
            var player = game.players[i];

            player.html = getNewBoat(player);
            addControl(player);
            player.setTurn(player.turntype)
            if (game.isStart) {
                player.startInputs[player.startPos].checked = true;
            }
            document.getElementById("boats").appendChild(player.html);
        }
        if (game.isStart) {
            document.body.className = "start";
        } else {
            document.body.className = "race";
        }
        renderGridSize();
        redrawTracks();
        drawAll();
        applySettings();
        updateControls();
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

function updateRaceCount() {
    var raceCount = document.getElementById("cup-race-count");

    if (cup.races.length == 0) {
        raceCount.hidden = true;
    } else {
        raceCount.innerText = cup.races.length;
        raceCount.hidden = false;
    }
}

function getPrototypeCup() {
    return {
        races: [],
        name: "name",
        excludingCount: 0
    };
}

function cupInit() {
    try {
        cup = loadCup(localStorage.getItem("cup"));
    } catch (ex) { }

    const cupModal = document.getElementById("cup-modal");
    const resetBtn = document.getElementById("cup-reset-btn");

    const printBtn = document.getElementById("cup-print");
    printBtn.addEventListener("click", function () {
        window.print();
    })

    cupModal.addEventListener("show.bs.modal", function () {
        updateCup();
    });

    resetBtn.addEventListener("click", function () {
        cup = getPrototypeCup();
        updateCup();
        saveAllCups();
    });

    const excludingSelect = document.getElementById("cup-excluding");
    excludingSelect.selectedIndex = cup.excludingCount;
    excludingSelect.addEventListener("change", function () {
        cup.excludingCount = excludingSelect.selectedIndex;
        updateCup();
        saveAllCups();
    });

    const exportBtn = document.getElementById("cup-export");
    exportBtn.addEventListener("click", function () {
        var name = "cup";
        var file = new Blob([saveCup(cup, name)], { type: "data:text/json" });
        var name = `${name}.tsscup`;
        var url = URL.createObjectURL(file);
        console.log(file)
        try {
            var linkElem = document.createElement("a");
            linkElem.href = url;
            linkElem.download = name;
            linkElem.click();
        }
        finally {
            URL.revokeObjectURL(url);
        }
    });

    const importInput = document.getElementById("cup-import");
    importInput.addEventListener("change", function () {
        if (importInput.files.length > 0) {
            var fileReader = new FileReader();
            fileReader.readAsText(importInput.files[0]);
            fileReader.addEventListener("load", () => {
                cup = loadCup(fileReader.result);
                updateCup();
                saveAllCups();
            });
        }
    })

    const addPlayersToRaceBtn = document.getElementById("add-players-to-race-btn");
    addPlayersToRaceBtn.addEventListener("click", function () {
        if (game.isStart) {
            game.players = [];
            document.getElementById("controlls").innerHTML = "";
            document.getElementById("boats").innerHTML = "";
            const players = getPlayers(cup);
            for (let i = 0; i < players.length; i++) {
                addPlayer();
                game.players[i].nameInput.value = players[i];
            }

            drawAll();
        }
    });

    updateRaceCount();
}

function showAddPlayerAlert() {
    const toast = document.getElementById("add-player-alert");
    const toastBody = toast.querySelector(".toast-body");
    toastBody.innerHTML = "";
    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        const newRow = document.createElement("div");
        name = player.nameInput.value;
        if (name == "") {
            name = "Player " + (i + 1);
        }
        newRow.innerText = name;
        toastBody.appendChild(newRow);
    }
    new bootstrap.Toast(toast).show();
}

const cupActionFunctions = {
    delete: function (index) {
        cup.races.splice(index, 1);
        updateCup();
        saveAllCups();
    },
    rename: function (oldName, newName) {
        for (let race of cup.races) {
            if (race[oldName]) {
                race[newName] = race[oldName];
                delete race[oldName];
            }
        }
        saveAllCups();
        updateCup();
    },
    goRace: function (name) {
        if (game.isStart) {
            addPlayer();
            game.players[game.players.length - 1].nameInput.value = name;
            drawAll();
            showAddPlayerAlert();
        }
    }
}

function updateCup() {
    const cupContainer = document.getElementById("cup-container");

    cupContainer.innerHTML = "";
    cupContainer.appendChild(getCupHtml(sortCup(cup), cupActionFunctions));

    const printExcludingCount = document.getElementById("print-excluding");
    const excludingSelect = document.getElementById("cup-excluding");
    printExcludingCount.innerText = excludingSelect.value;

    updateRaceCount();
}

function getPlayers(cup) {
    let rv = [];

    for (let race of cup.races) {
        for (let key of Object.keys(race)) {
            if (!rv.includes(key)) {
                rv.push(key)
            }
        }
    }

    for (let i = 0; i < game.players.length; i++) {
        if (!rv.includes(game.getPlayerName(i))) {
            rv.push(game.getPlayerName(i))
        };
    }

    return rv;
}

let cup = getPrototypeCup();

function loadCup(str) {
    let parsedData;

    try {
        parsedData = JSON.parse(str);
    } catch (ex) {
        throw "Parse error";
    }
    if (!parsedData) {
        throw "Parse error";
    }

    let races = [];

    for (let race of parsedData.races) {
        let newRace = {};

        for (let key of Object.keys(race)) {
            if (race[key]) {
                newRace[key] = race[key];
            } else {
                throw "Parse error";
            }
        }

        races.push(newRace);
    }
    let newName;
    let newExcludingCount; 

    if (parsedData.name) {
        newName = parsedData.name;
    } else {
        throw "Parse error";
    }
    if (parsedData.excount == undefined) {
        throw "Parse error";
    } else {
        newExcludingCount = parsedData.excount;
    }

    return {
        races: races,
        name: newName,
        excludingCount: newExcludingCount
    };
}

function saveCup(cup, name) {
    let races = [];

    for (let race of cup.races) {
        let newRace = {};

        for (let key of Object.keys(race)) {
            newRace[key] = race[key];
        }

        races.push(newRace);
    }

    return JSON.stringify({
        races: races,
        name: name,
        excount: cup.excludingCount
    })
}

function saveAllCups() {
    localStorage.setItem("cup", saveCup(cup, "cup"));
}

const dsqTime = 10000000; // 10 milions

function addRaceToCup() {
    let newRaceArr = [];
    let newRace = {};

    for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        let newPlayer = { index: i };

        if (player.finished == false) {
            // TODO: DNC
            newPlayer.time = dsqTime;
        } else {
            newPlayer.time = player.finished;
        }

        let name = player.name;

        while (newRaceArr.includes(name)) {
            name += "A";
        }

        newPlayer.name = name;

        newRaceArr.push(newPlayer);
    }

    newRaceArr.sort(function (a, b) {
        return a.time - b.time;
    });

    console.log(newRaceArr);
    for (let i = 0; i < newRaceArr.length; i++) {
        const p = newRaceArr[i];

        if (p.time == dsqTime) {
            newRace[p.name] = -1;
        } else {
            newRace[p.name] = i + 1;
        }
    }

    cup.races.push(newRace);
}

function sortCup(cup) {
    let players = getPlayers(cup);

    let races = [];
    let sum = {};

    for (let race of cup.races) {
        let newRace = [];

        for (let key of players) {
            if (race[key] == -1) {
                newRace[key] = `DNF`;
            } else if (race[key]) {
                newRace[key] = race[key];
            } else {
                newRace[key] = `DNC`;
            }
        }

        races.push(newRace);
    }

    let newPlayers = [];

    for (let key of players) {
        let newSumNet = 0;
        let newSumTotal = 0;
        let newPos = [];
        let exPos = [];

        for (let i = 0; i < cup.races.length; i++) {
            const race = cup.races[i];
            if (race[key] == -1) {
                newSumNet += players.length + 1;
                exPos.push({ pos: players.length + 1, index: i });
            } else if (race[key]) {
                exPos.push({ pos: race[key], index: i });
                newSumNet += race[key];
            } else {
                newSumNet += players.length + 1;
                exPos.push({ pos: players.length + 1, index: i });
            }
        }
        exPos.sort(function (a, b) {
            return b.pos - a.pos;
        });
        console.log(exPos);

        let i = exPos.length - 1;
        while (i > cup.excludingCount - 1) {
            newSumTotal += exPos[i].pos;
            let pos = races[exPos[i].index][key];
            if (pos == "DNF" || pos == "DNC") {
                pos = players.length + 1;
                races[exPos[i].index][key] = `${races[exPos[i].index][key]} ${players.length}`
            } else {
                races[exPos[i].index][key] = `${races[exPos[i].index][key]}`
            }

            i--;
        }
        while (i >= 0) {
            let pos = races[exPos[i].index][key];
            if (pos == "DNF" || pos == "DNC") {
                pos = players.length + 1;
                races[exPos[i].index][key] = `${races[exPos[i].index][key]} (${players.length})`
            } else {
                races[exPos[i].index][key] = `(${races[exPos[i].index][key]})`
            }

            i--;
        }

        for (let race of races) {
            newPos.push(race[key]);
        }

        newPlayers.push({ pos: newPos, netPoints: newSumNet, totalPoints: newSumTotal, name: key });

        sum[key] = newSumNet;
    }

    newPlayers.sort(function (a, b) {
        return a.totalPoints - b.totalPoints;
    });

    let pos = 1;
    let oldScore = newPlayers[0].totalPoints;
    for (let i = 0; i < newPlayers.length; i++) {
        const player = newPlayers[i];

        if (player.totalPoints != oldScore) {
            pos++;
        }

        player.rank = pos;

        oldScore = player.totalPoints;
    }

    return rv = {
        races: races,
        name: cup.name,
        sum: sum,
        players: newPlayers
    }
}

function getCupHtml(cup, actionFunctions) {
    let rv = document.createElement("table");
    let tbody = document.createElement("tbody");
    rv.appendChild(tbody);

    let rows = [];

    let players = getPlayers(cup);

    // Rows init
    for (let i = 0; i < players.length + 2; i++) {
        let newRow = document.createElement("tr");
        newRow.className = "align-middle";

        rows.push(newRow);
        tbody.appendChild(newRow);
    }
    console.log(cup);

    // First col
    addColToRow(rows[0], "", "th", "", 2);
    addColToRow(rows[1], "#", "th");
    addColToRow(rows[1], "Name", "th", "");

    addColToRow(rows[0], "Races", "th", "", cup.races.length);
    for (let i = 0; i < cup.races.length; i++) {
        let newCol = document.createElement("th");
        newCol.className = "";

        let newSpan = document.createElement("span");
        newSpan.innerText = (i + 1);
        newSpan.className = "col w-100";
        newCol.appendChild(newSpan);

        let newBtn = document.createElement("button");
        newBtn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16" style="scale:0.8">
              <use href="#delete-svg"></use>
            </svg>`;
        newBtn.className = "btn btn-sm btn-outline-danger col-auto py-0 px-1 d-print-none mx-2";
        var index = i;
        newBtn.addEventListener("click", function () {
            actionFunctions.delete(index);
        });
        newCol.appendChild(newBtn);

        rows[1].appendChild(newCol);
    }

    addColToRow(rows[0], "Points", "th", "", 2);
    addColToRow(rows[1], "Net", "th", "", 1, "min-width: 4rem");
    addColToRow(rows[1], "Total", "th", "", 1, "min-width: 4rem");

    for (let i = 0; i < cup.players.length; i++) {
        const player = cup.players[i];

        addColToRow(rows[i + 2], player.rank, "td", "", 1, "width:2rem");

        let newNameCol = document.createElement("td");
        newNameCol.style.minWidth = "15rem";
        newNameCol.className = "text-nowrap";
        rows[i + 2].appendChild(newNameCol);

        let viewContainer = document.createElement("span");
        viewContainer.className = "hide-cup-edit-name d-print-unset row px-3";
        newNameCol.appendChild(viewContainer);
        let newGoRaceBtn = document.createElement("button");
        newGoRaceBtn.className = "btn btn-sm btn-outline-primary d-print-none hide-cup-edit-name px-1 py-0 col-auto rounded-end-0";
        newGoRaceBtn.innerText = "Go Race";
        const name = player.name;
        newGoRaceBtn.addEventListener("click", function () {
            actionFunctions.goRace(name);
        })
        viewContainer.appendChild(newGoRaceBtn);
        let newEditBtn = document.createElement("button");
        newEditBtn.className = "btn btn-sm btn-outline-primary d-print-none cup-rename-btn hide-cup-edit-name px-1 py-0 col-auto rounded-start-0 border-start-0";
        newEditBtn.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <use href="#edit-icon"></use>
            </svg>`;
        let isPlayerExist = false;
        for (let race of cup.races) {
            if (!race[player.name].includes("DNC")) {
                isPlayerExist = true;
            }
        }
        newEditBtn.hidden = !isPlayerExist;
        newGoRaceBtn.hidden = !isPlayerExist;
        newEditBtn.addEventListener("click", function () {
            rows[i + 2].classList.add("cup-edit-name");
        });
        viewContainer.appendChild(newEditBtn);
        let newSpan = document.createElement("span");
        newSpan.innerText = player.name;
        newSpan.className = "cup-name-text col";
        viewContainer.appendChild(newSpan);

        let editContainer = document.createElement("div");
        editContainer.className = "show-cup-edit-name d-print-none";
        editContainer.style = "width: 15rem; margin-left: calc(50% - 7.5rem)";
        newNameCol.appendChild(editContainer);
        let editGroup = document.createElement("div");
        editGroup.className = "input-group";
        editContainer.appendChild(editGroup);
        let newNameInput = document.createElement("input");
        newNameInput.className = "form-control";
        newNameInput.type = "text";
        newNameInput.value = player.name;
        editGroup.appendChild(newNameInput);
        let applyBtn = document.createElement("button");
        applyBtn.innerText = "Ok";
        applyBtn.className = "btn btn-outline-primary";
        const oldName = player.name;
        applyBtn.addEventListener("click", function () {
            actionFunctions.rename(oldName, newNameInput.value);
        });
        editGroup.appendChild(applyBtn);
        let cancelBtn = document.createElement("button");
        cancelBtn.innerText = "Cancel";
        cancelBtn.className = "btn btn-outline-primary";
        cancelBtn.addEventListener("click", function () {
            updateCup();
        });
        editGroup.appendChild(cancelBtn);


        for (let pos of player.pos) {
            addColToRow(rows[i + 2], pos, "td", "", 1, "min-width: 4rem");
        }
        addColToRow(rows[i + 2], player.netPoints);
        addColToRow(rows[i + 2], player.totalPoints);
    }

    rv.className = "table table-hover table-bordered text-center table-sm";
    rv.style = "";

    return rv;
}

addEventListener("beforeprint", function () {
    printResults();
});

function printResults() {
    const newA = document.createElement("a");
    newA.href = "#c" + JSON.stringify({});
    newA.target = "_blank";
    if (document.querySelector(".modal-backdrop")) {
        document.querySelector(".modal-backdrop").className = "d-print-none";
    }
    const printArea = document.getElementById("print-area");
    printArea.innerHTML = "";
    updateCup(cup);
    printArea.innerHTML = document.getElementById("cup-modal").querySelector(".modal-body").innerHTML;
}

function addColToRow(row, text, colType = "td", className = "", colspan = 1, style = "") {
    newItem = document.createElement(colType);
    newItem.innerText = text;
    newItem.className = "px-2 " + className;
    newItem.setAttribute("colspan", colspan);
    newItem.style = style;
    row.appendChild(newItem);
}

function random(max) {
    return Math.floor(Math.random() * max);
}

function distance(x1, y1, x2, y2) {
    dx = Math.abs(x1 - x2);
    dy = Math.abs(y1 - y2);
    return Math.sqrt((dx * dx) + (dy * dy));
}
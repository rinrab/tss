
function createContolls() {
    document.getElementById("select-wind").addEventListener("change", function () {
        windChange()
    });

    document.getElementById("btn-add-player").addEventListener("click", function () {
        addPlayer();
        drawAll();
    });
    document.getElementById("btn-apply").addEventListener("click", apply);
    document.getElementById("btn-done").addEventListener("click", turn);
    document.getElementById("back-btn").addEventListener("click", backTurn);

    windChange();
}

function apply() {
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];
        if (player.nameInput.value == "") {
            player.nameText.value = "Player " + (i + 1);
            player.nameTextFinish.value = "Player " + (i + 1);
            player.name = "Player " + (i + 1);
        } else {
            player.nameText.value = player.nameInput.value;
            player.nameTextFinish.value = player.nameInput.value;
            player.name = player.nameInput.value;
        }

        player.apply();
    }

    game.isStart = false;

    document.getElementById("wind-scenario-name-inrace-alert").innerText =
        wind[windscenario].name.toLowerCase();

    document.body.className = "race";

    renderGridSize();
}

function addControll(player) {
    var controlls = document.getElementById("controlls");

    var newControlGroup1 = document.createElement("div");
    player.controlGroup = newControlGroup1;
    controlls.insertBefore(newControlGroup1, document.getElementById("last-controll"));

    const labelsStart = ["L", "M", "R"];
    const tooltipStart = ["Start left", "Start middle", "Start right"];
    const labelsRace = [
        '<svg xmlns="http://www.w3.org/2000/svg" class="port-forward-btn icon-sm"><use href="#icon-port-forward"></use></svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" class="starboard-forward-btn icon-sm"><use href="#icon-starboard-forward"></use></svg>',
        '<svg xmlns="http://www.w3.org/2000/svg" class="port-tack-btn icon-sm"><use href="#icon-port-tack"></use></svg>' +
        '<svg xmlns="http://www.w3.org/2000/svg" class="starboard-tack-btn icon-sm"><use href="#icon-starboard-tack"></use></svg>',
        '&#8857;&#8592;'];
    const tooltipRace = ["Forward", "Tack", "To Mark"];

    var nc = document.createElement("div");
    nc.className = "input-group mb-1 start-controls";
    newControlGroup1.appendChild(nc)

    var newcolor = document.createElement("span");
    newcolor.className = "input-group-text";
    nc.appendChild(newcolor);

    var newcolordiv = document.createElement("div");
    newcolordiv.className = "pn-control-color";
    newcolordiv.style.backgroundColor = player.color;
    newcolor.appendChild(newcolordiv);

    var nnameinput = document.createElement("input");
    nnameinput.type = "text";
    nnameinput.placeholder = "Name";
    nnameinput.className = "form-control";
    nc.appendChild(nnameinput);
    player.nameInput = nnameinput;

    var inputStart = createRadioGroup(labelsStart, nc, tooltipStart);
    player.startInputs = inputStart;
    inputStart[1].checked = true;
    for (var k = 0; k < inputStart.length; k++) {
        inputStart[k].addEventListener("change", function () {
            player.startPositionChange();
            drawAll();
        })
    }
    var newDeleteBtn = document.createElement("a");
    newDeleteBtn.className = "btn btn-outline-danger delete-btn";
    newDeleteBtn.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
    </svg>`;
    newDeleteBtn.addEventListener("click", function () {
        player.html.remove();
        newControlGroup1.remove();
        game.players.splice(game.players.findIndex(function (obj) { return obj == player }), 1);

        game.placeBoatsOnStart();
        drawAll();
    });
    player.deleteBtn = newDeleteBtn;
    nc.appendChild(newDeleteBtn)

    var nc = document.createElement("div");
    nc.className = "input-group mb-1 race-controls";
    nc.classList.add("race-controls");

    var newcolor = document.createElement("span");
    newcolor.className = "input-group-text";
    nc.appendChild(newcolor);

    var newcolordiv = document.createElement("div");
    newcolordiv.className = "pn-control-color";
    newcolordiv.style.backgroundColor = player.color;
    newcolor.appendChild(newcolordiv);
    player.posLabel = newcolordiv;

    var nnameinput = document.createElement("input");
    nnameinput.type = "text";
    nnameinput.className = "form-control";
    nnameinput.setAttribute("tabIndex", "-1");
    nc.appendChild(nnameinput);
    nnameinput.readOnly = true;
    player.nameText = nnameinput;

    var inputsRace = createRadioGroup(labelsRace, nc, tooltipRace);
    player.forwardBtn = inputsRace[0];
    player.tackBtn = inputsRace[1];
    player.toMarkBtn = inputsRace[2];
    player.raceControls = nc;
    newControlGroup1.appendChild(nc);

    player.forwardBtn.checked = true;

    var nc = document.createElement("div");
    nc.className = "input-group mb-1 race-controls";

    var newcolor = document.createElement("span");
    newcolor.className = "input-group-text";
    nc.appendChild(newcolor);

    var newcolordiv = document.createElement("div");
    newcolordiv.className = "pn-control-color";
    newcolordiv.style.backgroundColor = player.color;
    newcolor.appendChild(newcolordiv);

    var nnameinput = document.createElement("input");
    nnameinput.type = "text";
    nnameinput.className = "form-control";
    nnameinput.setAttribute("tabIndex", "-1");
    nc.appendChild(nnameinput);
    nnameinput.readOnly = true;
    player.nameTextFinish = nnameinput;

    var nc = document.createElement("div");
    nc.className = "input-group mb-1 finish-controls";

    var newcolor = document.createElement("span");
    newcolor.className = "input-group-text";
    nc.appendChild(newcolor);

    var newcolordiv = document.createElement("div");
    newcolordiv.className = "pn-control-color";
    newcolordiv.style.backgroundColor = player.color;
    newcolor.appendChild(newcolordiv);
    player.posLabel = newcolordiv;
    newControlGroup1.appendChild(nc);

    var nnameinput = document.createElement("input");
    nnameinput.type = "text";
    nnameinput.className = "form-control";
    nc.appendChild(nnameinput);
    nnameinput.readOnly = true;
    player.nameTextFinish = nnameinput;

    var newcolor = document.createElement("span");
    newcolor.className = "input-group-text";
    nc.appendChild(newcolor);

    var newcolordiv = document.createElement("div");
    newcolordiv.className = "pn-control-finish-time";
    newcolor.appendChild(newcolordiv);
    player.timeLabel = newcolordiv;
    newControlGroup1.appendChild(nc);

    var t = document.getElementById("track");
    var np = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    np.setAttribute("stroke", player.color);
    np.setAttribute("fill", "none");
    np.setAttribute("points", player.x + "," + player.y);
    np.setAttribute("stroke-width", 0.05);
    player.track = np;
    t.appendChild(np);

    if (player.name != undefined) {
        console.log(player.name);
        player.nameInput.value = player.name;
        player.nameText.value = player.name;
        player.nameTextFinish.value = player.name;
    }

    updatePlayerControls(player);
}

function createRadioGroup(labels, parent, tooltips) {
    var inputs = [];
    var groupName = getRandomId();

    for (var i = 0; i < labels.length; i++) {
        var newLabel = document.createElement("label");
        var newInput = document.createElement("input");

        newInput.setAttribute("type", "radio")
        newInput.id = getRandomId();
        newInput.name = groupName;
        newInput.className = "btn-check";
        inputs.push(newInput);

        newLabel.className = "btn btn-outline-primary label-control";
        newLabel.setAttribute("for", newInput.id);
        if (tooltips && tooltips[i]) {
            newLabel.title = tooltips[i];
        }
        newLabel.innerHTML = labels[i]

        parent.appendChild(newInput);
        parent.appendChild(newLabel);
    }

    return inputs;
}

function updatePlayerControls(player) {
    var val = player.tack ? "port" : "starboard";
    player.raceControls.setAttribute("data-current-tack", val);
}

function updateControls() {
    var newStartPos = [];
    for (var i = 0; i < game.players.length; i++) {
        game.players[i].controlGroup.classList.remove("finished");
        if (game.players[i].finished != false) {
            newStartPos.push(game.players[i]);
            game.players[i].controlGroup.classList.add("finished");
        } else {
            game.players[i].posLabel.innerText = "";
        }
    }
    newStartPos.sort(function (a, b) {
        return a.finished - b.finished;
    })
    for (var i = 0; i < game.players.length; i++) {
        updatePlayerControls(game.players[i]);
    }
    console.log(newStartPos);
    for (var i = 0; i < newStartPos.length; i++) {
        newStartPos[i].posLabel.innerText = i + 1;
        newStartPos[i].timeLabel.innerText = formatFinishTime(newStartPos[i].finished);
    }
}

function formatFinishTime(time) {
    var min = Math.floor(time / 60);
    var sec = Math.floor(time % 60);

    return min + ":" + Math.floor(sec / 10) + Math.floor(sec % 10);
}

var uniqueHtmlIdIdx = 0;
function getRandomId() {
    uniqueHtmlIdIdx++;
    return "uniqueId_" + uniqueHtmlIdIdx;
}

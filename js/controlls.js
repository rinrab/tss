
function createContolls() {
    document.getElementById("select-wind").addEventListener("change", function () {
        windChange()
    });

    document.getElementById("btn-add-player").addEventListener("click", function () {
        addPlayer();
        drawAll();
    });
    document.getElementById("btn-done").addEventListener("click", apply);
    document.getElementById("back-btn").addEventListener("click", backTurn);

    windChange();
}

function apply() {
    var labels = ["&#8593;", "&#8630;", "&#8857;&#8592;"];
    var tooltips = ["Forward", "Tack", "To mark"];

    for (var i = 0; i < game.players.length; i++) {
        var checkcontroll = game.players[i].nameInput;
        if (checkcontroll.value == "") {
            checkcontroll.value = "Player " + (i + 1);
        }

        game.players[i].deleteBtn.remove();

        game.players[i].apply();
        for (var j = 0; j < game.players[i].btnLabels.length; j++) {
            game.players[i].btnLabels[j].innerHTML = labels[j];
            game.players[i].btnLabels[j].setAttribute("data-bs-title", tooltips[j]);
        }
    }

    document.getElementById("start-alert").hidden = true;
    document.getElementById("game-alert").hidden = false;
    document.getElementById("wind-scenario-name-inrace-alert").innerText = wind[windscenario].name.toLowerCase();

    document.getElementById("back-btn").hidden = false;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
        new bootstrap.Tooltip(tooltipTriggerEl))

    var done = document.getElementById("btn-done");
    done.innerText = "Next";
    done.removeEventListener("click", apply);
    done.addEventListener("click", turn);

    document.body.className = "race";

    document.getElementById("create").remove();
    document.getElementById("btn-add-player").remove();

    for (var i = 0; i < game.players.length; i++) {
        game.players[i].nameInput.readOnly = true;
    }

    renderGridSize();
}

function addControll(player) {
    var controlls = document.getElementById("controlls");
    var labels = ["L", "M", "R"];
    var tooltips = ["Start left", "Start middle", "Start right"];

    var nc = document.createElement("div");
    nc.className = "input-group mb-1";

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

    player.btnLabels = [];
    var groupName = getRandomId();
    for (var j = 0; j < 3; j++) {
        var nel = document.createElement("label");
        var nei = document.createElement("input");

        nei.setAttribute("type", "radio")
        nei.id = getRandomId();
        nei.name = groupName;
        nei.className = "btn-check";
        nei.addEventListener("change", function () {
            player.startPositionChange();
            drawAll();
        });
        if (j == 0) {
            nei.checked = true;
        }

        nel.className = "btn btn-outline-primary label-control";
        nel.setAttribute("for", nei.id);
        nel.innerHTML = labels[j];
        nel.setAttribute("data-bs-toggle", "tooltip");
        nel.setAttribute("data-bs-placement", "top");
        nel.setAttribute("data-bs-title", tooltips[j]);

        nc.appendChild(nei);
        nc.appendChild(nel);

        player.btnLabels[j] = nel;

        switch (j) {
            case 0:
                player.forwardBtn = nei;
                break;
            case 1:
                player.tackBtn = nei;
                break;
            case 2:
                player.toMarkBtn = nei;
                break;
        }
    }

    var newDeleteBtn = document.createElement("button");
    newDeleteBtn.className = "btn btn-outline-danger";
    newDeleteBtn.innerHTML = "-";
    newDeleteBtn.addEventListener("click", function () {
        player.html.remove();
        nc.remove();
        game.players.splice(game.players.findIndex(function (obj) { return obj == player }), 1);

        game.placeBoatsOnStart();
        drawAll();
    });
    player.deleteBtn = newDeleteBtn;
    nc.appendChild(newDeleteBtn);

    var t = document.getElementById("track");
    var np = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    np.setAttribute("stroke", player.color);
    np.setAttribute("fill", "none");
    np.setAttribute("points", player.x + "," + player.y);
    np.setAttribute("stroke-width", 0.05);
    player.track = np;
    t.appendChild(np);

    controlls.insertBefore(nc, document.getElementById("last-controll"));
}

var uniqueHtmlIdIdx = 0;
function getRandomId() {
    uniqueHtmlIdIdx++;
    return "uniqueId_" + uniqueHtmlIdIdx;
}

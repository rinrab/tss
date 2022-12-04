
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
        if (game.players[i].nameInput.value == "") {
            game.players[i].nameText.value = "Player " + (i + 1);
        } else {
            game.players[i].nameText.value = game.players[i].nameInput.value;
        }

        // game.players[i].deleteBtn.remove();

        game.players[i].apply();
        for (var j = 0; j < game.players[i].btnLabels.length; j++) {
        }
    }

    document.getElementById("start-alert").hidden = true;
    document.getElementById("game-alert").hidden = false;
    document.getElementById("wind-scenario-name-inrace-alert").innerText =
        wind[windscenario].name.toLowerCase();

    document.getElementById("back-btn").hidden = false;

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
        new bootstrap.Tooltip(tooltipTriggerEl))

    var done = document.getElementById("btn-done");
    done.innerText = "Next";
    done.removeEventListener("click", apply);
    done.addEventListener("click", turn);

    document.body.className = "race";

    renderGridSize();
}

function addControll(player) {
    var controlls = document.getElementById("controlls");

    var newControlGroup1 = document.createElement("div");
    controlls.insertBefore(newControlGroup1, document.getElementById("last-controll"));

    var labelsStart = ["L", "M", "R"];
    var labelsRace = ["&#8593;", "&#8630;", "&#8857;&#8592;"];
    var tooltips = ["Start left", "Start middle", "Start right"];

    for (var i = 0; i < 2; i++) {
        var nc = document.createElement("div");
        nc.className = "input-group mb-1";
        if (i == 0) {
            nc.classList.add("start-controls");
        } else {
            nc.classList.add("race-controls");
        }

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
        if (i == 0) {
            player.nameInput = nnameinput;
        } else {
            nnameinput.readOnly = true;
            player.nameText = nnameinput;
        }

        player.btnLabels = [];
        var groupName = getRandomId();



        for (var j = 0; j < 3; j++) {
            var nel = document.createElement("label");
            var nei = document.createElement("input");

            nei.setAttribute("type", "radio")
            nei.id = getRandomId();
            nei.name = groupName;
            nei.className = "btn-check";

            if (i == 0) {
                nei.addEventListener("change", function () {
                    player.startPositionChange();
                    drawAll();
                });
            }

            if (j == 1) {
                nei.checked = true;
            }

            nel.className = "btn btn-outline-primary label-control";
            nel.setAttribute("for", nei.id);
            if (i == 0) {
                nel.innerHTML = labelsStart[j];
                player.startInputs[j] = nei;
            } else {
                nel.innerHTML = labelsRace[j];
                player.btnLabels[j] = nel;
            }
            nel.setAttribute("data-bs-toggle", "tooltip");
            nel.setAttribute("data-bs-placement", "top");
            nel.setAttribute("data-bs-title", tooltips[j]);

            nc.appendChild(nei);
            nc.appendChild(nel);


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

        if (i == 0) {
            var newDeleteBtn = document.createElement("button");
            newDeleteBtn.className = "btn btn-outline-danger delete-btn";
            newDeleteBtn.innerHTML = "-";
            newDeleteBtn.addEventListener("click", function () {
                player.html.remove();
                newControlGroup1.remove();
                game.players.splice(game.players.findIndex(function (obj) { return obj == player }), 1);

                game.placeBoatsOnStart();
                drawAll();
            });
            player.deleteBtn = newDeleteBtn;
            nc.appendChild(newDeleteBtn);
        }
        newControlGroup1.appendChild(nc);
    }

    var t = document.getElementById("track");
    var np = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    np.setAttribute("stroke", player.color);
    np.setAttribute("fill", "none");
    np.setAttribute("points", player.x + "," + player.y);
    np.setAttribute("stroke-width", 0.05);
    player.track = np;
    t.appendChild(np);
}

var uniqueHtmlIdIdx = 0;
function getRandomId() {
    uniqueHtmlIdIdx++;
    return "uniqueId_" + uniqueHtmlIdIdx;
}

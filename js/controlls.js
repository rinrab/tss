
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
        if (game.players[i].nameInput.value == "") {
            game.players[i].nameText.value = "Player " + (i + 1);
        } else {
            game.players[i].nameText.value = game.players[i].nameInput.value;
        }

        game.players[i].apply();
    }

    document.getElementById("wind-scenario-name-inrace-alert").innerText =
        wind[windscenario].name.toLowerCase();

    document.body.className = "race";

    renderGridSize();
}

function addControll(player) {
    var controlls = document.getElementById("controlls");

    var newControlGroup1 = document.createElement("div");
    controlls.insertBefore(newControlGroup1, document.getElementById("last-controll"));

    var labelsStart = ["L", "M", "R"];
    var labelsRace = [`
<svg xmlns="http://www.w3.org/2000/svg"
     class="port-forward-btn"
     viewBox="0 0 16 16" width="16" height="16" >
        < g >
      <polyline points="2,14 14,2"
                fill="none" 
                stroke="currentColor"
                stroke-linejoin="miter"
                stroke-width="1.7"/>

      <polyline points="13,8 14,2 8,3" 
                fill="none"
                stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-linecap="round"
                stroke-width="1.7"/>

      <ellipse rx="1.8" ry="1.8" cx="2" cy="14" fill="currentColor" />
    </g >
</svg>
<svg xmlns="http://www.w3.org/2000/svg"
     class="starboard-forward-btn"
     viewBox="0 0 16 16" width="16" height="16" >
        < g >
      <polyline points="14,14 2,2"
                fill="none" 
                stroke="currentColor"
                stroke-linejoin="miter"
                stroke-width="1.7"/>

      <polyline points="3,8 2,2 8,3" 
                fill="none"
                stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-linecap="round"
                stroke-width="1.7"/>

      <ellipse rx="1.8" ry="1.8" cx="14" cy="14" fill="currentColor" />
    </g >
</svg>
`,
        `<svg class="port-tack-btn"
     viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g>
      <polyline points="4,14 10,8 4,2" 
                fill="none" 
                stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-width="1.7"/>

      <polyline points="4,7 3,1 9,2" 
                fill="none" stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-linecap="round"
                stroke-width="1.7"/>
      <ellipse rx="1.8" ry="1.8" cx="4" cy="14" fill="currentColor" />
    </g>
</svg>
<svg class="starboard-tack-btn" viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g>
      <polyline points="12,14 6,8 12,2" 
                fill="none" 
                stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-width="1.7"/>

      <polyline points="12,7 13,1 7,2" 
                fill="none" stroke="currentColor" 
                stroke-linejoin="miter"
                stroke-linecap="round"
                stroke-width="1.7"/>
      <ellipse rx="1.8" ry="1.8" cx="12" cy="14" fill="currentColor" />
    </g>
</svg>

`, "&#8857;&#8592;"];
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

            if (i == 1) {
                player.raceControls = nc;
            }
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

    updatePlayerControls(player);
}

function updatePlayerControls(player) {
    var val = player.tack ? "port" : "starboard";
    player.raceControls.setAttribute("data-current-tack", val);
}

function updateControls() {
    for (var i = 0; i < game.players.length; i++) {
        updatePlayerControls(game.players[i]);
    }
}
var uniqueHtmlIdIdx = 0;
function getRandomId() {
    uniqueHtmlIdIdx++;
    return "uniqueId_" + uniqueHtmlIdIdx;
}


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
		var checkcontroll = document.getElementById("input-player-name" + i);
		if (checkcontroll.value == "") {
            checkcontroll.value = "Player " + (i + 1);
		}
        
		game.players[i].apply();
		for (var j = 0; j < game.players[i].btnLabels.length; j++) {
            game.players[i].btnLabels[j].innerHTML = labels[j];
			game.players[i].btnLabels[j].setAttribute("data-bs-title", tooltips[j]);
		}
	}
    
	document.getElementById("start-alert").hidden = true;
	document.getElementById("game-alert").hidden = false;
	document.getElementById("wind-scenario-name-inrace-alert").innerText = wind[windscenario].name.toLowerCase();
    
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
		document.getElementById("input-player-name" + i).readOnly = true;
	}

    renderGridSize();
}

function getSvgStartControl(translateX) {
    return `
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <g>
            <line x1="1" x2="15" y1="8" y2="8" stroke="gray" stroke-width="0.5" />
            <ellipse fill="darkred" cx="1" cy="8" rx="1" ry="1" />
            <ellipse fill="darkred" cx="15" cy="8" rx="1" ry="1" />
            <polygon points="4 10 5 9.4 3 7" stroke="red" transform="translate(${translateX} 0)" />
        </g>
    </svg>`
}

function addControll(i) {
	var controlls = document.getElementById("controlls");
	var tooltips = ["Start left", "Start middle", "Start right"];
    var startTranslations = [0, 4, 8];

	var nc = document.createElement("div");
	nc.className = "input-group mb-1";

	var newcolor = document.createElement("span");
	newcolor.className = "input-group-text";
	nc.appendChild(newcolor);

	var newcolordiv = document.createElement("div");
	newcolordiv.className = "pn-control-color";
	newcolordiv.style.backgroundColor = colors[i];
	newcolor.appendChild(newcolordiv);

	var nnameinput = document.createElement("input");
	nnameinput.type = "text";
	nnameinput.placeholder = "Name";
    nnameinput.className = "form-control";
	nnameinput.id = "input-player-name" + i;
	nc.appendChild(nnameinput);

	game.players[i].btnLabels = [];
	for (var j = 0; j < 3; j++) {
		var nel = document.createElement("label");
		var nei = document.createElement("input");

		nei.setAttribute("type", "radio")
		nei.id = "btn-contoll" + i.toString() + j.toString();
		nei.name = "input-contoll" + i;
		nei.className = "btn-check";
		nei.addEventListener("change", function () {
			game.players[i].startPositionChange();
			drawAll();
		});
		if (j == 0) {
			nei.checked = true;
		}

		nel.className = "btn btn-outline-primary label-control";
		nel.setAttribute("for", "btn-contoll" + i.toString() + j.toString());
		nel.innerHTML = getSvgStartControl(startTranslations[j]);
		nel.setAttribute("data-bs-toggle", "tooltip");
		nel.setAttribute("data-bs-placement", "top");
		nel.setAttribute("data-bs-title", tooltips[j]);

		nc.appendChild(nei);
		nc.appendChild(nel);

		game.players[i].btnLabels[j] = nel;

		switch (j) {
			case 0:
				game.players[i].forwardBtn = nei;
				break;
			case 1:
				game.players[i].tackBtn = nei;
				break;
			case 2:
				game.players[i].toMarkBtn = nei;
				break;
		}
	}

	var t = document.getElementById("track");
	var np = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
	np.setAttribute("stroke", colors[i]);
	np.setAttribute("fill", "none");
	np.setAttribute("points", game.players[i].x + "," + game.players[i].y);
	np.setAttribute("stroke-width", 0.05);
	game.players[i].track = np;
	t.appendChild(np);

	controlls.insertBefore(nc, document.getElementById("last-controll"));
}


function createContolls() {
	document.getElementById("select-wind").addEventListener("change", windChange);

	document.getElementById("btn-add-player").addEventListener("click", function () {
		addPlayer();
		drawAll();
	});
	document.getElementById("btn-done").addEventListener("click", apply);
	document.getElementById("back-btn").addEventListener("click", backTurn);

	windChange();

	drawAll();
}

function apply() {
	for (var i = 0; i < game.players.length; i++) {
		var checkcontroll = document.getElementById("input-player-name" + i);
		if (checkcontroll.value == "") {
			checkcontroll.value = "Player " + (i + 1);
		}

		game.players[i].apply();
	}

	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
		new bootstrap.Tooltip(tooltipTriggerEl))

	var done = document.getElementById("btn-done");
	done.innerText = "Done";
	done.removeEventListener("click", apply);
	done.addEventListener("click", turn);

	document.getElementById("create").remove();

	document.getElementById("cont-add-player").remove();

	for (var i = 0; i < game.players.length; i++) {
		document.getElementById("input-player-name" + i).disabled = true;
	}

}
function addControll(i) {
	var controlls = document.getElementById("controlls");
	var labels = ["&#8593;", "&#8630;", "&#8857;&#8592;"];
	var tooltips = ["Forward", "Tack", "To mark"];

	var nc = document.createElement("div");
	nc.className = "btn-group";
	var newcontrolls;

	var ncolor = document.createElement("button");
	ncolor.className = "btn btn-outline-primary";
	ncolor.style.backgroundColor = colors[i];
	ncolor.style.border = "0";
	ncolor.style.width = "30px";

	var nnameinput = document.createElement("input");
	nnameinput.type = "text";
	nnameinput.style.width = "70px"
	nnameinput.placeholder = "Name";
	nnameinput.id = "input-player-name" + i;

	nc.appendChild(ncolor);
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

		nel.className = "btn btn-outline-primary";
		nel.setAttribute("for", "btn-contoll" + i.toString() + j.toString());
		nel.innerHTML = labels[j];
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
	var newMoveRight = document.createElement("button");
	var newMoveLeft = document.createElement("button");
	newMoveLeft.className = newMoveRight.className = "btn btn-success";
	newMoveLeft.innerHTML = "&#8592;";
	newMoveRight.innerHTML = "&#8594;";
	newMoveLeft.setAttribute("data-bs-toggle", "tooltip");
	newMoveLeft.setAttribute("data-bs-title", "Move left");
	newMoveRight.setAttribute("data-bs-toggle", "tooltip");
	newMoveRight.setAttribute("data-bs-title", "Move right");
	newMoveLeft.addEventListener("click", function(){
		game.players[i].moveLeft();
		drawAll();
	})
	newMoveRight.addEventListener("click", function(){
		game.players[i].moveRight();
		drawAll();
	})
	game.players[i].removeStartArrows = function(){
		newMoveLeft.remove();
		newMoveRight.remove();
	}
	nc.appendChild(newMoveLeft);
	nc.appendChild(newMoveRight);



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

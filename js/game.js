var gridsize = 20;

var turncount = 0;
const colors = ["red", "blue", "black", "green", "cyan", "magenta", "purple", "gray", "yellow",
	"darkred", "darkblue", "darkcyan", "lightgray"
	, "lightblue", "lightgreen", "lightcyan"]
var winddata
var windDataScroller;
var boatSize = 32;

var windscenario = 0;
var windscenariocontrol;
var windtype = 0;

var boatsvg =
	`<g>
<title>Layer 1</title>
<polygon points="8,0 0,32 16,32"  fill="white"/>
<line y1="10" x1="8" y2="28" x2="8" fill="none" stroke="black"></line>
</g>`;
var boathidesvg = `
<g>
<ellipse rx="2" ry="2" cx="8" cy="16" stroke-width="3"></ellipse>
</g>`
var marksvg = `<g>
  <ellipse cx="8" cy="8" rx="7" ry="7" fill="none" stroke="#000" stroke-width="0.25"/>
  <ellipse cx="8" cy="8" rx="2" ry="2" fill="#6d2121"/>
</g>`;

var startx = 6;
var starty = 28;

function turn() {
	turncount++;

	for (var i = 0; i < game.players.length; i++) {
		game.players[i].turn();
	}

	setTimeout(() => {
		redrawTrack();
	}, 200);

	drawAll();
}

function redrawTrack() {
	for (var i = 0; i < game.players.length; i++) {
		game.players[i].track.setAttribute("points", "");
		for (var j = 0; j < turncount + 1; j++) {
			game.players[i].track.setAttribute("points",
				game.players[i].track.getAttribute("points")
				+ " " + (game.players[i].turns[j].x)
				+ "," + (game.players[i].turns[j].y));
		}
	}
}

function backTurn() {
	if (turncount > 0) {
		turncount--;

		for (var i = 0; i < game.players.length; i++) {
			game.players[i].back();
		}
		setTimeout(redrawTrack, 200);
		drawAll();
	}
}

function drawAll() {
	windDataScroller.style.height = (window.innerHeight - 30) + "px";
	windDataInit();
	for (var i = 0; i < game.players.length; i++) {
		drawBoat(game.players[i]);

	}
	drawMarks();
	console.log("draw");
	setTimeout(drawWindArrow, 250);
}

function drawWindArrow() {
	var e = document.getElementById("wind");
	e.style.width = "50px"
	e.style.left = "25px"
	e.style.rotate = game.wind[turncount + 1] * 2 + "deg";
}

function windDataInit() {
	winddata.innerHTML = "";
	var showfuturewind = document.getElementById("show-future-wind").checked;

	for (var i = game.wind.length - 1; i >= 1; i--) {
		if (showfuturewind || i < turncount + 2) {
			var newelem = document.createElement("li");
			newelem.className = "list-group-item";
			if (i == turncount + 1) {
				newelem.classList.add("active");
			}

			var newlabel = document.createElement("label");
			newlabel.innerText = i.toString() + ":";
			newelem.appendChild(newlabel);

			var newlabel = document.createElement("label");
			var windtext = game.wind[i];
			if (windtext > 0) {
				windtext = "+" + windtext;
			}
			windtext += "º";
			newlabel.innerText = windtext.toString();;
			newlabel.style.position = "absolute";
			newlabel.style.right = "50px";
			newelem.appendChild(newlabel);

			var img = document.createElement("img");
			img.src = "img/wind.svg";
			img.className = "wind-data-arrow wind";
			img.style.rotate = game.wind[i] * 2 + "deg";
			newelem.appendChild(img);

			winddata.appendChild(newelem);
		}
		else {
			var newelem = document.createElement("li");
			newelem.className = "list-group-item";
			newelem.innerText = i + ": Hide"

			var newimg = document.createElement("img");
			newimg.src = "img/wind-hide.svg";
			newimg.className = "pn-wind-hide";
			newelem.appendChild(newimg);
			winddata.appendChild(newelem);
		}
	}
	windDataScroller.scrollTop = (30 * (game.wind.length - turncount)) - window.innerHeight * 0.5;

}


function drawBoat(player) {
	//player.html.children[0].style.height = gridsize + "px";

	player.html.style.left = (player.x * gridsize) + "px";
	player.html.style.top = (player.y * gridsize).toString() + "px";
	player.html.style.rotate = player.rotation + "deg";
	player.html.style.transformOrigin = "center"
}

function drawMarks() {
	var marksHtmlelem = document.getElementById("marks");
	marksHtmlelem.innerHTML = "";
	for (var i = 0; i < game.marks.length; i++) {
		var newmark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		var newmarkcont = document.createElement("div");
		newmark.innerHTML = marksvg;
		newmark.setAttribute("viewBox", "0 0 16 16");
		newmarkcont.style.left = game.marks[i].x * gridsize + "px";
		newmarkcont.style.top = game.marks[i].y * gridsize + "px";
		newmarkcont.className = "game-elem pn-mark";
		newmarkcont.appendChild(newmark);
		marksHtmlelem.appendChild(newmarkcont);
	}
}

function renderGridSize() {
	var gamecont = document.getElementById("game-cont");
	var gamearea = document.getElementById("game-area");
	var w = window.innerWidth - windDataScroller.clientWidth -
		document.getElementById("controll-container").clientWidth - 30;
	var h = window.innerHeight;
	if (h < w) {
		gamearea.style.scale = h / (game.height * gridsize);
	} else {
		gamearea.style.scale = w / (game.width * gridsize);
	}
	console.log("gs");
}

function windChange() {
	if (windscenariocontrol.selectedIndex == wind.length) {
		windEditorStart();
		windscenariocontrol.selectedIndex = windscenario;
		document.getElementById("edit-btn").disabled = false;
	} else {
		windscenario = windscenariocontrol.selectedIndex;
		if (game.windscenario.israndom) {
			game.setWindFromRandom();
		} else {
			game.setWindFromScenario();
		}
		renderGridSize();
		drawAll();
	}
}

function addWind() {
	var windscenarioselect = document.getElementById("select-wind");
	windscenarioselect.innerHTML = "";
	var oldtype;
	var optgroup;
	for (var i = 0; i < wind.length; i++) {
		if (oldtype != wind[i].type) {
			optgroup = document.createElement("optgroup");
			optgroup.label = wind[i].type;
			windscenarioselect.appendChild(optgroup);
			oldtype = wind[i].type;
		}
		var newoption = document.createElement("option");
		newoption.innerText = wind[i].name;
		optgroup.appendChild(newoption);
	}

	var newoption = document.createElement("option");
	newoption.innerText = "Create wind";
	newoption.setAttribute("data-bs-toggle", "modal");
	newoption.setAttribute("data-bs-target", "#wind-editor-window");
	windscenarioselect.appendChild(newoption);
	windscenarioselect.selectedIndex = windscenario;
}
function addPlayer() {
	var i = game.players.length;
	if (i > colors.length - 2) {
		alert("too many boats")
		return;
	}
	var gamearea = document.getElementById("boats");

	game.players[i] = new Boat(startx + (i * 0.2) + (i * 1), starty, false);
	
	var newboatcont = document.createElement("div");
	newboatcont.className = "game-elem pn-boat";
	
	var newboat = document.createElementNS('http://www.w3.org/2000/svg', "svg");
	newboat.setAttribute("stroke", colors[i]);
	newboat.setAttribute("viewBox", "0 0 16 32");
	
	newboatcont.appendChild(newboat);
	game.players[i].html = newboatcont;
	gamearea.appendChild(newboatcont);

	applySettings();
	addControll(i);

	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl =>
		new bootstrap.Tooltip(tooltipTriggerEl))
	new bootstrap.Tooltip(document.getElementById("edit-btn"))
}

addEventListener("load", init);

function init() {
	windInit();
	settingsInit();
	createGame(2);

	winddata = document.getElementById("wind-data");
	windDataScroller = document.getElementById("wind-data.scroller");
	windscenariocontrol = document.getElementById("select-wind");
	addWind();
	createContolls();
	applySettings();
	drawAll();
	console.log("load");
	document.getElementById("show-future-wind").addEventListener("click", windDataInit);
	document.getElementById("edit-btn").addEventListener("click", windEditorStart, windscenario);

	addEventListener("resize", function () {
		renderGridSize();
		drawAll()
	});
	var track = document.getElementById("track");
	track.setAttribute("viewBox", "0 0 " + game.width + " " + game.height);
	var gamearea = document.getElementById("game-area");
	gamearea.style.height = (game.height * gridsize) + "px";
	gamearea.style.width = (game.width * gridsize) + "px";

}

function random(max) {
	return Math.floor(Math.random() * max);
}

function distance(x1, y1, x2, y2) {
	dx = Math.abs(x1 - x2);
	dy = Math.abs(y1 - y2);
	return Math.sqrt((dx * dx) + (dy * dy));
}
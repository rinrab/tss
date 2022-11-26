var game;

function createGame(playercount) {
	game = new Game();
	game.players = [];
	game.setMapData();
	for (var i = 0; i < playercount; i++) {
		addPlayer();
	}
}

class Boat {
	x;
	y;
	turns;
	rotation;
	html;
	forwardBtn;
	tackBtn;
	toMarkBtn;
	track;
	isinrace;
	btnLabels;
	// tack == false: startport
	// tack == true: port
	tack;


	turn() {
		var turntype;
		if (this.isinrace) {
			if (this.tackBtn.checked) {
				this.tack = !this.tack;

				if (this.tack) {
					this.rotation = 45 + game.wind[turncount];
				} else {
					this.rotation = -45 + game.wind[turncount];
				}
				this.forwardBtn.checked = true;
				turntype = turnTupes.tack;
			} else if (this.toMarkBtn.checked) {
				var a = Math.atan((this.x - game.marks[2].x) /
					(this.y - game.marks[2].y)) * 180 / Math.PI
				if (a + game.wind[turncount] > 45 ||
					a + game.wind[turncount] < -45) {
					if (game.marks[2].y > this.y) {
						this.rotation = -a - 180;
					} else {
						this.rotation = -a
					}
				}
				else if (this.tack) {
					this.rotation = 45 + game.wind[turncount];
				} else {
					this.rotation = -45 + game.wind[turncount];
				}
				turntype = turnTupes.toMark;
			}


			else {
				if (this.tack) {
					this.rotation = 45 + game.wind[turncount];
				} else {
					this.rotation = -45 + game.wind[turncount];
				}
				turntype = turnTupes.forward;
			}

			this.rotation = this.rotation % 360;
			this.x += Math.sin(this.rotation * Math.PI / 180);
			this.y -= Math.cos(this.rotation * Math.PI / 180);

			this.x = Math.round(this.x * 100) / 100;
			this.y = Math.round(this.y * 100) / 100;

			this.dist = distance(this.x, this.y, game.marks[2].x, game.marks[2].y);
			this.saveTurn(turntype);
		}
	}

	apply() {
		this.saveTurn(turnTupes.forward);
		this.removeStartArrows();
	}

	saveTurn(turntype) {
		this.turns[turncount] = new PlayerStory(turntype, this.x, this.y,
			this.rotation, this.tack);
	}

	back() {
		this.x = this.turns[turncount].x;
		this.y = this.turns[turncount].y;
		this.rotation = this.turns[turncount].rotation;
		this.tack = this.turns[turncount].tack;
		if (this.turns[turncount + 1].turnType == turnTupes.forward) {
			this.forwardBtn.checked = true;
		} else if (this.turns[turncount + 1].turnType == turnTupes.tack) {
			this.tackBtn.checked = true;
		} else if (this.turns[turncount + 1].turnType == turnTupes.toMark) {
			this.toMarkBtn.checked = true;
		}
	}

	constructor(x, y, tack) {
		this.x = x;
		this.y = y;
		this.tack = tack;
		this.rotation = -45;
		this.isinrace = true;
		this.turns = [];
	}
	moveLeft() {
		if (this.x < game.width - 10 && this.x > 10) {
			this.x -= 4;
		} else {
			if (this.x > game.marks[0].x + 2.5) {
				this.x -= 2;
			}
		}
	}
	moveRight() {
		if (this.x < game.width - 10 && this.x > 10) {
			this.x += 4;
		} else {
			if (this.x < game.marks[1].x - 2.5) {
				this.x += 2;
			}
		}
	}

	removeStartArrows(){}
	// startPositionChange() {
	// 	if (turncount == 0) {
	// 		if (this.forwardBtn.checked) {
	// 			var count = 0;
	// 			for (var i = 0; i < game.players.length; i++) {
	// 				if (game.players[i].x < (game.width / 2)) {
	// 					count++;
	// 				}
	// 			}
	// 			this.x = game.marks[0].x + 3 + count / 5;
	// 		} else if (this.tackBtn.checked) {
	// 			this.x = game.width / 2 + Math.random() * 2;
	// 		} else if (this.toMarkBtn.checked) {
	// 			this.x = (game.marks[1].x - 3) - Math.random() * 2;
	// 		}
	// 	}
	// }
}

var windhennums;

class Game {
	player;
	players;
	width;
	height;
	marks;
	wind;
	get windscenario() {
		return wind[windscenario];
	}

	setWindFromScenario() {
		this.wind = this.windscenario.wind;

		this.setMapData();
	}

	setWindFromRandom() {
		this.wind = [];

		var windnow = 0;
		windhennums = []
		for (var i = 0; i < this.windscenario.probability.length; i++) {
			for (var j = 0; j < this.windscenario.probability[i]; j++) {
				windhennums[windhennums.length] = this.windscenario.wind[i];
			}
		}

		for (var i = 0; i < this.windscenario.stepscount; i++) {
			windnow += windhennums[random(windhennums.length)];
			if (windnow > this.windscenario.maxwindsetting) {
				windnow = this.windscenario.maxwindsetting;
			}
			if (windnow < -this.windscenario.maxwindsetting) {
				windnow = -this.windscenario.maxwindsetting;
			}

			this.wind[i] = windnow;
		}

		this.setMapData();
	}

	setMapData() {
		this.width = this.windscenario.width;
		this.height = this.windscenario.height;
		this.marks = [
			{ "x": 5, "y": 28, "type": Marks.startleft },
			{ "x": this.width - 5, "y": 28, "type": Marks.startright },
			{ "x": this.width / 2, "y": 2, "type": Marks.mark1 },
		];

	}

}

class CourseRace {
	type;
	x;
	y;
}

const Marks = {
	"startleft": 0,
	"startright": 1,
	"mark1": 2,
	"mark2": 2,
	"mark3": 4,
};

const turnTupes = {
	forward: 0,
	tack: 1,
	toMark: 2
};

class PlayerStory {
	turnType;
	x;
	y;
	rotation;
	tack;

	constructor(turnType, x, y, rotation, tack) {
		this.turnType = turnType;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.tack = tack;
	}
}
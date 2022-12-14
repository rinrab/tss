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
    raceControls;
    forwardBtn;
    tackBtn;
    toMarkBtn;
    track;
    finished;
    btnLabels;
    nameText
    posLabel;
    // tack == false: startport
    // tack == true: port
    tack;
    startPosInputs;
    isStart;
    controlGroup;

    color;

    oldStartPos;
    myOldStartPosIndex;

    startInputs;

    turn() {
        var turntype;
        var points = [];
        var moveDist = 1;

        if (this.tackBtn.checked) {
            turntype = turnTupes.tack;
        } else if (this.toMarkBtn.checked) {
            turntype = turnTupes.toMark;
        } else {
            turntype = turnTupes.forward;
        }

        while (moveDist > 0) {
            if (!this.finished) {
                var dist = distance(this.x, this.y, game.marks[2].x, game.marks[2].y);

                if (moveDist >= dist && game.isOutLaneline(this.x, this.y)) {
                    this.x = game.marks[2].x;
                    this.y = game.marks[2].y - 0.1;
                    points.push({ x: this.x, y: this.y });
                    moveDist -= dist;

                    this.finished = turncount * 60 + (60 - moveDist * 60);
                    console.log("Boat " + this.nameText.value + " finish time:", this.finished);

                    drawAll();

                    this.rotation = -100;
                    this.x += Math.sin(this.rotation * Math.PI / 180) * (moveDist - dist);
                    this.y -= Math.cos(this.rotation * Math.PI / 180) * (moveDist - dist);
                    moveDist -= moveDist - dist;

                } else {
                    if (this.x < 0.5) {
                        this.tack = true;
                    }
                    if (this.x > game.width - 0.5) {
                        this.tack = false;
                    }
                    if (this.tackBtn.checked) {
                        this.tack = !this.tack;

                        if (this.tack) {
                            this.rotation = 45 + game.getwind(turncount);
                        } else {
                            this.rotation = -45 + game.getwind(turncount);
                        }
                        this.forwardBtn.checked = true;
                    }

                    if (this.toMarkBtn.checked) {
                        if (game.isOutLaneline(this.x, this.y)) {
                            this.rotation = getRotateAngel(this.x, this.y, game.marks[2].x, game.marks[2].y);
                            this.x += Math.sin(this.rotation * Math.PI / 180) * moveDist;
                            this.y -= Math.cos(this.rotation * Math.PI / 180) * moveDist;
                            points.push({ x: this.x, y: this.y });
                            moveDist = 0.0;
                            this.tack = this.rotation > 0;
                        } else {
                            var moveAngle;
                            var lanelineAngle;

                            if (this.tack) {
                                lanelineAngle = -45 - game.getwind(turncount);
                                moveAngle = 45 + game.getwind(turncount);
                            } else {
                                lanelineAngle = 45 - game.getwind(turncount);
                                moveAngle = -45 + game.getwind(turncount);
                            }

                            this.rotation = moveAngle;

                            var lanelineDistance = distanceToLine(
                                this.x, this.y, game.marks[2].x, game.marks[2].y,
                                lanelineAngle);

                            if (lanelineDistance < moveDist) {
                                this.x += Math.sin(this.rotation * Math.PI / 180) * lanelineDistance;
                                this.y -= Math.cos(this.rotation * Math.PI / 180) * lanelineDistance;
                                points.push({ x: this.x, y: this.y });
                                moveDist -= lanelineDistance;
                                this.rotation = getRotateAngel(this.x, this.y, game.marks[2].x, game.marks[2].y);
                            } else {
                                this.x += Math.sin(this.rotation * Math.PI / 180) * moveDist;
                                this.y -= Math.cos(this.rotation * Math.PI / 180) * moveDist;
                                points.push({ x: this.x, y: this.y });
                                moveDist = 0.0;
                            }
                        }
                    }
                    else {
                        if (this.tack) {
                            this.rotation = 45 + game.getwind(turncount);
                        } else {
                            this.rotation = -45 + game.getwind(turncount);
                        }

                        this.x += Math.sin(this.rotation * Math.PI / 180) * moveDist;
                        this.y -= Math.cos(this.rotation * Math.PI / 180) * moveDist;
                        points.push({ x: this.x, y: this.y });
                        moveDist = 0.0;
                    }

                    this.rotation = this.rotation % 360;
                }
            } else {
                this.x += Math.sin(this.rotation * Math.PI / 180) * moveDist;
                this.y -= Math.cos(this.rotation * Math.PI / 180) * moveDist;
                points.push({ x: this.x, y: this.y });
                moveDist = 0.0;
            }
        }

        this.saveTurn(turntype, points);
    }

    apply() {
        this.saveTurn(turnTupes.forward, [{ x: this.x, y: this.y }]);
        this.isStart = false;
        this.forwardBtn.checked = true;
    }

    saveTurn(turntype, points) {
        this.turns[turncount] = new PlayerStory(turntype, points,
            this.rotation, this.tack, this.finished);
    }

    back() {
        this.x = this.turns[turncount].points[this.turns[turncount].points.length - 1].x;
        this.y = this.turns[turncount].points[this.turns[turncount].points.length - 1].y;
        this.rotation = this.turns[turncount].rotation;
        this.tack = this.turns[turncount].tack;
        if (this.turns[turncount + 1].turnType == turnTupes.forward) {
            this.forwardBtn.checked = true;
        } else if (this.turns[turncount + 1].turnType == turnTupes.tack) {
            this.tackBtn.checked = true;
        } else if (this.turns[turncount + 1].turnType == turnTupes.toMark) {
            this.toMarkBtn.checked = true;
        }
        this.finished = this.turns[turncount].finished;
    }

    constructor(x, y, tack, color) {
        this.x = x;
        this.y = y;
        this.tack = tack;
        this.rotation = -45;
        this.finished = false;
        this.turns = [];
        this.isStart = true;
        this.startPos = 1;
        this.startPriority = game.currentStartPriority++;
        this.startInputs = [];
        this.color = color;
        this.finishTime = undefined;
    }

    startPositionChange() {
        const startdist = 0.5;
        var newStartPos;

        for (var i = 0; i < this.startInputs.length; i++) {
            if (this.startInputs[i].checked) {
                newStartPos = i;
            }
        }

        if (newStartPos != this.startPos) {
            this.startPos = newStartPos;
            this.startPriority = game.currentStartPriority++;
        }

        game.placeBoatsOnStart();
    }
}

function findIndexByValue(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == value) {
            return i;
        }
    }
}

var windhennums;

class Game {
    player;
    players;
    width;
    height;
    marks;
    wind;
    currentStartPriority;
    deleteBtn;

    getwind(index) {
        return this.wind[index % this.wind.length];
    }

    get windscenario() {
        if (windscenario > wind.length - 1) {
            windscenario = 0;
        }
        return wind[windscenario];
    }

    isOutLaneline(x, y) {
        var a = getRotateAngel(x, y, this.marks[2].x, this.marks[2].y);
        return (a - this.getwind(turncount) >= 44.99 || a - this.getwind(turncount) <= -44.99);
    }

    setWindFromScenario() {
        this.wind = [];
        for (var i = 0; i < this.windscenario.stepscount; i++) {
            this.wind[i] = this.windscenario.wind[i % this.windscenario.wind.length];
        }
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
            { "x": (this.width - this.windscenario.startsize) / 2, "y": this.height - 2, "type": Marks.startleft },
            { "x": this.width - (this.width - this.windscenario.startsize) / 2, "y": this.height - 2, "type": Marks.startright },
            { "x": this.width / 2, "y": 2, "type": Marks.mark1 },
        ];
    }

    findFreeColor() {
        for (var i = 0; i < colors.length; i++) {
            if (!this.players.find(function (o) { return o.color == colors[i]; })) {
                return colors[i];
            }
        }

        return null;
    }

    placeBoatsOnStart() {
        var boatsStartLeft = [];
        var boatsStartMiddle = [];
        var boatsStartRight = [];

        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.startPos === 0) {
                boatsStartLeft.push(player);
            } else if (player.startPos === 2) {
                boatsStartRight.push(player);
            }
            else {
                boatsStartMiddle.push(player);
            }
        }

        function compareBoatStartPriority(a, b) {
            return (a.startPriority - b.startPriority);
        }

        boatsStartLeft.sort(compareBoatStartPriority);
        boatsStartMiddle.sort(compareBoatStartPriority);
        boatsStartRight.sort(compareBoatStartPriority);

        const startdist = 0.5;
        for (var i = 0; i < boatsStartLeft.length; i++) {
            boatsStartLeft[i].x = this.marks[0].x + 1 + (i * startdist);
            boatsStartLeft[i].y = this.height - 2;
        }

        for (var i = 0; i < boatsStartMiddle.length; i++) {
            var k = 0.5;
            switch (i) {
                case 0:
                case 1:
                    k = 1;
                    break;
                case 3:
                    k = 0.6
                    break;
            }
            if (i < 2) {
                k = 1;
            }
            if (i % 2 == 0) {
                boatsStartMiddle[i].x = (-i * startdist * k) + (this.width / 2);
            } else {
                boatsStartMiddle[i].x = (i * startdist * k) + (this.width / 2);
            }
            boatsStartMiddle[i].y = this.height - 2;
        }

        for (var i = 0; i < boatsStartRight.length; i++) {
            boatsStartRight[i].x = this.marks[1].x - 1 - (i * startdist);
            boatsStartRight[i].y = this.height - 2;
        }
    }

    constructor() {
        this.currentStartPriority = 0;
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
    points;
    rotation;
    tack;
    finished;

    constructor(turnType, points, rotation, tack, finished) {
        this.turnType = turnType;
        this.points = points;
        this.rotation = rotation;
        this.tack = tack;
        this.finished = finished;
    }
}

function getRotateAngel(x1, y1, x2, y2) {
    return (Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI + 90);
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function distanceToLine(x, y, lX, lY, angle) {
    // Convert coordinate system. 
    angle = angle - 90;
    y = -y;
    lY = -lY;

    var rad = degToRad(angle - 90);
    return Math.abs(
        Math.cos(rad) * (lY - y) -
        Math.sin(rad) * (lX - x))
}
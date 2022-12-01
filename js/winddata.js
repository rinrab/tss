function getWind(scenario, index) {
    if (index < wind[scenario].length) {
        return wind[scenario][index];
    } else {
        return 0;
    }
}

var windTypes = {
    presets: "Presets",
    userdefined: "User defined"
}
var wind =
    [
        {
            name: "Random",
            probability: [4, 3, 3, 2, 2, 1, 1],
            wind: [0, 5, -5, 10, -10, 15, -15],
            israndom: true,
            stepscount: 50,
            width: 30,
            height: 30,
            maxwindsetting: 20,
            type: windTypes.presets,
        },
        {
            name: "High Random",
            probability: [8, 4, 4, 3, 3, 2, 2, 1, 1],
            wind: [0, 5, -5, 10, -10, 15, -15, 20, -20],
            israndom: true,
            stepscount: 50,
            width: 30,
            height: 30,
            maxwindsetting: 35,
            type: windTypes.presets,
        },
        {
            name: "Random Moscow",
            probability: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            wind: [5, 10, 15, 20, 0, -5, -10, -15, -20],
            israndom: true,
            stepscount: 50,
            maxwindsetting: 60,
            width: 30,
            height: 30,
            type: windTypes.presets,
        },
        {
            name: "default",
            width: 30,
            height: 30,
            type: windTypes.presets,
            wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10],
            stepscount: 50
        },
        {
            name: "crazy",
            width: 30,
            height: 30,
            type: windTypes.presets,
            wind: [0, 0, 0, 5, 5, 5, 10, 5, 10, 10, 15, 10, 0, 15, 15, 30, 0, -10, 35, 40, 35, 30, 40, 45, 30, 15, 25, 20, 15, 10, 5, 0, -5, -10, 180, 180, 180],
            stepscount: 50
        },
        {
            name: "by fokey",
            width: 30,
            height: 30,
            type: windTypes.presets,
            wind: [0, 5, 5, 5, 10, 10, 5, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15, 20, 20, 20, 20, 15, 10, 5, 0, 0, -5, -10, -15, -20, -20, -20, -15, -15, -10, -5, 0, 0, 0, 0, 0, -5, -5, -5, -10, -15, -10, -5, 0],
            stepscount: 50
        },
        {
            name: "very crazy",
            width: 30,
            height: 30,
            type: windTypes.presets,
            wind: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 80, 100, 999999999999, 999999],
            stepscount: 50
        },
        {
            name: "andy",
            type: windTypes.presets,
            height: 30,
            width: 30,
            stepscount: 48,
            wind: [0, 5, 0, -5, -10, -15, -15, -10, -15, -20, -15, -10, -5, 0, 5, 10, 15, 20, 15, 20, 15, 10, 5, 0, -5, -10, -15, -10, -5, 0, 5, 10, 10, 15, 20, 15, 10, 5, 0, -5, 0, 5, -5, -10, -5, 0, 5, 10]
        },
        {
            name: "timoxa",
            type: windTypes.presets,
            height: 30,
            width: 30,
            stepscount: 48,
            wind: [0, 5, 10, 15, 15, 10, 20, 15, 10, 20, 20, 15, 15, 10, 5, 10, 5, 0, -5, -10, -15, -5, 0, -10, -5, 0, 5, 10, 15, 10, 5, 10, 15, 20, 25, 25, 20, 15, 10, 10, 10, 5, 5, 0, 0, -10, 0, 10]
        },
        {
            name: "static 0",
            type: windTypes.presets,
            height: 30,
            width: 30,
            stepscount: 50,
            wind: [0]
        },
        {
            name: "static +5",
            type: windTypes.presets,
            height: 30,
            width: 30,
            stepscount: 50,
            wind: [5]
        },
        {
            name: "static -5",
            type: windTypes.presets,
            height: 30,
            width: 30,
            stepscount: 50,
            wind: [-5]
        },
        {
            "name": "Pendulum 1",
            "type": windTypes.presets,
            "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
            "width": 30,
            "height": 30,
            "stepscount": 50,
        }
    ];

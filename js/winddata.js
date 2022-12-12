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
var windPresets =
    [
        {
            name: "Random",
            probability: [4, 3, 3, 2, 2, 1, 1],
            wind: [0, 5, -5, 10, -10, 15, -15],
            israndom: true,
            stepscount: 50,
            width: 40,
            height: 30,
            maxwindsetting: 20,
            type: windTypes.presets,
            startsize: 15,
        },
        {
            name: "High Random",
            probability: [8, 4, 4, 3, 3, 2, 2, 1, 1],
            wind: [0, 5, -5, 10, -10, 15, -15, 20, -20],
            israndom: true,
            stepscount: 50,
            width: 40,
            height: 30,
            maxwindsetting: 35,
            type: windTypes.presets,
            startsize: 15,
        },
        {
            name: "Random Moscow",
            probability: [1, 1, 1, 1, 1, 1, 1, 1, 1],
            wind: [5, 10, 15, 20, 0, -5, -10, -15, -20],
            israndom: true,
            stepscount: 50,
            maxwindsetting: 60,
            width: 40,
            height: 30,
            type: windTypes.presets,
            startsize: 15,
        },
        {
            name: "default",
            width: 40,
            height: 30,
            type: windTypes.presets,
            wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10],
            stepscount: 50,
            startsize: 15,
        },
        {
            name: "by fokey",
            width: 40,
            height: 30,
            type: windTypes.presets,
            wind: [0, 5, 5, 5, 10, 10, 5, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15, 20, 20, 20, 20, 15, 10, 5, 0, 0, -5, -10, -15, -20, -20, -20, -15, -15, -10, -5, 0, 0, 0, 0, 0, -5, -5, -5, -10, -15, -10, -5, 0],
            stepscount: 50,
            startsize: 15,
        },
        {
            name: "andy",
            type: windTypes.presets,
            height: 30,
            width: 40,
            stepscount: 48,
            wind: [0, 5, 0, -5, -10, -15, -15, -10, -15, -20, -15, -10, -5, 0, 5, 10, 15, 20, 15, 20, 15, 10, 5, 0, -5, -10, -15, -10, -5, 0, 5, 10, 10, 15, 20, 15, 10, 5, 0, -5, 0, 5, -5, -10, -5, 0, 5, 10],
            startsize: 15,
        },
        {
            name: "timoxa",
            type: windTypes.presets,
            height: 30,
            width: 40,
            stepscount: 48,
            wind: [0, 5, 10, 15, 15, 10, 20, 15, 10, 20, 20, 15, 15, 10, 5, 10, 5, 0, -5, -10, -15, -5, 0, -10, -5, 0, 5, 10, 15, 10, 5, 10, 15, 20, 25, 25, 20, 15, 10, 10, 10, 5, 5, 0, 0, -10, 0, 10],
            startsize: 15,
        },
        {
            name: "static 0",
            type: windTypes.presets,
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [0],
            startsize: 15,
        },
        {
            name: "static +5",
            type: windTypes.presets,
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [5],
            startsize: 15,
        },
        {
            name: "static -5",
            type: windTypes.presets,
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [-5],
            startsize: 15,
        },
        {
            "name": "Pendulum 1",
            "type": windTypes.presets,
            "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
            "width": 40,
            "height": 30,
            "stepscount": 50,
            startsize: 15,
        },
        {
            "name": "Global Change 1",
            "type": windTypes.presets,
            "wind": [0, 0, 0, 5, 0, 5, 5, 10, 5, 10, 10, 15, 10, 15, 15, 15, 10, 15, 15, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 10, 10, 10, 5, 5, 5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        {
            "name": "Global Change 2",
            "type": windTypes.presets,
            "wind": [0, 0, 0, -5, 0, -5, -5, -10, -5, -10, -10, -15, -10, -15, -15, -15, -10, -15, -15, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -10, -10, -10, -5, -5, -5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        // {
        //     "name": "Bodrum Yalikovak 1",
        //     "type": windTypes.presets,
        //     "wind": [0, 5, 10, 10, 15, 20, 20, 15, 15, 10, 5, 0, -5, -20, -15, -15, -10, 0, -5, 0, 5, 0, 0, 5, 5, 15, 20, 20, 10, 10, 15, 10, 5, -10, -20, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -5],
        //     "width": 40, "height": 30,
        //     "stepscount": 47,
        //     "allowedit": false,
        //     "startsize": 15
        // },
        {
            "name": "Bodrum Yalikovak",
            "type": windTypes.presets,
            "wind": [0, 5, 10, 10, 15, 20, 20, 15, 15, 10, 5, 0, -5, -20, -15, -15, -10, 0, -5, -10, -20, -15, -10, -5, 0, 5, 0, 0, 5, 5, 15, 20, 20, 10, 10, 15, 10, 5, -10, -20, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -5, 0],
            "width": 40, "height": 30,
            "stepscount": 52,
            "allowedit": false,
            "startsize": 15
        },
    ];

var wind = [];
function getWind(scenario, index) {
    if (index < wind[scenario].length) {
        return wind[scenario][index];
    } else {
        return 0;
    }
}

var windPresets =
    [
        {
            name: "Random",
            count: [4, 4, 4, 3, 3, 2, 2, 1, 1],
            wind: [0, 5, -5, 10, -10, 15, -15, 20, -20],
            israndom: true,
            stepscount: 50,
            width: 40,
            height: 30,
            maxwindsetting: 20,
            type: "Presets",
            startsize: 15,
        },
        {
            "name": "Pendulum",
            "type": "Presets",
            "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
            "width": 40,
            "height": 30,
            "stepscount": 50,
            "startsize": 15,
        },
        {
            name: "Random Moscow",
            count: [3, 3, 3, 3, 3, 3, 3, 3, 3],
            wind: [5, 10, 15, 20, 0, -5, -10, -15, -20],
            israndom: true,
            stepscount: 50,
            maxwindsetting: 20,
            width: 40,
            height: 30,
            type: "Presets",
            startsize: 15,
        },
        {
            name: "default",
            width: 40,
            height: 30,
            type: "Presets",
            wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10],
            stepscount: 50,
            startsize: 15,
        },
        {
            name: "by fokey",
            width: 40,
            height: 30,
            type: "Presets",
            wind: [0, 5, 5, 5, 10, 10, 5, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15, 20, 20, 20, 20, 15, 10, 5, 0, 0, -5, -10, -15, -20, -20, -20, -15, -15, -10, -5, 0, 0, 0, 0, 0, -5, -5, -5, -10, -15, -10, -5, 0],
            stepscount: 50,
            startsize: 15,
        },
        {
            name: "andy",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 48,
            wind: [0, 5, 0, -5, -10, -15, -15, -10, -15, -20, -15, -10, -5, 0, 5, 10, 15, 20, 15, 20, 15, 10, 5, 0, -5, -10, -15, -10, -5, 0, 5, 10, 10, 15, 20, 15, 10, 5, 0, -5, 0, 5, -5, -10, -5, 0, 5, 10],
            startsize: 15,
        },
        {
            name: "timoxa",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 48,
            wind: [0, 5, 10, 15, 15, 10, 20, 15, 10, 20, 20, 15, 15, 10, 5, 10, 5, 0, -5, -10, -15, -5, 0, -10, -5, 0, 5, 10, 15, 10, 5, 10, 15, 20, 20, 20, 20, 15, 10, 10, 10, 5, 5, 0, 0, -10, 0, 10],
            startsize: 15,
        },
        {
            name: "static 0",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [0],
            startsize: 15,
        },
        {
            name: "static +5",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [5],
            startsize: 15,
        },
        {
            name: "static -5",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [-5],
            startsize: 15,
        },
        {
            "name": "Global Change 1",
            "type": "Presets",
            "wind": [0, 0, 0, 5, 0, 5, 5, 10, 5, 10, 10, 15, 10, 15, 15, 15, 10, 15, 15, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 10, 10, 10, 5, 5, 5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        {
            "name": "Global Change 2",
            "type": "Presets",
            "wind": [0, 0, 0, -5, 0, -5, -5, -10, -5, -10, -10, -15, -10, -15, -15, -15, -10, -15, -15, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -10, -10, -10, -5, -5, -5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        {
            "name": "Global change 3",
            "type": "Presets",
            "wind": [0, 5, 5, 10, 5, 10, 15, 20, 15, 20, 15, 10, 15, 20, 15, 10, 15, 10, 5, 0, 0, 0, -5, -10, -5, 0, 5, 0, 5, 0, 0, 0, -5, -15, -20, -15, -10, -5, 0, 5, 10, 5, 0, 0, 0, 5, 0, 0],
            "width": 40, "height": 30,
            "startsize": 15,
            "stepscount": 48,
            "allowedit": true
        },
        {
            "name": "Bodrum Yalikovak",
            "type": "Presets",
            "wind": [0, 5, 10, 10, 15, 20, 20, 15, 15, 10, 5, 0, -5, -20, -15, -15, -10, 0, -5, -10, -20, -15, -10, -5, 0, 5, 0, 0, 5, 5, 15, 20, 20, 10, 10, 15, 10, 5, -10, -20, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -5, 0],
            "width": 40, "height": 30,
            "stepscount": 52,
            "allowedit": false,
            "startsize": 15
        },
    ];

var wind = [];
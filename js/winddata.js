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
            name_ru: "Случайный",
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
            name_ru: "Маятник",
            "type": "Presets",
            "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
            "width": 40,
            "height": 30,
            "stepscount": 50,
            "startsize": 15,
        },
        {
            name: "Random Moscow",
            name_ru: "Случайный Московский",
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
            name: "static +5",
            name_ru: "Статичный +5",
            type: "Presets",
            height: 30,
            width: 40,
            stepscount: 50,
            wind: [5],
            startsize: 15,
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
        {
            "name": "Global Change 1",
            name_ru: "Глобальный заход 1",
            "type": "Presets",
            "wind": [0, 0, 0, 5, 0, 5, 5, 10, 5, 10, 10, 15, 10, 15, 15, 15, 10, 15, 15, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 20, 20, 20, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 15, 10, 15, 15, 10, 10, 10, 5, 5, 5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        {
            "name": "Global Change 2",
            name_ru: "Глобальный заход 2",
            "type": "Presets",
            "wind": [0, 0, 0, -5, 0, -5, -5, -10, -5, -10, -10, -15, -10, -15, -15, -15, -10, -15, -15, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -20, -20, -20, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -15, -10, -15, -15, -10, -10, -10, -5, -5, -5],
            "width": 40, "height": 30,
            "stepscount": 53,
            "allowedit": false,
            "startsize": 15
        },
        {
            "name": "Global change 3",
            name_ru: "Глобальный заход 3",
            "type": "Presets",
            "wind": [0, 5, 5, 10, 5, 10, 15, 20, 15, 20, 15, 10, 15, 20, 15, 10, 15, 10, 5, 0, 0, 0, -5, -10, -5, 0, 5, 0, 5, 0, 0, 0, -5, -15, -20, -15, -10, -5, 0, 5, 10, 5, 0, 0, 0, 5, 0, 0],
            "width": 40, "height": 30,
            "startsize": 15,
            "stepscount": 48,
            "allowedit": true
        },
    ];

var wind = [];
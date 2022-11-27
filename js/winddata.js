var windTypes = {
    presets: "Presets",
    userdefined: "User defined"
}
var wind =
    [
        {
            "name": "Random",
            "probability": [8, 4, 4, 3, 3, 2, 2, 1, 1],
            "wind": [0, 5, -5, 10, -10, 15, -15, 20, -20],
            "israndom": "true",
            "stepscount": 50,
            "width": 30,
            "height": 30,
            "maxwindsetting": 35,
            type: windTypes.presets,
        },
        {
            "name": "Random Moscow",
            "probability": [1, 1, 1, 1, 1, 1, 1, 1, 1],
            "wind": [5, 10, 15, 20, 0, -5, -10, -15, -20],
            "israndom": "true",
            "stepscount": 50,
            "maxwindsetting": 60,
            "width": 30,
            "height": 30,
            type: windTypes.presets,
        },
        { wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10], name: "default", "width": 30, "height": 30, type: windTypes.presets, },
        { wind: [0, 0, 0, 5, 5, 5, 10, 5, 10, 10, 15, 10, 0, 15, 15, 30, 0, -10, 35, 40, 35, 30, 40, 45, 30, 15, 25, 20, 15, 10, 5, 0, -5, -10, 180, 180, 180], name: "crazy", "width": 30, "height": 30, type: windTypes.presets, },
        { wind: [0, 5, 5, 5, 10, 10, 5, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15, 20, 20, 20, 20, 15, 10, 5, 0, 0, -5, -10, -15, -20, -20, -20, -15, -15, -10, -5, 0, 0, 0, 0, 0, -5, -5, -5, -10, -15, -10, -5, 0], name: "by fokey", "width": 30, "height": 30, type: windTypes.presets },
        { wind: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 80, 100, 999999999999, 999999], name: "very crazy", "width": 30, "height": 30, type: windTypes.presets, },
        { "name": "andy", "type": windTypes.presets, "wind": [0, 5, 0, -5, -10, -15, -15, -10, -15, -20, -15, -10, -5, 0, 5, 10, 15, 20, 15, 20, 15, 10, 5, 0, -5, -10, -15, -10, -5, 0, 5, 10, 10, 15, 20, 15, 10, 5, 0, -5, 0, 5, -5, -10, -5, 0, 5, 10], "height": 30, "width": 30, "stepscount": 48 },
        { "name": "timoxa", "type": windTypes.presets, "wind": [0, 5, 10, 15, 15, 10, 20, 15, 10, 20, 20, 15, 15, 10, 5, 10, 5, 0, -5, -10, -15, -5, 0, -10, -5, 0, 5, 10, 15, 10, 5, 10, 15, 20, 25, 25, 20, 15, 10, 10, 10, 5, 5, 0, 0, -10, 0, 10], "height": 30, "width": 30, "stepscount": 48 },
    ];

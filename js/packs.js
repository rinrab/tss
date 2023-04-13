const packs = [
    {
        name: "Pendulum",
        description: "Winds which change from side to side",
        winds: [
            {
                "name": "Pendulum 1",
                "type": "Presets",
                "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
                "width": 40,
                "height": 30,
                "stepscount": 50,
                "startsize": 15,
            },
            {
                "name": "Pendulum 2",
                "type": "Presets",
                "wind": [-5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -15, -10],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 12,
                "allowedit": true
            },
            {
                "name": "Pendulum 3",
                "type": "Presets",
                "wind": [0, 5, 10, 15, 20, 15, 10, 5, 0, 5, 10, 15, 20, 15, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5, 0, -5, -10, -15, -20, -15, -10, -5, 0],
                "width": 60, "height": 50,
                "startsize": 15,
                "stepscount": 33,
                "allowedit": false
            },
            {
                "name": "Pendulum 4",
                "type": "Presets",
                "wind": [0, 5, 10, 15, 20, 15, 10, 5, 0],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 9,
                "allowedit": true
            },
            {
                "name": "Double Pendulum",
                "type": "Presets",
                "wind": [0, 5, 0, 10, 5, 15, 10, 20, 15, 20, 10, 15, 5, 10, 0, 5, -5, 0, -10, -5, -15, -10, -20, -15, -20, -10, -15, -5, -10, 0, -5, 0, 0],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 33,
                "allowedit": true
            },
        ]
    }
]
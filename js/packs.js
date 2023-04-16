const packs = [
    {
        name: "Pendulum",
        winds: [
            {
                "name": "Pendulum 1",
                name_ru: "Маятник 1",
                "type": "Presets",
                "wind": [0, 5, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5],
                "width": 40,
                "height": 30,
                "stepscount": 50,
                "startsize": 15,
            },
            {
                "name": "Pendulum 2",
                name_ru: "Маятник 2",
                "type": "Presets",
                "wind": [-5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -15, -10],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 12,
                "allowedit": true
            },
            {
                "name": "Pendulum 3",
                name_ru: "Маятник 3",
                "type": "Presets",
                "wind": [0, 5, 10, 15, 20, 15, 10, 5, 0, 5, 10, 15, 20, 15, 10, 5, 0, -5, -10, -15, -20, -15, -10, -5, 0, -5, -10, -15, -20, -15, -10, -5, 0],
                "width": 60, "height": 50,
                "startsize": 15,
                "stepscount": 33,
                "allowedit": false
            },
            {
                "name": "Pendulum 4",
                name_ru: "Маятник 4",
                "type": "Presets",
                "wind": [0, 5, 10, 15, 20, 15, 10, 5, 0],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 9,
                "allowedit": true
            },
            {
                "name": "Double Pendulum",
                name_ru: "Двойной Маятник",
                "type": "Presets",
                "wind": [0, 5, 0, 10, 5, 15, 10, 20, 15, 20, 10, 15, 5, 10, 0, 5, -5, 0, -10, -5, -15, -10, -20, -15, -20, -10, -15, -5, -10, 0, -5, 0, 0],
                "width": 40, "height": 30,
                "startsize": 15,
                "stepscount": 33,
                "allowedit": true
            },
        ]
    },
    {
        name: "Tests",
        winds: [
            {
                name: "First wind",
                width: 40,
                height: 30,
                type: "Presets",
                wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10],
                stepscount: 50,
                startsize: 15,
            },
            {
                name: "static 0",
                name_ru: "Статичный 0",
                type: "Presets",
                height: 30,
                width: 40,
                stepscount: 50,
                wind: [0],
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
                name: "static -5",
                name_ru: "Статичный -5",
                type: "Presets",
                height: 30,
                width: 40,
                stepscount: 50,
                wind: [-5],
                startsize: 15,
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
        ]
    },
    {
        name: "Winds by us",
        winds: [
            {
                name: "by fokey",
                width: 40,
                height: 30,
                wind: [0, 5, 5, 5, 10, 10, 5, 0, 0, 0, 5, 5, 10, 10, 10, 10, 15, 20, 20, 20, 20, 15, 10, 5, 0, 0, -5, -10, -15, -20, -20, -20, -15, -15, -10, -5, 0, 0, 0, 0, 0, -5, -5, -5, -10, -15, -10, -5, 0],
                stepscount: 50,
                startsize: 15,
            },
            {
                name: "andy",
                height: 30,
                width: 40,
                stepscount: 48,
                wind: [0, 5, 0, -5, -10, -15, -15, -10, -15, -20, -15, -10, -5, 0, 5, 10, 15, 20, 15, 20, 15, 10, 5, 0, -5, -10, -15, -10, -5, 0, 5, 10, 10, 15, 20, 15, 10, 5, 0, -5, 0, 5, -5, -10, -5, 0, 5, 10],
                startsize: 15,
            },
            {
                name: "timoxa",
                height: 30,
                width: 40,
                stepscount: 48,
                wind: [0, 5, 10, 15, 15, 10, 20, 15, 10, 20, 20, 15, 15, 10, 5, 10, 5, 0, -5, -10, -15, -5, 0, -10, -5, 0, 5, 10, 15, 10, 5, 10, 15, 20, 20, 20, 20, 15, 10, 10, 10, 5, 5, 0, 0, -10, 0, 10],
                startsize: 15,
            },
            {
                "name": "Bodrum Yalikovak",
                "wind": [0, 5, 10, 10, 15, 20, 20, 15, 15, 10, 5, 0, -5, -20, -15, -15, -10, 0, -5, -10, -20, -15, -10, -5, 0, 5, 0, 0, 5, 5, 15, 20, 20, 10, 10, 15, 10, 5, -10, -20, -15, -10, -5, 0, 5, 10, 15, 10, 5, 0, -5, -10, -5, 0],
                "width": 40, "height": 30,
                "stepscount": 52,
                "allowedit": false,
                "startsize": 15
            },
            {
                name: "First wind",
                width: 40,
                height: 30,
                type: "Presets",
                wind: [0, 5, 0, 5, 5, 10, 5, 0, -5, 0, 5, 10, 15, 15, 15, 10, 5, 0, 5, -5, -10, -20, -10, -5, -5, 0, 5, 10, 10, 5, 10, 5, 0, 10],
                stepscount: 50,
                startsize: 15,
            },
        ]
    }
]
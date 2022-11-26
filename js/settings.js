var localStorageNames = {
    settings: "settings",
    wind: "wind-data#",
    windlist: "wind-list",
}
var defaultSetting = {
    showboats: true,
    showtracks: true,
    showleaders: false,
};
class Settings {
    showboats;
    showtracks;
    showleaders;
}

var settings;

function settingsInit() {
    if (localStorage.getItem(localStorageNames.settings) == null) {
        settings = defaultSetting;
        saveSettings();
    } else {
        loadSettings();
    }

    document.getElementById("set-show-boats").addEventListener("click", settingsChanged);
    document.getElementById("set-show-tracks").addEventListener("click", settingsChanged);
}

function saveSettings() {
    localStorage.setItem(localStorageNames.settings, JSON.stringify(settings));
}

function loadSettings() {
    settings = JSON.parse(localStorage.getItem(localStorageNames.settings));
    document.getElementById("set-show-boats").checked = settings.showboats;
    document.getElementById("set-show-tracks").checked = settings.showtracks;
}

function settingsChanged() {
    settings.showboats = document.getElementById("set-show-boats").checked;
    settings.showtracks = document.getElementById("set-show-tracks").checked;

    saveSettings();
    applySettings();
}

function applySettings() {
    if (settings.showtracks) {
        document.getElementById("track-cont").style.opacity = "100%";
    } else {
        document.getElementById("track-cont").style.opacity = "0";
    }
    if (settings.showboats) {
        for (var i = 0; i < game.players.length; i++) {
            game.players[i].html.children[0].innerHTML = boatsvg;
        }
    } else {
        for (var i = 0; i < game.players.length; i++) {
            game.players[i].html.children[0].innerHTML = boathidesvg;
        }
    }
}

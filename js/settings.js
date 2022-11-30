var localStorageNames = {
    settingsshowboats: "settings-show-boats",
    settingsshowtracks: "settings-show-tarcks",
    settingsshowlanelines: "settings-show-lanelines",
    wind: "wind-data#",
    windlist: "wind-list",
    selectedWind: "selected-wind",
}
var defaultSetting = {
    showboats: true,
    showtracks: true,
    showlaneline: true,
};
class Settings {
    showboats;
    showtracks;
    showlaneline;
}

var setShowBoatsCheck;
var setShowTracksCheck;
var setShowLanelinesCheck;

var settings = defaultSetting;

function settingsInit() {
    loadSettings();

    setShowBoatsCheck = document.getElementById("set-show-boats");
    setShowTracksCheck = document.getElementById("set-show-tracks")
    setShowLanelinesCheck = document.getElementById("set-show-lanelines")
    
    setShowBoatsCheck.addEventListener("click", settingsChanged);
    setShowTracksCheck.addEventListener("click", settingsChanged);
    setShowLanelinesCheck.addEventListener("click", settingsChanged);
}

function saveSettings() {
    localStorage.setItem(localStorageNames.settingsshowboats, settings.showboats)
    localStorage.setItem(localStorageNames.settingsshowtracks, settings.showtracks)
    localStorage.setItem(localStorageNames.settingsshowlanelines, settings.showlaneline);
}

function loadSettings() {
    settings.showboats =  readBoolSettings(localStorageNames.settingsshowboats, defaultSetting.showboats);
    settings.showtracks = readBoolSettings(localStorageNames.settingsshowtracks, defaultSetting.showtracks);
    settings.showlaneline = readBoolSettings(localStorageNames.settingsshowlanelines, defaultSetting.showlaneline);
}

function readBoolSettings(settingName, defaultValue) {
    var val = localStorage.getItem(settingName);
    if (val === "true") {
        return true;
    } else if (val === "false") {
        return false;
    } else {
        return defaultValue;
    }
}

function settingsChanged() {
    settings.showboats = setShowBoatsCheck.checked;
    settings.showtracks = setShowTracksCheck.checked;
    settings.showlaneline = setShowLanelinesCheck.checked;
    
    saveSettings();
    applySettings();
}

function applySettings() {
    setShowTracksCheck.checked = settings.showtracks;
    if (settings.showtracks) {
        document.getElementById("track-cont").style.opacity = "100%";
    } else {
        document.getElementById("track-cont").style.opacity = "0";
    }
    setShowLanelinesCheck.checked = settings.showlaneline;
    if (settings.showlaneline) {
        upmarllines.hidden = false;
    } else {
        upmarllines.hidden = true;
    }
    setShowBoatsCheck.checked = settings.showboats;
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

function readIntSetting(settingName, defaultValue) {
    var val = parseInt(localStorage.getItem(settingName));

    if (isNaN(val)) {
        return defaultValue;
    } else {
        return val;
    }
}

var localStorageNames = {
    settingsShowBoats: "settings-show-boats",
    settingsShowTracks: "settings-show-tarcks",
    settingsShowLanelines: "settings-show-lanelines",
    settingsShowEqualLines: "equal-lines",
    wind: "wind-data#",
    windlist: "wind-list",
    selectedWind: "selected-wind",
}
var defaultSetting = {
    showboats: true,
    showtracks: true,
    showlaneline: true,
    showequallines: false,
};
class Settings {
    showboats;
    showtracks;
    showlaneline;
    showequallines;
}

var setShowBoatsCheck;
var setShowTracksCheck;
var setShowLanelinesCheck;
var setShowEqualLines;

var settings = defaultSetting;

function settingsInit() {
    loadSettings();

    setShowBoatsCheck = document.getElementById("set-show-boats");
    setShowTracksCheck = document.getElementById("set-show-tracks");
    setShowLanelinesCheck = document.getElementById("set-show-lanelines");
    setShowEqualLines = document.getElementById("set-show-equal-lines");

    setShowBoatsCheck.addEventListener("click", settingsChanged);
    setShowTracksCheck.addEventListener("click", settingsChanged);
    setShowLanelinesCheck.addEventListener("click", settingsChanged);
    setShowEqualLines.addEventListener("click", settingsChanged);
}

function saveSettings() {
    localStorage.setItem(localStorageNames.settingsShowBoats, settings.showboats)
    localStorage.setItem(localStorageNames.settingsShowTracks, settings.showtracks)
    localStorage.setItem(localStorageNames.settingsShowLanelines, settings.showlaneline);
    localStorage.setItem(localStorageNames.settingsShowEqualLines, settings.showequallines);
}

function loadSettings() {
    settings.showboats = readBoolSettings(
        localStorageNames.settingsShowBoats,
        defaultSetting.showboats);

    settings.showtracks = readBoolSettings(
        localStorageNames.settingsShowTracks,
        defaultSetting.showtracks);

    settings.showlaneline = readBoolSettings(
        localStorageNames.settingsShowLanelines,
        defaultSetting.showlaneline);

    settings.showequallines = readBoolSettings(
        localStorageNames.settingsShowEqualLines,
        defaultSetting.showequallines);
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
    settings.showequallines = setShowEqualLines.checked;

    saveSettings();
    applySettings();
}

function applySettings() {
    var gameArea = document.getElementById("game-area");

    setShowTracksCheck.checked = settings.showtracks;
    if (settings.showtracks) {
        document.getElementById("track-cont").style.opacity = "100%";
    } else {
        document.getElementById("track-cont").style.opacity = "0";
    }
    setShowLanelinesCheck.checked = settings.showlaneline;
    if (settings.showlaneline) {
        upMarkLanelines.hidden = false;
    } else {
        upMarkLanelines.hidden = true;
    }
    setShowBoatsCheck.checked = settings.showboats;

    if (settings.showboats) {
        gameArea.setAttribute("data-show-boats", "full");
    } else {
        gameArea.setAttribute("data-show-boats", "dot");
    }
    for (var i = 0; i < game.players.length; i++) {
        game.players[i].html.innerHTML = boathidesvg + boatsvg;
    }

    setShowEqualLines.checked = settings.showequallines;
    if (settings.showequallines) {
        document.getElementById("lines-container").hidden = false;
    } else {
        document.getElementById("lines-container").hidden = true;
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

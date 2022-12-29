var localStorageNames = {
    settingsShowBoats: "settings-show-boats",
    settingsShowTracks: "settings-show-tarcks",
    settingsShowLanelines: "settings-show-lanelines",
    settingsShowEqualLines: "equal-lines",
    wind: "wind-data#",
    windlist: "wind-list",
    selectedWind: "selected-wind",
    confirmation: "confirmation",
}
var defaultSetting = {
    showBoats: true,
    showTracks: true,
    showLanelines: true,
    showEqualLines: true,
};
class Settings {
    showBoats;
    showTracks;
    showLanelines;
    showEqualLines;
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
    localStorage.setItem(localStorageNames.settingsShowBoats, settings.showBoats)
    localStorage.setItem(localStorageNames.settingsShowTracks, settings.showTracks)
    localStorage.setItem(localStorageNames.settingsShowLanelines, settings.showLanelines);
    localStorage.setItem(localStorageNames.settingsShowEqualLines, settings.showEqualLines);
}

function loadSettings() {
    settings.showBoats = readBoolSettings(
        localStorageNames.settingsShowBoats,
        defaultSetting.showBoats);

    settings.showTracks = readBoolSettings(
        localStorageNames.settingsShowTracks,
        defaultSetting.showTracks);

    settings.showLanelines = readBoolSettings(
        localStorageNames.settingsShowLanelines,
        defaultSetting.showLanelines);

    settings.showEqualLines = readBoolSettings(
        localStorageNames.settingsShowEqualLines,
        defaultSetting.showEqualLines);
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
    settings.showBoats = setShowBoatsCheck.checked;
    settings.showTracks = setShowTracksCheck.checked;
    settings.showLanelines = setShowLanelinesCheck.checked;
    settings.showEqualLines = setShowEqualLines.checked;

    saveSettings();
    applySettings();
}

function applySettings() {
    var gameArea = document.getElementById("game-area");

    setShowTracksCheck.checked = settings.showTracks;
    if (settings.showTracks) {
        document.getElementById("track-cont").style.opacity = "100%";
    } else {
        document.getElementById("track-cont").style.opacity = "0";
    }
    setShowLanelinesCheck.checked = settings.showLanelines;
    if (settings.showLanelines) {
        upMarkLanelines.hidden = false;
    } else {
        upMarkLanelines.hidden = true;
    }
    setShowBoatsCheck.checked = settings.showBoats;

    if (settings.showBoats) {
        gameArea.setAttribute("data-show-boats", "full");
    } else {
        gameArea.setAttribute("data-show-boats", "dot");
    }
    for (var i = 0; i < game.players.length; i++) {
        game.players[i].html.innerHTML = boathidesvg + boatsvg;
    }

    setShowEqualLines.checked = settings.showEqualLines;
    if (settings.showEqualLines) {
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

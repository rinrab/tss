var nameinput;
var windtext;
var editIndex;

var saveWindBtn;
var deleteWindBtn;

var windReadOnlyText;

var windlist;

var errortexts = {
    notnumber: 'is not number',
};
var errorTypes = {
    notnumber: 0,
};

var mapWidth;
var mapHeight;
var startLineSizeInput;

var shareBtn;

var validtext;

function windInit() {
    if (localStorage.getItem(localStorageNames.windlist) == null) {
        for (var i in windPresets) {
            var w = windPresets[i];
            wind.push({
                wind: w.wind,
                name: w.name,
                probability: w.probability,
                israndom: w.israndom,
                stepscount: w.stepscount,
                width: w.width,
                height: w.height,
                maxwindsetting: w.maxwindsetting,
                type: w.type,
                startsize: w.startsize,
            });
        }
        saveWind();
    } else {
        loadWind();
    }
    document.getElementById("copy-btn").addEventListener("click", function () {
        const w = game.windscenario;
        wind.push({
            wind: w.wind,
            name: w.name + " copy",
            stepscount: w.wind.length,
            width: w.width,
            height: w.height,
            type: windTypes.userdefined,
            startsize: w.startsize,
        });

        windscenario = wind.length - 1;
        saveWind();
        addWind();
        windscenariocontrol.selectedIndex = windscenario;
    });
    mapWidth = document.getElementById("map-width");
    mapHeight = document.getElementById("map-height");
    startLineSizeInput = document.getElementById("start-line-size");

    loadWindFromURL();
    nameinput = document.getElementById("editor-wind-name");
    windtext = document.getElementById("editor-wind");
    validtext = document.getElementById("wind-valid");
    windtext.addEventListener("input", function () {
        checkErrors();
        updatePreview();
    });

    saveWindBtn = document.getElementById("editor-save");
    deleteWindBtn = document.getElementById("delete-btn");
    shareBtn = document.getElementById("share-btn");

    saveWindBtn.addEventListener("click", editorSaveClick);
    deleteWindBtn.addEventListener("click", deleteClick);
    shareBtn.addEventListener("click", shareBtnClick);

    windReadOnlyText = document.getElementById("wind-readonly-text");

    mapHeight.addEventListener("change", updatePreview);

    document.getElementById("load-wind-save").addEventListener("click", function () {
        console.log(newwind)
        wind[wind.length] = newwind;
        saveWind();
        windChange();
        addWind();
    });

    var editModal = document.getElementById("wind-editor-window");
    editModal.addEventListener("hidden.bs.modal", function () {
        removeEventListener("resize", updatePreview);
    })
}

function checkErrors() {
    var windtmp = splitWind(windtext.value);
    var errors = [];
    var c = 0;
    for (var i = 0; i < windtmp.length; i++) {
        if (isNaN(parseInt(windtmp[i]))) {
            if (windtmp[i] != "") {
                errors.push({
                    type: errorTypes.notnumber,
                    text: '"' + windtmp[i] + '" ' + errortexts.notnumber,
                    char: c
                });
            }
        }
        c += windtmp[i].length + 1;
    }

    if (errors.length > 0) {
        var notnambercount = 0;
        var numberspaces = 0;
        for (var i = 0; i < errors.length; i++) {
            if (errors[i].type == errorTypes.numberisspace) {
                numberspaces++;
            }
            notnambercount++;
        }
        if (errors[0].type == errorTypes.notnumber) {
            validtext.innerText = errors[0].text + "\n";
        }
    } else {
        validtext.innerText = "";
    }
}

function updatePreview() {
    var parsedWind = [];
    var size = Math.round((parseInt(mapHeight.value) - 4) / Math.sin(Math.PI / 4));
    var windtmp = splitWind(windtext.value);

    for (var i = 0; i < size; i++) {
        var parsedValue = parseInt(windtmp[i % windtmp.length]);
        if (!isNaN(parsedValue)) {
            parsedWind.push(parsedValue);
        } else {
            parsedWind.push(0);
        }
    }

    var size = Math.round((parseInt(mapHeight.value) - 4) / Math.sin(Math.PI / 4));

    document.getElementById("wind-count").innerText = `${windtmp.length} / ${size}`;

    var editorPreview = document.getElementById("editor-preview");
    editorPreview.innerHTML = "";
    editorPreview.appendChild(getWindSvg(parsedWind, -4, window.innerWidth / 4 - 20, window.innerHeight - 166, 1.5));
}

function deleteClick() {
    if (editIndex != -1) {
        wind.splice(windscenario, 1);

        var scenario = windscenario - 1;
        saveWind();
        windChange();
        addWind();
        windscenariocontrol.selectedIndex = scenario;
        windscenario = scenario;
    }
}

function editorSaveClick() {
    var newwind = {};
    var windIndex = editIndex;

    newwind.name = nameinput.value;
    newwind.type = windTypes.userdefined;
    newwind.wind = splitWind(windtext.value);
    for (var i = 0; i < newwind.wind.length; i++) {
        var parsedValue = parseInt(newwind.wind[i]);
        if (isNaN(parsedValue)) {
            newwind.wind[i] = 0;
        } else {
            newwind.wind[i] = parsedValue;
        }
    }
    newwind.width = formatNumber(parseInt(mapWidth.value), 40);
    newwind.height = formatNumber(parseInt(mapHeight.value), 30);
    newwind.startsize = formatNumber(parseInt(startLineSizeInput.value), 15);
    newwind.stepscount = newwind.wind.length;
    newwind.allowedit = true;
    newwind = formatWind(newwind);
    if (editIndex == -1) {
        wind.splice(wind.length, 0, newwind);
        windscenario = wind.length - 1;
    } else {
        wind[windIndex] = newwind;
        windscenario = windIndex;
    }

    saveWind();
    addWind();
    windscenariocontrol.selectedIndex = windscenario;
    windChange();
}

function formatNumber(num, defaultValue) {
    num = Math.round(num);
    if (isNaN(num)) {
        return defaultValue;
    } else {
        return num;
    }
}

function saveWind() {
    windlist = {};
    windlist.names = [];
    var startI = windPresets.length;
    for (var i = startI; i < wind.length; i++) {
        localStorage.setItem(localStorageNames.wind.toString() + (i - startI).toString(),
            JSON.stringify(wind[i]));
        windlist.names[i - startI] = wind[i].name;
    }

    localStorage.setItem(localStorageNames.windlist, JSON.stringify(windlist));
}

function loadWind() {
    windlist = JSON.parse(localStorage.getItem(localStorageNames.windlist));
    for (var i = 0; i < windPresets.length; i++) {
        wind[i] = windPresets[i];
    }
    var startI = windPresets.length;
    for (var i = 0; i < windlist.names.length; i++) {
        var newwind = JSON.parse(localStorage.getItem(localStorageNames.wind + i.toString()))
        wind[i + startI] = newwind;
        if (newwind.startsize == undefined) {
            newwind.startsize = 15;
        }
    }
}

function formatWind(wind) {
    if (wind.startsize == undefined) {
        wind.startsize = 15;
    }

    return wind;
}

function editorSetReadonlyState(rs) {
    saveWindBtn.disabled = rs;
    deleteWindBtn.disabled = rs;
    windReadOnlyText.hidden = !rs;

    windtext.readOnly = rs;
    nameinput.readOnly = rs;
}

function windEditorStart(iscreate) {
    addEventListener("resize", updatePreview);

    var copyBtn = document.getElementById("copy-btn");

    shareBtn.hidden = true;
    if (iscreate) {
        editIndex = -1
        editorSetReadonlyState(false);
        copyBtn.hidden = true;
    } else {
        editIndex = windscenario;
        if (wind[windscenariocontrol.selectedIndex].type == windTypes.userdefined) {
            editorSetReadonlyState(false);
            shareBtn.hidden = false;
            copyBtn.hidden = false;
        } else {
            editorSetReadonlyState(true);
            copyBtn.hidden = false;
        }
        if (wind[windscenariocontrol.selectedIndex].israndom) {
            copyBtn.hidden = true;
        }
    }

    if (editIndex == -1) {
        var userDefinedIndex = 1;
        for (var i = 0; i < windlist.names.length; i++) {
            if (windlist.names[i].includes("User Defined")) {
                var index = parseInt(windlist.names[i].substring("User Defined ".length))
                userDefinedIndex = index + 1;
            }
        }
        nameinput.value = "User Defined " + userDefinedIndex;

        windtext.value = "0, 0, 0";

    } else {
        mapWidth.value = wind[windscenario].width;
        mapHeight.value = wind[windscenario].height;
        if (wind[windscenario].startsize == undefined) {
            startLineSizeInput.value = 15;
        } else {
            startLineSizeInput.value = wind[windscenario].startsize;
        }

        nameinput.value = wind[windscenario].name;

        windtext.value = "";
        for (var i = 0; i < wind[windscenario].wind.length; i++) {
            windtext.value += wind[windscenario].wind[i].toString();
            if (i != wind[windscenario].wind.length - 1) {
                windtext.value += ", ";
            }
        }
    }

    checkErrors();
    updatePreview();
}
var newwind;
function loadWindFromURL() {
    var hash = location.hash;
    hash = hash.replace("#", "");
    if (hash[0] == "w") {
        hash = hash.replace("w", "");
        hash = decodeURI(hash);
        try {
            newwind = JSON.parse(hash);
            var addWindModal = new bootstrap.Modal("#add-wind-url-window");
            var text = "";
            for (var i = 0; i < newwind.wind.length; i++) {
                text += newwind.wind[i];
                if (i != newwind.wind.length - 1) {
                    text += ", ";
                }
            }
            document.getElementById("add-wind-text").value = text;
            document.getElementById("add-wind-name").value = newwind.name;
            addWindModal.show();
        } catch (err) {
            console.log(err);
        }
    }

    location.hash = "";
    history.pushState("", document.title, window.location.pathname + window.location.search);
}
function shareBtnClick() {
    var text = "https://tss.boats/#w" + JSON.stringify(wind[windscenariocontrol.selectedIndex]);
    text = encodeURI(text);
    navigator.clipboard.writeText(text);
    var tooltip = new bootstrap.Tooltip("shar-btn");
    tooltip.show();
    saveWind();
}

function getTypeIndex(type) {
    for (var i = 0; i < wind.length; i++) {
        if (wind[i].type == type) {
            return i;
        }
    }
}

function splitWind(text) {
    return text.split(/(?:,| |\n)+/);
}

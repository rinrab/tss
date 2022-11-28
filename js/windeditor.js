var nameinput;
var windtext;
var editIndex;

var saveWindBtn;
var deleteWindBtn;

var windReadOnlyText;

var windlist;

var errortexts = {
    notnumber: 'is not number',
    lensmall: 'Lenght is small, minimum lenght is 20 wind changes',
};
var errorTypes = {
    notnumber: 0,
    lensmall: 1,
};


function windInit() {
    if (localStorage.getItem(localStorageNames.windlist) == null) {
        saveWind();
    } else {
        loadWind();
    }
    loadWindFromURL();
    nameinput = document.getElementById("editor-wind-name");
    windtext = document.getElementById("editor-wind");
    var validtext = document.getElementById("wind-valid");
    windtext.addEventListener("input", function () {
        var windtmp = splitWind(windtext.value);
        var errors = [];
        if (windtmp.length < 20) {
            errors[0] = { type: errorTypes.lensmall, text: errortexts.lensmall, char: -1 }
        }
        var c = 0;
        for (var i = 0; i < windtmp.length; i++) {
            if (isNaN(parseInt(windtmp[i]))) {
                errors[errors.length] = { type: errorTypes.notnumber, text: '"' + windtmp[i] + '" ' + errortexts.notnumber, char: c }
            }
            c += windtmp[i].length + 1;
        }

        if (errors.length > 0) {
            var notnambercount = 0;
            var numberspaces = 0;
            var lensm = "";
            if (errors[0].type == errorTypes.lensmall) {
                lensm = errortexts.lensmall;
            }
            for (var i = 0; i < errors.length; i++) {
                if (errors[i].type == errorTypes.numberisspace) {
                    numberspaces++;
                }
                notnambercount++;
            }
            validtext.innerText =
                `You have ${errors.length} error${(errors.length > 1) ? "s" : ""} in wind. ${lensm}\n`;
            for (var i = 0; i < errors.length; i++) {
                if (errors[i].type == errorTypes.notnumber) {
                    validtext.innerText += errors[i].text + "\n";
                }
                // windtext.value += 
            }
            validtext.className = "invalid-feedback d-block";
        } else {
            validtext.innerText = "Wind is correct";
            validtext.className = "valid-feedback d-block";
        }
    });

    saveWindBtn = document.getElementById("editor-save");
    deleteWindBtn = document.getElementById("delete-btn");

    saveWindBtn.addEventListener("click", editorSaveClick);
    deleteWindBtn.addEventListener("click", deleteClick);

    windReadOnlyText = document.getElementById("wind-readonly-text");
}

function deleteClick() {
    if (editIndex != -1) {
        wind.splice(windscenario, 1);

        windscenariocontrol.selectedIndex = 0;
        saveWind();
        windChange();
        addWind();
    }

}

function editorSaveClick() {
    var newwind = {};
    var windIndex = editIndex;

    newwind.name = nameinput.value;
    newwind.type = windTypes.userdefined;
    newwind.wind = splitWind(windtext.value);
    for (var i = 0; i < newwind.wind.length; i++) {
        newwind.wind[i] = parseInt(newwind.wind[i])
    }
    newwind.height = 30; //todo
    newwind.width = 30; //todo
    newwind.stepscount = newwind.wind.length;
    newwind.allowedit = true;
    if (editIndex == -1) {
        wind.splice(wind.length, 0, newwind);
    } else {
        wind[windIndex] = newwind;
    }
    windscenario = windIndex;

    saveWind();
    windChange();
    addWind();
}
function saveWind() {
    windlist = {};
    windlist.names = [];
    var startI = 0;
    while ((startI < wind.length)
        && (wind[startI].type == windTypes.presets)) {
        startI++;
    }
    for (var i = startI; i < wind.length; i++) {
        localStorage.setItem(localStorageNames.wind.toString() + (i - startI).toString(),
            JSON.stringify(wind[i]));
        windlist.names[i - startI] = wind[i].name;
    }

    localStorage.setItem(localStorageNames.windlist, JSON.stringify(windlist));
}

function loadWind() {
    windlist = JSON.parse(localStorage.getItem(localStorageNames.windlist));
    var startI = wind.length;
    for (var i = 0; i < windlist.names.length; i++) {
        var newwind = JSON.parse(localStorage.getItem(localStorageNames.wind + i.toString()))
        wind[i + startI] = newwind;
    }
}
function editorSetReadonlyState(rs) {
    saveWindBtn.disabled = rs;
    deleteWindBtn.disabled = rs;
    windReadOnlyText.hidden = !rs;

    windtext.readOnly = rs;
    nameinput.readOnly = rs;
}

function windEditorStart(iscreate) {
    if (iscreate) {
        editIndex = -1
        editorSetReadonlyState(false);
    } else {
        editIndex = windscenario;
        if (wind[windscenariocontrol.selectedIndex].type == windTypes.userdefined) {
            editorSetReadonlyState(false);
        } else {
            editorSetReadonlyState(true);
        }
    }

    if (editIndex == -1) {
        nameinput.value = "User Defined " + (windlist.names.length + 1);
        // TODO: | разпознование количетва User defined чтобы не было 
        // TODO: | * User defined 1
        // TODO: | * Named wind
        // TODO: | * User defined 3

        windtext.value = "";

    } else {
        nameinput.value = wind[windscenario].name;

        windtext.value = "";
        for (var i = 0; i < wind[windscenario].wind.length; i++) {
            windtext.value += wind[windscenario].wind[i].toString();
            if (i != wind[windscenario].wind.length - 1) {
                windtext.value += ", ";
            }
        }
    }
}

function loadWindFromURL() {
    var hash = location.hash;
    hash = hash.replace("#", "");
    if (hash[0] == "w") {
        hash = hash.replace("w", "");
        hash = decodeURI(hash);
        console.log(hash);
        try {
            var newwind = JSON.parse(hash);
            var addWindModal = new bootstrap.Modal("#add-wind-url-window");
            var text = "";
            for (var i = 0; i < newwind.wind.length; i++) {
                text += newwind.wind[i];
                if (i != newwind.length - 1) {
                    text += ", ";
                }
            }
            document.getElementById("add-wind-text").value = text;
            document.getElementById("add-wind-name").value = newwind.name;
            addWindModal.show();
            wind[wind.length] = newwind;
        } catch (err) {
            console.log(err);
        }
    }

    location.hash = "";
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

const _lang = navigator.language || navigator.userLanguage;
const curLang = (_lang == "ru" || _lang == "ru-RU") ? "ru" : "en";

const langText = {
    "start-procedure": { "en": "Start procedure", "ru": "Стартовая процедура" },
    "add-player": { "en": "Add player", "ru": "Добавить игрока" },
    "start": { "en": "Start!", "ru": "Старт!" },
    "start-l": { "en": "L", "ru": "Л" },
    "start-m": { "en": "M", "ru": "Ц" },
    "start-r": { "en": "R", "ru": "П" },
    "start-left": { "en": "Start left", "ru": "Стартовать слева" },
    "start-middle": { "en": "Start middle", "ru": "Стартовать с центра" },
    "start-right": { "en": "Start right", "ru": "Стартовать справа" },
    "forward": { "en": "Forward", "ru": "Вперед" },
    "tack": { "en": "Tack", "ru": "Оверхштаг" },
    "tomark": { "en": "To mark", "ru": "На знак" },
    "player-x": { "en": "Player ", "ru": "Игрок " },
    "name": { "en": "Name", "ru": "Имя" },
    "back": { "en": "Back", "ru": "Назад" },
    "next": { "en": "Next", "ru": "Дальше" },
    "race": { "en": "Race: ", "ru": "Гонка: " },
    "save": { "en": "Save", "ru": "Сохранить" },
    "load": { "en": "Load", "ru": "Загрузить" },
    "cup": { "en": "Cup", "ru": "Кубок" },
    "add players to race": { "en": "Add players to race", "ru": "Добавить игроков в гонку" },
    "reset": { "en": "Reset", "ru": "Сбросить" },
    "do you want to reset cup": { "en": "Do you want to reset cup?", "ru": "Вы хотите сбросить кубок?" },
    "print": { "en": "Print", "ru": "Печать" },
    "export": { "en": "Export", "ru": "Экспортировать" },
    "import": { "en": "Import", "ru": "Импортировать" },
    "close": { "en": "Close", "ru": "Закрыть" },
    "go race": { "en": "Go race", "ru": "Идти в гонку" },
    "cancel": { "en": "Cancel", "ru": "Отмена" },
    "0 excluding": { "en": "No excluding", "ru": "Без выбросов" },
    "1 excluding": { "en": "1 excluding", "ru": "1 выброс" },
    "2 excluding": { "en": "2 excluding", "ru": "2 выброс" },
    "3 excluding": { "en": "3 excluding", "ru": "3 выброс" },
    "name": { "en": "Name", "ru": "Имя" },
    "races": { "en": "Races", "ru": "Гонки" },
    "points": { "en": "Points", "ru": "Очки" },
    "net": { "en": "Net", "ru": "Без выброса" },
    "total": { "en": "Total", "ru": "С выбросом" },
    "ok": { "en": "OK", "ru": "ОК" },
    "add to cup": { "en": "Add to cup", "ru": "Добавить в кубок" },
    "do NOT add to cup": { "en": "Do <b>not</b> add to cup", "ru": "<b>Не</b> добовлять в кубок" },
    "do you want to end race": { "en": "Do you want to end race?", "ru": "Вы хотите закончить гонку?" },
}

function getText(text) {
    if (langText[text]) {
        if (langText[text][curLang]) {
            return langText[text][curLang];
        } else {
            console.warn("Can't find translation for your lang: ", text);
            return langText[text]["en"];
        }
    } else {
        console.warn("Can't find translation: ", text);
        return text;
    }
}

addEventListener("load", () => {
    let elems = document.querySelectorAll("[pn-text]");
    for (let elem of elems) {
        elem.innerText = getText(elem.getAttribute("pn-text"));
    }

    elems = document.querySelectorAll("[pn-html]");
    for (let elem of elems) {
        elem.innerHTML = getText(elem.getAttribute("pn-html"));
    }
});

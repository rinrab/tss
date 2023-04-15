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
}

function getText(text) {
    if (langText[text]) {
        if (langText[text][curLang]) {
            return langText[text][curLang];
        } else {
            console.warn("Can't find translation for your lang: " + text);
            return langText[text]["en"];
        }
    } else {
        console.warn("Can't find translation: " + text);
        return text;
    }
}

addEventListener("load", () => {
    const elems = document.querySelectorAll("[pn-text]");
    for (let elem of elems) {
        elem.innerText = getText(elem.getAttribute("pn-text"));
    }
});

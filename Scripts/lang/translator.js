// Translations coded by Schrottii
// Russian translation by DaGame and gamer256
// German translation by Schrottii

// Translations are found in their own files

// Main translator function
// Maybe the most used function in SC2FMFR now hmm
// Translates the text
// Put full text for common strings (e. g. Loading... or Max)
// shortcuts for uncommon strings that can change (e. g. upgrade descriptions)
function tt(text) {
    switch (game.settings.lang) {
        case "en":
            return tten(text);
            break;
        case "de":
            return trans_de[text] != undefined ? trans_de[text] : tten(text);
            break;
        case "ru":
            return trans_ru[text] != undefined ? trans_ru[text] : tten(text);
            break;
        case "es":
            return trans_es[text] != undefined ? trans_es[text] : tten(text);
            break;
        case "it":
            return trans_it[text] != undefined ? trans_it[text] : tten(text);
            break;
        case "pt":
            return trans_pt[text] != undefined ? trans_pt[text] : tten(text);
            break;
        case "ro":
            return trans_ro[text] != undefined ? trans_ro[text] : tten(text);
            break;
        default:
            return tten(text);
            break;
    }
}

function tten(text) {
    return trans_en[text] != undefined ? trans_en[text] : "MISSING TEXT";
}

// Achievement
function tta(type, text) {
    let fallback = [getAchievementByID(text).title, getAchievementByID(text).description][type];
    if (typeof fallback == "function") fallback = fallback();
    switch (game.settings.lang) {
        case "de":
            return trans_de.ms[text] != undefined ? trans_de.ms[text][type] : fallback;
            break;
        case "ru":
            return trans_ru.ms[text] != undefined ? trans_ru.ms[text][type] : fallback;
            break;
        case "es":
            return trans_es.ms[text] != undefined && trans_es.ms[text][0] != "" ? trans_es.ms[text][type] : fallback;
            break;
        case "it":
            return trans_it.ms[text] != undefined && trans_it.ms[text][0] != "" ? trans_it.ms[text][type] : fallback;
            break;
        case "ro":
            return trans_ro.ms[text] != undefined && trans_ro.ms[text][0] != "" ? trans_ro.ms[text][type] : fallback;
            break;
        default:
            return fallback;
    }
}

// "Translation offer" functon
function tto(offers = { default: "ERROR" }) {
    switch (game.settings.lang) {
        case "en":
            return offers.default;
            break;
        case "de":
            return offers.de != undefined ? offers.de : offers.default;
            break;
        case "ru":
            return offers.ru != undefined ? offers.ru : offers.default;
            break;
        case "es":
            return offers.es != undefined ? offers.es : offers.default;
            break;
        case "ro":
            return offers.ro != undefined ? offers.ro : offers.default;
            break;
        default:
            return offers.default;
            break;
    }
}

function getAchievementByID(id) {
    if (typeof id == "string") id = parseInt(id);
    for (a in game.milestones.achievements) {
        if (game.milestones.achievements[a].id == id) return game.milestones.achievements[a];
    }
    return { "": "" };
}

function gatherAchievementDefaults() {
    let ret = {};
    let name = "";

    for (let a = 1; a < 301; a++) {
        name = "" + a;
        if (name.length == 1) name = "00" + a;
        if (name.length == 2) name = "0" + a;
        ret[name] = [getAchievementByID(a).title, typeof getAchievementByID(a).description == "function" ? getAchievementByID(a).description() : getAchievementByID(a).description];
    }

    return ret;
}
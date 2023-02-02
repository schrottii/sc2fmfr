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
            return trans_en[text] != undefined ? trans_en[text] : "MISSING TEXT";
            break;
        case "de":
            return trans_de[text] != undefined ? trans_de[text] : trans_en[text];
            break;
        case "ru":
            return trans_ru[text] != undefined ? trans_ru[text] : trans_en[text];
            break;
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
    }
}
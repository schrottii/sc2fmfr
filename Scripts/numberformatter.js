function formatThousands(n, prec) {
    let num = new Decimal(n);
    return num.toNumber().toLocaleString("en-us",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: prec
        });
}

var NUM_FORMAT_TYPES = 14;
function formatNumber(x, type, cfg) {
    x = new Decimal(x);

    type = type === undefined ? game.settings.numberFormatType : type;

    if (isNaN(x.toNumber())) {
        return "NaN";
    }

    if (x.gte(new Decimal("1e300e300"))) {
        return "a lot";
    }

    if (x.lt(cfg && cfg.namesAfter ? cfg.namesAfter : 1e6) && type != 9) {
        let prec = cfg && cfg.precision ? cfg.precision : 0;
        return formatThousands(x, prec);
    }

    let numberPrefixes =
    {
        start: ["", "K", "M", "B"],
        ones: ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "N"],
        tens: ["", "Dc", "Vg", "Tg", "Qag", "Qig", "Sxg", "Spg", "Og", "Ng"],
        hundreds: ["", "Ct", "DCt", "TCt", "QaCt", "QiCt", "SxCt", "SpCt", "OcCt", "NCt"],
        thousands: ["", "M", "DM", "TM", "qM", "QM", "sM", "SM", "OM", "NM"]
    };

    let numberPrefixesShort =
    {
        start: ["", "K", "M", "B"],
        ones: ["", "U", "D", "T", "Q", "q", "S", "s", "O", "N"],
        tens: ["", "D", "V", "Tr", "QU", "qu", "Se", "Sp", "Og", "No"],
        hundreds: ["", "C", "B", "t", "Q", "q", "S", "s", "O", "n"],
        thousands: ["", "M", "DM", "TM", "QM", "qM", "SM", "sM", "OM", "NM"]
    };

    let greek = "άαβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
    let letters = "~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let letters2 = "~abcdefghijklmnopqrstuvwxyz".split("");
    let cyrillic = "~абвгдежзийклмнопрстуфхцчшщьюяАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЮЯ".split("");
    let emojis = ["~", "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😎", "😍", "🥰", "😛",
        "😜", "🤑", "😨", "😱", "🥵", "🥶", "🤬", "🤔", "👹", "👺", "👾", "👽", "🙉", "🦮", "🐂", "🐊", "🐬", "🧲", "🎄", "🎨",
        "👕", "🎲", "🎮", "🀄", "🍫", "🍩", "🍰", "🍔", "🔇", "💯"];
    let japanese = "~あびちぢえふげはいじかれものおぱくらせてうわをきよし".split("");
    let chinese = "~啊吧次德俄法个哈一家咖里么你哦怕去人四土五发为西牙中".split("");

    let sigDigits = 2 - x.e % 3;

    if (type === 0 || type === 1) {
        let m = (x.m * Math.pow(10, x.e % 3)).toFixed(sigDigits);
        let pre = type === 0 ? numberPrefixes : numberPrefixesShort;

        if (x.lt(1e12)) {
            return m + " " + pre.start[Math.floor(x.e / 3)];
        }

        let newE = x.e - 3;
        let thousand = Math.floor(newE / 3000) < 10 ? pre.thousands[Math.floor(newE / 3000)] : "[" + formatNumber(Math.floor(newE / 3000)) + "]M";
        return m + " " + thousand +
            pre.hundreds[Math.floor(newE / 300) % pre.hundreds.length] +
            pre.ones[Math.floor(newE / 3) % pre.ones.length] +
            pre.tens[Math.floor(newE / 30) % pre.tens.length];
    }
    if (type >= 4 && type <= 10) {
        let suffixes = type === 4 ? letters : greek;
        if (type === 6) suffixes = cyrillic;
        if (type === 7) suffixes = emojis;
        if (type === 8) suffixes = japanese;
        if (type === 9) suffixes = chinese;
        if (type === 10) suffixes = letters2;
        let order = Math.floor(Math.log(x.e / 3) / Math.log(suffixes.length));
        let remainingE = x.e;
        let suffix = "";

        while (order >= 0) {
            let index = Math.floor(remainingE / Math.pow(suffixes.length, order) / 3);
            suffix += suffixes[index];
            remainingE -= Math.pow(suffixes.length, order) * index * 3;
            order--;
        }

        let m = (x.m * Math.pow(10, x.e % 3)).toFixed(sigDigits);

        return m + " " + suffix;
    }
    if (type === 2) {
        let m = (x.m * Math.pow(10, x.e % 3)).toFixed(sigDigits);
        let e = Math.floor(x.e / 3) * 3;

        return m + "E" + (e >= 1e4 ? formatNumber(e, game.settings.numberFormatType, { namesAfter: 1e9 }) : e.toFixed(0));
    }
    if (type === 3) {
        return x.m.toFixed(x.e < 10000 ? 2 : 0) + "e" + (x.e >= 1e4 ? formatNumber(x.e, game.settings.numberFormatType, { namesAfter: 1e9 }) : x.e.toFixed(0));
    }
    if (type === 11) {
        let m = (x.m * Math.pow(10, x.e % 3)).toFixed(sigDigits);
        let e = Math.floor(x.e / 3) * 3;

        let prefixesLong = tto({
            default: ["", "Kilo", "Mega", "Giga", "Tera", "Peta", "Exa", "Zetta", "Yotta", "Ronna", "Quecca"],
            ru: ["", "Кило", "Мега", "Гига", "Тера", "Пета", "Экса", "Зетта", "Йотта", "Ронна", "Кветта"]
        });
        let prefixes = tto({
            default: ["K", "M", "G", "T", "P", "E", "Z", "Y", "R", "Q"],
            ru: ["к", "М", "Г", "Т", "П", "Э", "З", "Й", "Р", "К"]
        });

        if (e <= prefixesLong.length * 3 - 3) {
            return m + " " + prefixesLong[Math.floor(e / 3)];
        }
        else {
            let newE = e - 3;
            let order = Math.floor(newE / 3 / prefixes.length);
            let quekkas = (order > 1 ? "Q^" + formatNumber(order) : "");
            if (order <= 4) {
                quekkas = "Q".repeat(order);
            }
            return m + " " + prefixes[Math.floor(newE / 3) % prefixes.length] + quekkas;
        }
    }
    if (type === 12) {
        if (x > 0) return tto({
            default: "yes",
            de: "ja",
            ru: "Да"
        });
        else return tto({
            default: "no",
            de: "nein",
            ru: "Нет"
        });;
    }
    if (type === 13) {
        let suffixes = letters
        let order = Math.floor(Math.log(x.e / 3) / Math.log(suffixes.length));
        let remainingE = x.e;
        let suffix = "";

        while (order >= 0) {
            let index = Math.floor(remainingE / Math.pow(suffixes.length, order) / 3);
            suffix += suffixes[index];
            remainingE -= Math.pow(suffixes.length, order) * index * 3;
            order--;
        }

        let pre = numberPrefixesShort;
        let newE = x.e - 3;
        let thousand = Math.floor(newE / 3000) < 10 ? pre.thousands[Math.floor(newE / 3000)] : "[" + formatNumber(Math.floor(newE / 3000)) + "]M";

        return x.m.toFixed(x.e < 10000 ? 2 : 0) + "e" + (x.e >= 1e4 ? formatNumber(x.e, game.settings.numberFormatType, { namesAfter: 1e9 }) : x.e.toFixed(0)) + suffix + "&" + thousand +
            pre.hundreds[Math.floor(newE / 300) % pre.hundreds.length] +
            pre.ones[Math.floor(newE / 3) % pre.ones.length] +
            pre.tens[Math.floor(newE / 30) % pre.tens.length];
    }
}

function formatPercent(d, prec) {
    return formatNumber(d.mul(100), game.settings.numberFormatType, { precision: prec }) + "%";
}

function formatTime(s) {
    if (s < 60) {
        return s.toFixed(0) + "s";
    }
    if (s < 3600) {
        return [Math.floor(s / 60).toFixed(0), ("0" + Math.floor(s % 60).toFixed(0)).slice(-2)].join(":");
    }
}

function formatSuperTime(t) {
    return (t / 86400).toFixed(0) + "d, " + ((t % 86400) / 3600).toFixed(0) + "h, " + (((t % 86400) % 3600) / 60).toFixed(0) + "m";
}
var myMusic;
var isPlaying = 0;
var hePlayed = 0;
var compareStats = {};

var C = "default";

function playmusic(x = 0) {
    if (game.settings.musicSelect != hePlayed) {
        x = 50;
    }
    if (isPlaying == 0) {
        // Define myMusic. Set which song will be played depending on the player progess
        if (game.settings.musicSelect == 0) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("NewerWave.mp3");
        }
        else if (game.settings.musicSelect == 1) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("GettingitDone.mp3");
        }
        else if (game.settings.musicSelect == 2) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("Spellbound.mp3");
        }
        else if (game.settings.musicSelect == 3) {
            hePlayed = game.settings.musicSelect;
            myMusic = new sound("Voltaic.mp3");
        }
    }

    // playmusic(50) will stop the music
    if (x == 50) {
        isPlaying = 0;
        myMusic.pause();
    }
    // music turned off? get the hell outta here!
    if (game.settings.musicOnOff == 0) {
        isPlaying = 0;
        return;
    }

    if (game.settings.musicSelect != hePlayed) {
        hePlayed = game.settings.musicSelect;
        playmusic();
    }

    // for repeating music... code kinda complicated
    if (x == 5) {
        isPlaying = 0;
    }

    // play the music and repeat it
    if (isPlaying != 1) {
        myMusic.play();
        isPlaying = 1;

        if (game.settings.musicSelect == 0) {
            setTimeout(repeatmusic, 175000);
        }
        else if (game.settings.musicSelect == 1) {
            setTimeout(repeatmusic, 210000);
        }
        else if (game.settings.musicSelect == 2) {
            setTimeout(repeatmusic, 230000);
        }
        else if (game.settings.musicSelect == 3) {
            setTimeout(repeatmusic, 200000);
        }
    } //^Wonder what those values are? Duration of the song in ms!
}

function repeatmusic() {
    if (game.settings.musicOnOff == 1) playmusic(5);
}


class Scene
{
    static loadScene(name)
    {
        let scene = scenes.find(scene => scene.name === name);
        if (scene !== undefined)
        {
            currentScene = scene;
        }
        else
        {
            console.warn("Scene \"" + name + "\" does not exist");
        }

        
        if (game.settings.musicOnOff == 0) {
            playmusic(50);
        }
        else {
            playmusic();
        }
    }

    constructor(name, ui, render, onpress, onrelease, cfg)
    {
        this.name = name;
        this.ui = ui;
        this.render = render;
        this.scenePress = onpress ? onpress : function ()
        {
        };
        this.sceneRelease = onrelease ? onrelease : function ()
        {
        };
        this.oncreate = cfg && cfg.oncreate ? cfg.oncreate : this.oncreate;
        this.popupTexts = [];

        this.oncreate();
    }

    oncreate()
    {

    }

    addUI(el)
    {
        this.ui.push(el);
    }

    onPress()
    {
        this.scenePress();

        this.handleUIClick();
    }

    onRelease()
    {
        this.sceneRelease();

        this.handleUIRelease();
    }

    update(delta)
    {
        this.render(delta);

        for (let element of this.ui)
        {
            element.update();
            element.render(ctx);
        }

        for (let p of this.popupTexts)
        {
            p.tick(delta);
            p.render(ctx);
        }

        this.popupTexts = this.popupTexts.filter(text => text.lifeTime < 1);

        
    }

    handleElementAction(element, type)
    {
        if (!element.isGroup)
        {
            if (element.isHovered())
            {
                if(type === 0)
                {
                    element.onclick();
                }
                else
                {
                    element.onrelease();
                }
            }
        }
        else
        {
            if(element.isVisible())
            {
                for (let el of element.uiElements)
                {
                    this.handleElementAction(el, type);
                }
            }
        }
    }

    handleUIClick()
    {
        for (let element of this.ui)
        {
            this.handleElementAction(element, 0);
        }
    }

    handleUIRelease()
    {
        for (let element of this.ui)
        {
            this.handleElementAction(element, 1);
        }
    }
}

function drawStars(amount, size)
{
    for (let i = 0; i < amount; i++)
    {
        let x = (0.5 + 0.5 * Math.sin(i * 675510 + Date.now() / 51234)) * w;
        let y = (0.5 + 0.5 * Math.sin(i * 387450 + Date.now() / 84521)) * h;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(x, y, h / 300 * size, h / 300 * size, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}

function drawCurrencyBar(val, img, offY, width)
{
    let oy = offY !== undefined ? offY : 0;
    let widthTimes = width ? width : 1;

    let xOff = w / 1.75 / 2 * (widthTimes - 1);

    ctx.fillStyle = "#5F7B9F";
    ctx.fillRect(w * 0.25 - xOff, h * 0.2 + oy, w / 1.75 * widthTimes, h * 0.06);

    ctx.font = (h * 0.06) + "px " + fonts.default;
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";

    ctx.fillText(formatNumber(val), w * 0.25 + h * 0.055 - xOff, h * 0.2 + 4 + oy, w / 2.25 * widthTimes);
    ctx.drawImage(img, w * 0.25 - h * 0.03 - xOff, h * 0.19 + oy, h * 0.08, h * 0.08);
}

function getBeamTime() {
    if (game.beams.selected == 0) {
        return "Next Beam in: " + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
    }
    if (game.beams.selected == 1) {
        return "Next Beam in: " + (45 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)).toFixed(0);
    }
    if (game.beams.selected == 2) {
        return "Next Beam in: " + (30 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)).toFixed(0);
    }
    if (game.beams.selected == 3) {
        return "Next Beam in: " + (60 - game.beams.time - applyUpgrade(game.beams.upgrades.fasterBeams)).toFixed(0);
    }
}

var scenes =
    [
        new Scene("Loading",
            [],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table2;
                ctx.fillRect(0, h * 0.1, w, h);

                ctx.drawImage(images.appIcon, w * 0.3, h * 0.25, w * 0.4, w * 0.4);

                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.font = "300 " + (h * 0.06) + "px " + fonts.default;
                ctx.fillText("Scrap II Fanmade FR", w * 0.5, h * 0.02, w * 0.9);
                ctx.fillText("mod made by Schrottii", w * 0.5, h * 0.075, w * 0.45);

                ctx.font = "300 " + (h * 0.05) + "px " + fonts.default;
                ctx.fillText("Loading...", w * 0.5, h * 0.6, w * 0.9);

                ctx.font = "300 " + (h * 0.03) + "px " + fonts.default;
                ctx.textAlign = "right";
                ctx.textBaseline = "bottom";
                ctx.fillText("v2.3 (v3.0)", w * 0.99, h - w * 0.01);

                ctx.textAlign = "center";
                ctx.font = "300 px " + fonts.default;
                ctx.fillText("Made in 3 days", w * 0.49, h - w * 0.1);

            }),
        new Scene("Barrels",
            [
                new UIButton(0.125, 0.73, 0.05, 0.05, images.upgrades.betterBarrels, function () {
                    game.scrapUpgrades.betterBarrels.buy();
                }, { quadratic: true }),
                new UIButton(0.75, 0.73, 0.05, 0.05, images.ezUpgrade, function () {
                    let GoTo = prompt("Which barrel do you want to go to?");
                    GoTo = Math.round(GoTo - 1);
                    if (GoTo < 0) {
                        alert("Too low!");
                        return;
                    }
                    if (GoTo < game.scrapUpgrades.betterBarrels.maxLevel) {
                        game.scrapUpgrades.betterBarrels.buyToTarget(GoTo);
                        Scene.loadScene("Barrels");
                    }
                    else {
                        alert("Too high!");
                    }
                }, {
                    isVisible: () => game.skillTree.upgrades.superEzUpgrader.level > 0,
                    quadratic: true
                }),
                new UIButton(0.125, 0.81, 0.05, 0.05, images.upgrades.fasterBarrels, function () {
                    game.scrapUpgrades.fasterBarrels.buy();
                }, { quadratic: true }),



                new UIButton(0, 0.97, 0.15, 0.06, images.scenes.dimension, () => Scene.loadScene("SecondDimension"), {
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.SECOND_DIMENSION,
                    quadraticMin: true, anchor: [0, 0.5]
                }),
                new UIButton(0.2, 0.97, 0.15, 0.06, images.scenes.barrelGallery, () => Scene.loadScene("BarrelGallery"), { quadraticMin: true }),
                new UIButton(0.4, 0.97, 0.15, 0.06, images.scenes.steelBeams, () => Scene.loadScene("Beams"), {
                    isVisible: () => game.beams.isUnlocked(),
                    quadraticMin: true
                }),
                new UIButton(0.6, 0.97, 0.15, 0.06, images.scenes.fragment, () => Scene.loadScene("Fragment"),
                    {
                        isVisible: () => game.highestBarrelReached >= 100,
                        quadraticMin: true
                    }),
                new UIButton(0.8, 0.97, 0.15, 0.06, images.scenes.goldenScrap, () => Scene.loadScene("GoldenScrap"),
                    {
                        isVisible: () => game.highestScrapReached.gte(1e15),
                        quadraticMin: true
                    }),
                new UIButton(1, 0.97, 0.15, 0.06, images.scenes.solarSystem, () => Scene.loadScene("SolarSystem"),
                    {
                        isVisible: function () {
                            return game.goldenScrap.upgrades.scrapBoost.level >= 8;
                        },
                        quadraticMin: true,
                        anchor: [1, 0.5]
                    }),


                new UIButton(0.1, 0.9, 0.05, 0.05, images.scenes.magnet, () => Scene.loadScene("MagnetUpgrades"), { quadratic: true }),
                new UIButton(0.25, 0.9, 0.05, 0.05, images.scenes.options, () => Scene.loadScene("Options"), { quadratic: true }),
                new UIButton(0.4, 0.9, 0.05, 0.05, images.scenes.milestones, () => Scene.loadScene("Milestones"), { quadratic: true }),
                new UIButton(0.55, 0.9, 0.05, 0.05, images.buttonMaxAll, () => maxScrapUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.earth.level >= 1
                    }),
                new UICheckbox(0.85, 0.9, 0.05, 0.05, "game.settings.autoConvert", {
                    isVisible: () => game.highestBarrelReached >= 300,
                    quadratic: true,
                    off: images.checkbox.autoConvert.off,
                    on: images.checkbox.autoConvert.on,
                }),
                new UICheckbox(0.7, 0.9, 0.05, 0.05, "game.settings.autoMerge", {
                    isVisible: () => game.ms.includes(5),
                    quadratic: true,
                    off: images.checkbox.autoMerge.off,
                    on: images.checkbox.autoMerge.on,
                }),


                new UIText(() => game.scrapUpgrades.betterBarrels.getPriceDisplay(), 0.125, 0.76, 0.035, "black", { bold: true }),
                new UIText(() => "Better Barrels (" + game.scrapUpgrades.betterBarrels.level.toFixed(0) + "/" + game.scrapUpgrades.betterBarrels.maxLevel + "):\nBarrels spawn 1 Tier higher", 0.225, 0.74, 0.03, "black", { halign: "left", valign: "middle" }),
                new UIText(() => game.scrapUpgrades.fasterBarrels.getPriceDisplay(), 0.125, 0.84, 0.035, "black", { bold: true }),
                new UIText(() => "Faster Barrels:\nBarrels spawn faster\n" + game.scrapUpgrades.fasterBarrels.getEffectDisplay(), 0.225, 0.82, 0.03, "black", { halign: "left", valign: "middle" }),

                new UIText(() => "+" + formatNumber(Barrel.getGlobalIncome()) + "/s", 0.3, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.settings.beamTimer == true) { return getBeamTime() } else { return " " } }, 0.725, 0.02, 0.03, "white", { bold: true }),
                new UIText(() => { if (game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0) { return "Next Storm Chance In " + (60 - gsStormTime.toFixed(0)) + "s" } else { return " " } }, 0.725, 0.0775, 0.03, "white", { bold: true }),
            ],
            function (delta) {
                for (let i = 0, l = barrels.length; i < l; i++) {
                    if (barrels[i] !== undefined) {
                        barrels[i].tick(delta);
                    }
                }

                incomeTextTime.cooldown += delta;
                if (incomeTextTime.cooldown >= incomeTextTime.time) {
                    for (let b of barrels) {
                        if (b !== undefined) {
                            b.createIncomeText();
                        }
                    }
                    incomeTextTime.cooldown = 0;
                }

                if (draggedBarrel !== undefined) {
                    draggedBarrel.scale = 1.1;
                }

                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
                ctx.lineWidth = 0;

                ctx.fillStyle = colors[C].bgFrontD;
                ctx.fillRect(0, h * 0.857, w, h * 0.0075);
                ctx.fillRect(0, h * 0.696, w, h * 0.0075);
                ctx.fillRect(0, h * 0.098, w, h * 0.0075);
                ctx.fillRect(0, h * 0.935, w, h * 0.01);

                ctx.fillStyle = colors[C].bgFront;
                ctx.fillRect(0, 0, w, h * 0.1);
                ctx.fillRect(0, h * 0.94, w, h * 0.06);

                ctx.fillStyle = "#003E8F";
                ctx.fillRect(w * 0.1, h * 0.04, w / 2.5, h * 0.04);
                ctx.fillRect(w * 0.92, h * 0.04, -w / 2.75, h * 0.04);

                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textBaseline = "top";
                ctx.textAlign = "left";
                ctx.fillStyle = "white";

                // barrels1, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE
                ctx.drawImage(images.scrap, w * 0.1 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);
                ctx.fillText(formatNumber(game.scrap), w * 0.15, h * 0.043, w / 3);

                ctx.textAlign = "right";
                ctx.fillText(formatNumber(game.magnets, game.settings.numberFormatType, { namesAfter: 1e9 }), w * 0.85, h * 0.043, w / 3.5);
                ctx.drawImage(images.magnet, w * 0.9 - h * 0.0275, h * 0.0325, h * 0.055, h * 0.055);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(0, h * 0.7, w, h * 0.08);
                ctx.fillStyle = colors[C].table2;
                ctx.fillRect(0, h * 0.78, w, h * 0.08);

                for (let i = 0, l = barrels.length; i < l; i++) {
                    if (barrels[i] !== undefined && barrels[i].scale >= 1 || barrels[i] === undefined) {
                        tempDrawnBarrels[i] = undefined;
                    }
                }

                let barrelSize = Barrel.getBarrelSize();
                for (let i = 0, l = barrels.length; i < l; i++) {
                    let x = w / 2 + (barrelSize * 1.1 * (i % 4)) - (barrelSize * 1.1 * 1.5);
                    let y = h / 2 + (barrelSize * 1.15 * Math.floor(i / 4)) - (barrelSize * 1.15 * 2.6) - h * 0.03;

                    ctx.fillStyle = "rgb(127, 127, 127)";

                    if (barrels[i] === undefined && tempDrawnBarrels[i] === undefined || (barrels[i] !== undefined && barrels[i].scale < 1) && tempDrawnBarrels[i] === undefined) {
                        ctx.drawImage(images.barrelTemplate, x - barrelSize / 2, y - barrelSize / 2, barrelSize, barrelSize);
                    }
                    if (!game.settings.lowPerformance && tempDrawnBarrels[i] !== undefined && (barrels[i] !== undefined && barrels[i].scale < 1)) {
                        Barrel.renderBarrel(ctx, tempDrawnBarrels[i], x, y, barrelSize);
                    }
                    if (barrels[i] !== undefined) {
                        barrels[i].setCoord(x, y);
                        barrels[i].render(ctx);
                    }
                }

                if (draggedBarrel != null) {
                    draggedBarrel.setCoord(mouseX, mouseY);
                    draggedBarrel.render(ctx);
                }

                ctx.fillStyle = "black";
            },
            function () {
                for (let i = 0; i < barrels.length; i++) {
                    let b = barrels[i];
                    if (b != null && b.isClicked()) {
                        draggedBarrel = b;
                        if (timeSinceLastBarrelClick <= 0.2 && lastClickedBarrel === i && game.settings.destroyBarrels) {
                            if (game.fragment.isUnlocked() == true) {
                                if (game.dimension == 0) {
                                    game.fragment.amount = game.fragment.amount.add(((barrels[i].level / 10) * game.skillTree.upgrades.moreFragments.getEffect(game.skillTree.upgrades.moreFragments.level) * game.darkfragment.upgrades.moreFragments.getEffect(game.darkfragment.upgrades.moreFragments.level)));
                                }
                                else if (game.dimension == 1) {
                                    game.darkfragment.amount = game.darkfragment.amount.add(((barrels[i].level / 10)));
                                }
                            }
                            barrels[i] = undefined;
                            draggedBarrel = undefined;
                            lastClickedBarrel = -1;
                        }
                        else {
                            lastClickedBarrel = i;
                            timeSinceLastBarrelClick = 0;
                            draggedBarrel.originPos = i;
                            barrels[i] = undefined;
                        }
                    }
                }
            },
            function () {
                if (draggedBarrel != null) {
                    let index = draggedBarrel.getDropIndex();
                    if (index !== -1) {
                        let b = barrels[index];
                        if (b !== undefined) {
                            let lvl = barrels[index].level;
                            if (Math.round(lvl) === Math.round(draggedBarrel.level)) {
                                tempDrawnBarrels[index] = draggedBarrel.level;
                                barrels[index] = new Barrel(draggedBarrel.level + 1);
                                onBarrelMerge(false, Math.round(draggedBarrel.level));
                                draggedBarrel = undefined;
                            }
                            else {
                                barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                                barrels[draggedBarrel.originPos].scale = 0.7;
                                draggedBarrel = undefined;
                            }
                        }
                        else {
                            barrels[index] = draggedBarrel;
                            draggedBarrel = undefined;
                        }
                    }
                    else {
                        barrels[draggedBarrel.originPos] = new Barrel(draggedBarrel.level);
                        barrels[draggedBarrel.originPos].scale = 0.7;
                        draggedBarrel = undefined;
                    }
                }
            }),
        new Scene("MagnetUpgrades",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIText("Magnet Upgrades", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIMagnetUpgrade(game.magnetUpgrades.scrapBoost, images.upgrades.moreScrap, 0.4, "Get More Scrap"),
                new UIMagnetUpgrade(game.magnetUpgrades.moreGoldenScrap, images.upgrades.goldenScrapBoost, 0.5, "Get More Golden Scrap", colors[C].table2),
                new UIMagnetUpgrade(game.magnetUpgrades.magnetMergeChance, images.upgrades.magnetChance, 0.6, "Increase the Chance to\nget Magnets by merging"),
                new UIGroup(
                    [
                        new UIMagnetUpgrade(game.magnetUpgrades.autoMerger, images.upgrades.fasterAutoMerge, 0.7, "Increase Auto Merge Speed", colors[C].table2)
                    ], () => game.milestones.achievements[6].isUnlocked()),
                new UIMagnetUpgrade(game.magnetUpgrades.brickSpeed, images.upgrades.brickSpeed, 0.8, "Less Merges are needed\nto double Brick\nproduction.", colors[C].table, () => applyUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed)),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.magnets, images.magnet);
            }),
        new Scene("GoldenScrap",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.goldenScrap, () => {
                    if (game.goldenScrap.getResetAmount().gt(0)) {
                        game.goldenScrap.reset();
                    }
                }, { quadratic: true }),
                new UIText("Golden Scrap", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => "Reset your Scrap Upgrades\nand current Scrap to get \n+" + formatNumber(game.goldenScrap.getResetAmount(), game.settings.numberFormatType, { namesAfter: 1e10 }) + " Golden Scrap\n" +
                    "Each Golden Scrap yields +" + formatPercent(applyUpgrade(game.solarSystem.upgrades.mercury), 0) + " more Scrap.\n" +
                    "Click the Button below to reset.\n\n", 0.5, 0.2, 0.04, "black"),
                new UIText(() => "$images.goldenScrap$" + formatNumber(game.goldenScrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }) +
                    " → +" + formatPercent(game.goldenScrap.getBoost().sub(1), game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.scrapBoost, images.upgrades.moreScrap, 0.65, "Get More Scrap"),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.75, "Get More Magnets", colors[C].table2),
                new UIGoldenScrapUpgrade(game.goldenScrap.upgrades.gsBoost, images.upgrades.moreGS, 0.85, "Get More GS"),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("SecondDimension",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.5, 0.5, 0.15, 0.15, images.scenes.dimension, () => {
                    if (game.dimension == 0) { //Enter Dimension
                        if (game.goldenScrap.amount * 2 < new Decimal(1e20) * 2) {
                            alert("You need at least " + formatNumber(new Decimal(1e20)) + " Golden Scrap to enter!");
                        }
                        else {
                            game.dimension = 1;

                            setBarrelQuality(game.settings.barrelQuality);
                            for (let i = 0; i < barrels.length; i++) {
                                barrels[i] = undefined;
                            }
                            draggedBarrel = undefined;

                            game.scrap = new Decimal(0);
                            game.scrapThisPrestige = new Decimal(0);

                            for (let upg of Object.keys(game.scrapUpgrades)) {
                                game.scrapUpgrades[upg].level = 0;
                            }
                            game.settings.barrelGalleryPage = 0;
                            Scene.loadScene("Barrels");
                        }
                    }
                    else if (game.dimension == 1) { //Leave Dimension
                        var currentHighest = calculateCurrentHighest();
                        var NEED = 7 * (Math.log(game.goldenScrap.amount) * Math.LOG10E + 1 | 0);
                        if (Math.round(currentHighest) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost)) < NEED) {
                            if (confirm("You have to earn at least " + NEED + " Dark Scrap to leave and earn something!\n" +
                                "Current: " + Math.round(currentHighest) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost)) + "\n" +
                                "You can leave now, but you will not earn anything. Press OK to leave early.")) {
                                NEED = -10;
                            }

                        }
                        if (Math.round(currentHighest) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost)) >= NEED) {
                            game.dimension = 0;


                            game.darkscrap.amount = game.darkscrap.amount.add((Math.round(currentHighest) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost))));
                            game.stats.totaldarkscrap = game.stats.totaldarkscrap.add((Math.round(currentHighest) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost))));

                            setBarrelQuality(game.settings.barrelQuality);
                            for (let i = 0; i < barrels.length; i++) {
                                barrels[i] = undefined;
                            }
                            draggedBarrel = undefined;

                            game.scrap = new Decimal(0);
                            game.goldenScrap.amount = new Decimal(0);
                        }
                    }
                }, { quadratic: true }),
                new UIText("Second Dimension", 0.5, 0.1, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return "Sacrifice your Golden Scrap and enter the Second Dimension\n you will keep it until you return\n" +
                            "Click the Button below to enter the Second Dimension.\n\n";
                    }
                    else {
                        return "Progress to get Dark Scrap and destroy to get Dark Fragments.\n" +
                            "Click the Button below to leave the Second Dimension.\n\n" +
                            "Earn: " + (Math.round(calculateCurrentHighest()) * (applyUpgrade(game.darkscrap.upgrades.darkScrapBoost))).toFixed(0);
                    }
                }, 0.5, 0.2, 0.025, "black"),

                new UIText(() => "You get " + applyUpgrade(game.darkscrap.upgrades.goldenScrapBoost).toFixed(2) + "% more Golden Scrap for every Dark Scrap you have.\n" +
                    "You get a total boost of x" + formatNumber((1 + (applyUpgrade(game.darkscrap.upgrades.goldenScrapBoost) * game.darkscrap.amount)) ) + "!", 0.5, 0.3, 0.025, "black"),

                new UIText(() => "$images.darkscrap$" + formatNumber(game.darkscrap.amount, game.settings.numberFormatType, { namesAfter: 1e10 }), 0.1, 0.38, 0.05, "black", { halign: "left", valign: "middle" }),

                new UIDarkScrapUpgrade(game.darkscrap.upgrades.darkScrapBoost, images.upgrades.moreDarkScrap, 0.65, "Get More Dark Scrap"),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.mergeTokenBoost, images.upgrades.moreMergeTokens, 0.75, "Get More Merge Tokens", colors[C].table2),
                new UIDarkScrapUpgrade(game.darkscrap.upgrades.goldenScrapBoost, images.upgrades.moreGS, 0.85, "GS Boost from Dark Scrap"),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.35, w * 0.9, h * 0.06);
            }),
        new Scene("Fragment",
            [
                new UIText("Barrel Fragments", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),


                new UIText(() => {
                    if (game.dimension == 0) {
                        return "Fragments can be earned by destroying barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + (((parseInt(game.scrapUpgrades.betterBarrels.level) / 10) * game.skillTree.upgrades.moreFragments.getEffect(game.skillTree.upgrades.moreFragments.level) * game.darkfragment.upgrades.moreFragments.getEffect(game.darkfragment.upgrades.moreFragments.level))).toFixed(1) + " fragments."
                    }
                    if (game.dimension == 1) {
                        return "Dark Fragments can be earned by destroying dark barrels.\nFor destroying barrel " + (parseInt(game.scrapUpgrades.betterBarrels.level) + 1) + " you get " + (((parseInt(game.scrapUpgrades.betterBarrels.level) / 10))).toFixed(1) + " dark fragments."
                    }
                }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.fragment$ Barrel Fragments: " + formatNumber(game.fragment.amount), 0.5, 0.3, 0.04, "yellow"),
                new UIFragmentUpgrade(game.fragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.45, "Get More Scrap"),
                new UIFragmentUpgrade(game.fragment.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.55, "Get More Magnets", colors[C].table2),

                new UIText(() => {
                    if (game.darkfragment.isUnlocked()) {
                        return "$images.darkfragment$ Dark Fragments: " + formatNumber(game.darkfragment.amount);
                    }
                    else {
                        return "";
                    }
                }, 0.5, 0.65, 0.04, "yellow"),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.scrapBoost, images.upgrades.moreScrap, 0.75, "Get More Scrap in 2. Dim.", 0, 
                    () => { return game.darkfragment.isUnlocked() }),
                new UIDarkFragmentUpgrade(game.darkfragment.upgrades.moreFragments, images.upgrades.moreFragments, 0.85, "Get More Fragments", colors[C].table2, 
                    () => { return game.darkfragment.isUnlocked() }),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
                if (game.darkfragment.isUnlocked()) {
                    ctx.fillRect(w * 0.05, h * 0.638, w * 0.9, h * 0.06);
                }
            }),
        new Scene("BarrelGallery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),
                new UIButton(0.25, 0.9, 0.1, 0.1, images.arrows.left, () => game.settings.barrelGalleryPage = Math.max(0, game.settings.barrelGalleryPage - 1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.75, 0.9, 0.1, 0.1, images.arrows.right, () => {
                    game.settings.barrelGalleryPage = Math.min(game.barrelGallery.getMaxPage(), game.settings.barrelGalleryPage + 1);
                }, {
                    quadratic: true,
                    isVisible: () => game.settings.barrelGalleryPage < game.barrelGallery.getMaxPage()
                }),
                new UIButton(0.5, 0.9, 0.1, 0.1, images.searchbutton, () => {
                    let GoTo = parseInt(prompt("Which barrel do you want to go to?")); 
                    GoTo = Math.floor(GoTo);
                    if (GoTo < 1) GoTo = 1;
                    if (GoTo == game.scrapUpgrades.betterBarrels.level + 1) {
                        if (game.ms.includes(120) == false) {
                            game.ms.push(120);
                            GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[120]));
                        }
                    }
                    game.settings.barrelGalleryPage = Math.floor((GoTo-1) / 20);
                }, {
                    quadratic: true,
                    isVisible: () => game.highestBarrelReached > 99
                }),
                new UIButton(0.1, 0.9, 0.1, 0.1, images.arrows.left_2, () => game.settings.barrelGalleryPage = 0,
                    {
                        quadratic: true,
                        isVisible: () => game.settings.barrelGalleryPage > 0
                    }),
                new UIButton(0.9, 0.9, 0.1, 0.1, images.arrows.right_2, () => {
                    game.settings.barrelGalleryPage = game.barrelGallery.getMaxPage();
                }, {
                    quadratic: true,
                    isVisible: () => game.settings.barrelGalleryPage < game.barrelGallery.getMaxPage()
                }),
                new UIText("Barrels", 0.5, 0.05, 0.1, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => formatThousands(20 * game.settings.barrelGalleryPage + 1) + "-" + formatThousands(20 * game.settings.barrelGalleryPage + 20), 0.5, 0.125, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.003,
                    font: fonts.title
                })
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                for (let i = 0; i < 4; i++) {
                    ctx.fillStyle = [colors[C].table, colors[C].bg][i % 2];
                    ctx.fillRect(0, h * 0.1875 + h * 0.15 * i, w, h * 0.15);
                }
                let maxLvl = Math.min(20 * game.settings.barrelGalleryPage + 20, Math.round(Barrel.getMaxLevelBarrel()) + 1);
                for (let i = 20 * game.settings.barrelGalleryPage; i < 20 * game.settings.barrelGalleryPage + 20; i++) {
                    let c = i - 20 * game.settings.barrelGalleryPage; //used for coordinates
                    let x = (0.15 + 0.7 * (c % 5) / 4) * w;
                    let y = h * 0.15 * Math.floor(c / 5) + h * 0.25;

                    let drawPreview = maxLvl <= i;

                    let size = Math.min(w * 0.19, h * 0.1);
                    Barrel.renderBarrel(ctx, i, x, y, size, drawPreview);

                    ctx.fillStyle = "black";
                    ctx.font = "bold " + (h * 0.025) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    if (!drawPreview) {
                        ctx.fillText(i+1, x, y - h * 0.065, w * 0.15);
                        ctx.fillText(formatNumber(Barrel.getIncomeForLevel(i)), x, y + h * 0.06, w * 0.15);
                    }
                }
            }),
        new Scene("SolarSystem",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIButton(0.9, 0.2, 0.07, 0.07, images.scenes.mergeQuests, () => Scene.loadScene("MergeQuests"), {
                    quadratic: true,
                    isVisible: game.mergeQuests.isUnlocked
                }),
                new UIButton(0.9, 0.1, 0.07, 0.07, images.scenes.mergeMastery, () => Scene.loadScene("MergeMastery"), {
                    quadratic: true,
                    isVisible: game.mergeMastery.isUnlocked
                }),
                new UIButton(0.9, 0.3, 0.07, 0.07, images.scenes.bricks, () => Scene.loadScene("Bricks"), {
                    quadratic: true,
                    isVisible: game.bricks.isUnlocked
                }),
                new UIButton(0.9, 0.4, 0.07, 0.07, images.scenes.tires, () => Scene.loadScene("Tires"), {
                    quadratic: true,
                    isVisible: game.tires.isUnlocked
                }),
                new UIButton(0.9, 0.5, 0.07, 0.07, images.scenes.skillTree, () => Scene.loadScene("SkillTree"), {
                    quadratic: true,
                    isVisible: game.skillTree.isUnlocked
                }),
                new UIButton(0.9, 0.6, 0.07, 0.07, images.scenes.wrenches, () => Scene.loadScene("Wrenches"), {
                    quadratic: true,
                    isVisible: game.wrenches.isUnlocked
                }),
                new UIButton(0.9, 0.7, 0.07, 0.07, images.scenes.statistics, () => Scene.loadScene("Statistics"), {
                    quadratic: true
                }),
                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("OuterSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER
                }),

                new UIPlanet(0.5, 0.5, "Sun\nIncrease Scrap production", game.solarSystem.upgrades.sun, "$images.magnet$", images.solarSystem.sun, 0.13),
                new UIPlanet(0.7, 0.725, "Mercury\nIncrease Golden\nScrap Boost", game.solarSystem.upgrades.mercury, "$images.magnet$", images.solarSystem.mercury, 0.035),
                new UIPlanet(0.3, 0.325, "Venus\nIncrease Double\nSpawn Chance", game.solarSystem.upgrades.venus, "$images.scrap$", images.solarSystem.venus, 0.055),
                new UIPlanet(0.65, 0.2, "Earth\nUnlock new Stuff", game.solarSystem.upgrades.earth, "$images.goldenScrap$", images.solarSystem.earth, 0.055),
                new UIPlanet(0.2, 0.825, () => "Mars\nFalling Magnets\n" + formatNumber(getMagnetBaseValue()
                    .mul(5)) + " each", game.solarSystem.upgrades.mars, "$images.fragment$", images.solarSystem.mars, 0.04, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS), //whoever did not put a , there before I hate U!!!

                new UIButton(0.6, 0.5, 0.05, 0.05, images.buttonMaxAll, () => maxSunUpgrades(),
                    {
                        quadratic: true,
                        isVisible: () => game.solarSystem.upgrades.sun.level >= 250
                    }),
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);

                if (!game.settings.lowPerformance) {
                    drawStars(10, 2);
                    drawStars(40, 1);
                }
            }),
        new Scene("OuterSolarSystem",
            [
                new UIButton(0.1, 0.1, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIPlanet(0.4, 0.6, "Jupiter\nCheaper Magnet Upgrades", game.solarSystem.upgrades.jupiter, "$images.mergeToken$", images.solarSystem.jupiter, 0.075, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_JUPITER),
                new UIPlanet(0.8, 0.7, "Saturn\nAuto Merge", game.solarSystem.upgrades.saturn, "$images.scrap$", images.solarSystem.saturn, 0.07, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_SATURN),
                new UIPlanet(0.8, 0.25, "Uranus\nStronger Merge Mastery\nScrap Boost", game.solarSystem.upgrades.uranus, "$images.magnet$", images.solarSystem.uranus, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_URANUS),
                new UIPlanet(0.25, 0.3, "Neptune\nPassive Magnet income", game.solarSystem.upgrades.neptune, "$images.tire$", images.solarSystem.neptune, 0.06, () => game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_NEPTUNE),

                new UIButton(0.9, 0.9, 0.07, 0.07, images.zoomOut, () => Scene.loadScene("ThirdSolarSystem"), {
                    quadratic: true,
                    isVisible: () => game.solarSystem.upgrades.neptune.level > 4,
                })
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(100, 0.5);
                }
                ctx.drawImage(images.solarSystem.inner, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("ThirdSolarSystem",
            [
                new UIButton(0.1, 0.1, 0.07, 0.07, images.zoomIn, () => Scene.loadScene("OuterSolarSystem"), { quadratic: true }),
                new UIPlanet(0.4, 0.6, "Astro\nAuto Convert speed", game.solarSystem.upgrades.astro, "$images.goldenScrap$", images.solarSystem.astro, 0.075, () => game.solarSystem.upgrades.neptune.level > 4),
                new UIPlanet(0.8, 0.7, "Mythus\nBetter Barrels max.", game.solarSystem.upgrades.mythus, "$images.scrap$", images.solarSystem.mythus, 0.07, () => game.solarSystem.upgrades.neptune.level > 4)
            ],
            function () {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, w, h);
                if (!game.settings.lowPerformance) {
                    drawStars(10, 0.3);
                }
                ctx.drawImage(images.solarSystem.third, w * 0.45, h * 0.45, h * 0.1, h * 0.1);
            }),
        new Scene("MergeMastery",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIText("Merge Mastery", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup(
                    [
                        new UIButton(0.5, 0.9, 0.3, 0.07, images.buttonEmpty, () => game.mergeMastery.prestige.reset()),
                        new UIText("Prestige", 0.5, 0.9, 0.06, "white", { bold: true, valign: "middle" })
                    ], () => game.mergeMastery.level > 49)
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
                let lvl = game.mergeMastery.level;

                ctx.fillStyle = "rgb(122, 180, 255)";
                ctx.fillRect(0, h * 0.2, w, h * 0.19);

                ctx.fillStyle = "rgb(122, 180, 255)";
                ctx.fillRect(0, h * (0.39 + 0.125), w, h * 0.125);

                //main
                ctx.fillStyle = "#000000a0";
                ctx.fillRect(0, h * 0.32, w, h * 0.05);
                ctx.fillStyle = colors[C].bgFront;
                ctx.fillRect(0, h * 0.32, w * (game.mergeMastery.currentMerges / game.mergeMastery.getNeededMerges(lvl)), h * 0.05);

                ctx.fillStyle = "white";
                ctx.font = (h * 0.05) + "px " + fonts.default;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                ctx.fillText(formatThousands(game.mergeMastery.currentMerges) + "/" + formatThousands(game.mergeMastery.getNeededMerges(lvl)), w / 2, h * 0.32);

                ctx.fillStyle = "black";
                ctx.font = "bold " + (h * 0.075) + "px " + fonts.default;
                ctx.fillText("Level " + game.mergeMastery.level, w / 2, h * 0.225);

                ctx.font = (h * 0.07) + "px " + fonts.default;
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                Barrel.renderBarrel(ctx, 0, w * 0.05 + h * 0.05, h * 0.45, h * 0.1);
                ctx.fillText("+" + formatPercent(game.mergeMastery.getScrapBoost(lvl).sub(1), 0), w * 0.3, h * 0.45, w * 0.68);
                ctx.drawImage(images.magnet, w * 0.05, h * 0.525, h * 0.1, h * 0.1);
                ctx.fillText("+" + formatNumber(game.mergeMastery.getMagnetBonus(lvl), game.settings.numberFormatType, { namesAfter: 1e10 }), w * 0.3, h * 0.58, w * 0.68);

                ctx.font = (h * 0.025) + "px " + fonts.default;
                ctx.fillText("Scrap income", w * 0.3, h * 0.495);
                ctx.fillText("Magnets on Level Up", w * 0.3, h * 0.62);

                if (game.mergeMastery.level > 20 || game.mergeMastery.prestige.level > 0) {
                    ctx.fillStyle = colors[C].table;
                    ctx.fillRect(w * 0.1, h * 0.65, w * 0.8, h * 0.3);
                    ctx.font = "bold " + (h * 0.07) + "px " + fonts.default;
                    ctx.textAlign = "center";
                    ctx.fillStyle = "black";
                    if (game.mergeMastery.level < 50 && game.mergeMastery.prestige.level === 0) {
                        Utils.drawEscapedText(ctx, "Reach Level 50 to\nunlock Prestige", w * 0.5, h * 0.79, 0.04, w * 0.7);
                    }
                    else {
                        let nextLvl = game.mergeMastery.prestige.level + Math.max(0, game.mergeMastery.level - 49);
                        let displayNext = nextLvl - game.mergeMastery.prestige.level > 0;

                        ctx.fillStyle = colors[C].table2;
                        ctx.fillRect(w * 0.18, h * 0.73, w * 0.64, h * 0.13);

                        ctx.fillStyle = "black";
                        ctx.fillText("Prestige", w * 0.5, h * 0.69);
                        ctx.font = (h * 0.035) + "px " + fonts.default;
                        ctx.textAlign = "left";
                        ctx.textBaseline = "top";
                        ctx.drawImage(images.goldenScrap, w * 0.2, h * 0.74, h * 0.05, h * 0.05);
                        let nxtGS = displayNext ? " → +" + formatPercent(game.mergeMastery.prestige.getGoldenScrapBoost(nextLvl)
                            .sub(1)) : "";
                        ctx.fillText("+" + formatPercent(game.mergeMastery.prestige.currentGSBoost().sub(1)) +
                            nxtGS, w * 0.3, h * 0.75, w * 0.5);
                        ctx.drawImage(images.magnet, w * 0.2, h * 0.8, h * 0.05, h * 0.05);
                        let nxtM = displayNext ? " → +" + formatPercent(game.mergeMastery.prestige.getMagnetBoost(nextLvl)
                            .sub(1)) : "";
                        ctx.fillText("+" + formatPercent(game.mergeMastery.prestige.currentMagnetBoost().sub(1)) +
                            nxtM, w * 0.3, h * 0.81, w * 0.5);
                    }
                }
            }),
        new Scene("Bricks",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIText("Bricks", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.9, 0.42, 0.05, 0.05, images.buttonMaxAll, () => game.bricks.maxUpgrades(), { quadratic: true, isVisible: () => game.bricks.amount >= (1e100) }),
                new UIBrickUpgrade(game.bricks.upgrades.scrapBoost, images.upgrades.moreScrap, 0.5, "Get More Scrap"),
                new UIBrickUpgrade(game.bricks.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.6, "Get More Magnets", colors[C].table2),
                new UIBrickUpgrade(game.bricks.upgrades.brickBoost, images.upgrades.brickBoost, 0.7, "Get More Bricks", colors[C].table2),
                new UIBrickUpgrade(game.bricks.upgrades.questSpeed, images.upgrades.questSpeed, 0.8, "Complete and refresh\nMerge Quests faster"),
                new UIBrickUpgrade(game.bricks.upgrades.questLevels, images.upgrades.questLevels, 0.9, "Merge Quest Upgrades\nhave more Levels")
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.bricks.amount, images.brick, -h * 0.025, 1.2);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(0, h * 0.28, w, h * 0.14);

                ctx.fillStyle = "black";
                ctx.font = (h * 0.04) + "px " + fonts.default;
                ctx.textAlign = "center";


                ctx.fillStyle = "rgb(66, 66, 66)";
                ctx.fillRect(0, h * 0.295, w, h * 0.05);
                ctx.fillStyle = colors[C].bgFront;
                ctx.fillRect(0, h * 0.295, w * (game.bricks.currentMergeProgress / game.bricks.mergesPerLevel()), h * 0.05);
                ctx.fillStyle = "white";
                ctx.fillText(formatThousands(game.bricks.currentMergeProgress) + " / " + formatThousands(game.bricks.mergesPerLevel()), w * 0.5, h * 0.3);
                ctx.fillStyle = "black";
                ctx.font = (h * 0.03) + "px " + fonts.default;
                ctx.fillText(formatNumber(game.bricks.getCurrentProduction()) + " x" + Math.pow(2, getBrickIncrease()) + "/s → " + formatNumber(game.bricks.getProduction(game.bricks.productionLevel + getBrickIncrease())) + "/s", w * 0.5, h * 0.36);
            }),
        new Scene("Tires",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIText("Tires", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIGroup([
                    new UIRect(0.5, 0.6, 1, 0.2, colors[C].table2),
                    new UIImage(images.locked, 0.5, 0.58, 0.125, 0.125, { quadratic: true }),
                    new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[1]), 0.5, 0.67, 0.09, "black", { bold: true, valign: "middle" }),
                ], () => game.tires.amount.lt(game.tires.milestones[1])),
                new UIGroup([
                    new UIRect(0.5, 0.8, 1, 0.2, colors[C].table),
                    new UIImage(images.locked, 0.5, 0.78, 0.125, 0.125, { quadratic: true }),
                    new UIText(() => "$images.tire$" + formatNumber(game.tires.milestones[2]), 0.5, 0.87, 0.09, "black", { bold: true, valign: "middle" }),
                ], () => game.tires.amount.lt(game.tires.milestones[2])),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[0][0], images.upgrades.fasterBarrels, "Faster Barrels", 0.5 / 3, 0.4),
                    new UITireUpgrade(game.tires.upgrades[0][1], images.upgrades.brickSpeed, "Faster Brick\nLevel Up", 1.5 / 3, 0.4),
                    new UITireUpgrade(game.tires.upgrades[0][2], images.upgrades.fasterMastery, "Faster\nMerge Mastery", 2.5 / 3, 0.4)
                ]),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[1][0], images.upgrades.tireBoost, "Tire Value\nper Collect", 0.5 / 3, 0.6, colors[C].table2),
                    new UITireUpgrade(game.tires.upgrades[1][1], images.upgrades.tireChance, "Tire Chance\nper Merge", 1.5 / 3, 0.6, colors[C].table2),
                    new UITireUpgrade(game.tires.upgrades[1][2], images.upgrades.questSpeed, "Faster\nMerge Quests", 2.5 / 3, 0.6, colors[C].table2)
                ], () => game.tires.amount.gt(game.tires.milestones[1])),
                new UIGroup([
                    new UITireUpgrade(game.tires.upgrades[2][0], images.upgrades.fasterFallingMagnets, "Faster\nFalling Magnets", 0.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][1], images.upgrades.fasterAutoMerge, "Faster\nAuto Merge", 1.5 / 3, 0.8),
                    new UITireUpgrade(game.tires.upgrades[2][2], images.upgrades.goldenScrapBoost, "More\nGolden Scrap", 2.5 / 3, 0.8)
                ], () => game.tires.amount.gt(game.tires.milestones[2]))
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.tires.amount, images.tire, -h * 0.025, 1.2);
            }),
        new Scene("Beams",
            [
                new UIText("Steel Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),


                new UIButton(0.1, 0.97, 0.15, 0.06, images.scenes.beamselection, () => Scene.loadScene("Beamselection"), {
                    quadraticMin: true,
                    isVisible: () => game.aerobeams.isUnlocked(),
                }),
                new UIButton(0.3, 0.97, 0.15, 0.06, images.scenes.aerobeams, () => Scene.loadScene("Aerobeams"), {
                    quadraticMin: true,
                    isVisible: () => game.aerobeams.isUnlocked(),
                }),
                new UIButton(0.5, 0.97, 0.15, 0.06, images.scenes.beamboosts, () => Scene.loadScene("Beamboosts"), { quadraticMin: true }),
                new UIButton(0.7, 0.97, 0.15, 0.06, images.scenes.angelbeams, () => Scene.loadScene("AngelBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.angelbeams.isUnlocked(),
                }),
                new UIButton(0.9, 0.97, 0.15, 0.06, images.scenes.reinforcedbeams, () => Scene.loadScene("ReinforcedBeams"), {
                    quadraticMin: true,
                    isVisible: () => game.reinforcedbeams.isUnlocked(),
                }),

                new UIText(() => { return "Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of a beam storm\noccuring instead of a single beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + Math.round(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),
                new UIBeamUpgrade(game.beams.upgrades.fasterBeams, images.upgrades.beamChance, 0.45, "All Beams spawn more often"),
                new UIBeamUpgrade(game.beams.upgrades.beamValue, images.upgrades.beamValue, 0.55, "Beams are worth more", colors[C].table2),
                new UIBeamUpgrade(game.beams.upgrades.slowerBeams, images.upgrades.slowerBeams, 0.65, "Beams fall slower"),
                new UIBeamUpgrade(game.beams.upgrades.beamStormChance, images.upgrades.beamStormChance, 0.75, "Beam storms occur more often", colors[C].table2),
                new UIBeamUpgrade(game.beams.upgrades.beamStormValue, images.upgrades.beamStormValue, 0.85, "Beams storms are longer"),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);

                ctx.fillStyle = colors[C].bgFront;
                ctx.fillRect(0, h * 0.94, w, h * 0.06);
            }),
        new Scene("Beamboosts",
            [
                new UIText("Steel Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of a beam storm\noccuring instead of a single beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + Math.round(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),
                new UIBeamUpgrade(game.beams.upgrades.moreScrap, images.upgrades.moreScrap, 0.45, "Get more Scrap"),
                new UIBeamUpgrade(game.beams.upgrades.moreMagnets, images.upgrades.magnetBoost, 0.55, "Get more Magnets", colors[C].table2),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.moreTires, images.upgrades.tireBoost, 0.65, "Get more Tire Value"),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("Beamselection",
            [
                new UIText("Beam Selection", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText("Select which beam type you want to get!\nYou can change this at any time", 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.beam$ Beams: " + Math.round(game.beams.amount), 0.5, 0.3, 0.06, "yellow"),
                new UIText(() => "$images.aerobeam$ Aerobeams: " + Math.round(game.aerobeams.amount), 0.5, 0.34, 0.06, "yellow"),
                new UIText(() => "$images.angelbeam$ Angel Beams: " + Math.round(game.angelbeams.amount), 0.5, 0.38, 0.06, "yellow"),
                new UIText(() => "$images.reinforcedbeam$ Reinforced Beams: " + Math.round(game.reinforcedbeams.amount), 0.5, 0.42, 0.06, "yellow"),
                new UIText(() => "Selected: " + ["Beams", "Aerobeams", "Angel Beams", "Reinforced Beams"][game.beams.selected], 0.5, 0.5, 0.06, "yellow"),


                new UIButton(0.35, 0.65, 0.15, 0.15, images.beam, () => game.beams.selected = 0, { quadratic: true }),
                new UIButton(0.65, 0.65, 0.15, 0.15, images.aerobeam, () => game.beams.selected = 1, { quadratic: true }),
                new UIButton(0.35, 0.8, 0.15, 0.15, images.angelbeam, () => game.beams.selected = 2, {
                    quadratic: true,
                    isVisible: () => game.angelbeams.isUnlocked()
                }),
                new UIButton(0.65, 0.8, 0.15, 0.15, images.reinforcedbeam, () => game.beams.selected = 3, {
                    quadratic: true,
                    isVisible: () => game.reinforcedbeams.isUnlocked()
                }),

                new UIText(() => {
                    if (game.settings.beamTimer == false) {
                        return getBeamTime();
                    }
                    if (game.settings.beamTimer == true) {
                        return "(ON) " + getBeamTime();
                    }
                    }, 0.5, 0.9, 0.06, "yellow"),

                new UIButton(0.9, 0.92, 0.07, 0.07, images.scenes.options, () => {
                    switch (game.settings.beamTimer) {
                        case false:
                            game.settings.beamTimer = true;
                            break;
                        case true:
                            game.settings.beamTimer = false;
                            break;
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);


                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.18);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.488, w * 0.9, h * 0.06);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.888, w * 0.9, h * 0.06);
            }),
        new Scene("Aerobeams",
            [
                new UIText("Aerodynamic Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Aerobeams fall every " + (45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)) + " seconds and are worth " + getBeamBaseValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an aerobeam storm\noccuring instead of a single aerobeam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.aerobeam$ Aerobeams: " + Math.round(game.aerobeams.amount), 0.5, 0.3, 0.06, "yellow"),


                new UIAerobeamUpgrade(game.aerobeams.upgrades.fasterBeams, images.upgrades.aerobeamChance, 0.45, "Aerobeams spawn more often"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.slowerFallingMagnets, images.upgrades.magnetBoost, 0.55, "Falling Magnets are slower", colors[C].table2),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.betterFallingMagnets, images.upgrades.magnetBoost, 0.65, "Falling Magnets are worth more"),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.tireCloneChance, images.upgrades.tireChance, 0.75, "Chance to spawn another tire\nwhen collecting one", colors[C].table2),
                new UIAerobeamUpgrade(game.aerobeams.upgrades.unlockGoldenScrapStorms, images.upgrades.beamStormChance, 0.85, "Unlock a new type of storm!"),
                //new UIBeamUpgrade(game.aerobeams.upgrades.strongerTopRow, images.upgrades.scrapBoost, 0.75, "The Top Row produces more Scrap", colors[C].table2),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("AngelBeams",
            [
                new UIText("Angel Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => { return "Angel Beams fall every " + (30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)) + " seconds and are worth " + getAngelBeamValue() + ".\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an Angel Beam storm\noccuring instead of a single Angel Beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.angelbeam$ Angel Beams: " + Math.round(game.angelbeams.amount), 0.5, 0.3, 0.06, "yellow"),


                new UIAngelBeamUpgrade(game.angelbeams.upgrades.beamValue, images.upgrades.angelBeamValue, 0.45, "Angel Beams are worth more"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.fasterBeams, images.upgrades.angelBeamChance, 0.55, "Angel Beams spawn more often", colors[C].table2),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.moreMasteryGS, images.upgrades.goldenScrapBoost, 0.65, "Get more GS from Mastery"),
                new UIAngelBeamUpgrade(game.angelbeams.upgrades.goldenScrapStormChance, images.upgrades.goldenScrapBoost, 0.75, "Increase chance for a GS storm", colors[C].table2,
                    () => { return game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0 }),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("ReinforcedBeams",
            [
                new UIText("Reinforced Beams", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Beams"), { quadratic: true }),

                new UIText(() => {
                    return "Reinforced Beams fall every " + (60 - applyUpgrade(game.beams.upgrades.fasterBeams)) + " seconds and are worth " + getReinforcedBeamValue() + ".\n" + getReinforcedTapsNeeded() + " taps/beam.\nThere's a " + applyUpgrade(game.beams.upgrades.beamStormChance).toFixed(1) + " % chance of an Angel Beam storm\noccuring instead of a single Reinforced Beam, containing " + (5 + applyUpgrade(game.beams.upgrades.beamStormValue)) + " beams." }, 0.5, 0.2, 0.03, "black"),

                new UIText(() => "$images.reinforcedbeam$ Reinforced Beams: " + Math.round(game.reinforcedbeams.amount), 0.5, 0.3, 0.06, "yellow"),


                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforce, images.upgrades.reinforcedBeamValue, 0.45, "Reinforced Beams are worth more,\nbut are harder to collect"),
                new UIButton(0.775, 0.475, 0.05, 0.05, images.buttonReset, () => {
                    if (confirm("Do you really want to reduce this upgrade by 1 level and get 50% back?") && game.reinforcedbeams.upgrades.reinforce.level > 0) {
                        game.reinforcedbeams.amount = game.reinforcedbeams.amount.add(Decimal.floor(game.reinforcedbeams.upgrades.reinforce.getPrice(game.reinforcedbeams.upgrades.reinforce.level).div(2) ))
                        game.reinforcedbeams.upgrades.reinforce.level -= 1;
                    }
                }, { quadratic: true }),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.strength, images.upgrades.reinforcedBeamPower, 0.55, "Reinforced Beams are easier\nto collect", colors[C].table2),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.powerpunch, images.upgrades.reinforcedBeamCrit, 0.65, "Chance to collect Reinforced\nBeams 3x faster"),
                new UIReinforcedBeamUpgrade(game.reinforcedbeams.upgrades.reinforcedbricks, images.upgrades.reinforcedBricks, 0.75, "x2 Bricks, but 75% more merges", colors[C].table2),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.288, w * 0.9, h * 0.06);
            }),
        new Scene("Wrenches",
            [
                new UIText("Wrenches", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

                new UIText(() => "$images.wrench$ Wrenches: " + game.wrenches.amount.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => {
                    if (isMobile()) {
                        return "You get 1 wrench for every merge!";
                    }
                    else {
                        return "As a PC player, you get 3 wrenches for every merge!";
                    }
                }, 0.5, 0.3, 0.03, "black"),

                new UIText(() => "Total Scrap Boost: x" + formatNumber( (Math.max(1, applyUpgrade(game.wrenches.upgrades.wrenchScrapBoost) / 100 * game.wrenches.amount) ))/*.toFixed(1)*/, 0.5, 0.7, 0.03, "black"),                

                new UIText(() => "Total Merges: " + game.totalMerges + "\nOwn Merges: " + game.selfMerges, 0.5, 0.8, 0.06, "black"),
                new UIText(() => "Own merges -> Merges done by the player!", 0.5, 0.9, 0.03, "black"),

                new UIWrenchUpgrade(game.wrenches.upgrades.doubleMergeMastery, images.upgrades.fasterAutoMerge, 0.35, "x2 Merge Mastery progress\nfrom own merges", colors[C].table, game.mergeMastery.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.instantBricksChance, images.upgrades.brickBoost, 0.45, "Instant brick prod. increase\nfrom own merges", colors[C].table2, game.bricks.isUnlocked),
                new UIWrenchUpgrade(game.wrenches.upgrades.wrenchScrapBoost, images.upgrades.moreScrap, 0.55, "+10% scrap/wrench"),
                new UIWrenchUpgrade(game.wrenches.upgrades.fasterBeamChance, images.upgrades.beamChance, 0.65, "Chance to reduce the beam timer\nby 0.25s every own merge", colors[C].table2, game.beams.isUnlocked),

            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(w * 0.05, h * 0.188, w * 0.9, h * 0.06);
            }),



new Scene("Statistics",
    [
        new UIText("Statistics", 0.5, 0.05, 0.08, "white", {
            bold: 900,
            borderSize: 0.005,
            font: fonts.title
        }),
        new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),

        new UIText(() => "Highest Merge Mastery Level: " + game.highestMasteryLevel, 0.5, 0.1, 0.04, "black"),
        new UIText(() => "Highest Barrel: " + game.highestBarrelReached, 0.5, 0.125, 0.04, "black"),
        new UIText(() => "Highest Scrap Reached: " + formatNumber(game.highestScrapReached), 0.5, 0.15, 0.04, "black"),

        new UIText(() => "Total Wrenches: " + formatNumber(game.stats.totalwrenches), 0.5, 0.2, 0.04, "black"),
        new UIText(() => "Total Beams: " + formatNumber(game.stats.totalbeams), 0.5, 0.225, 0.04, "black"),
        new UIText(() => "Total Aerobeams: " + formatNumber(game.stats.totalaerobeams), 0.5, 0.25, 0.04, "black"),
        new UIText(() => "Total Angel Beams: " + formatNumber(game.stats.totalangelbeams), 0.5, 0.275, 0.04, "black"),
        new UIText(() => "Total Reinforced Beams: " + formatNumber(game.stats.totalreinforcedbeams), 0.5, 0.3, 0.04, "black"),
        new UIText(() => "Total Beams Collected: " + formatNumber(game.stats.totalbeamscollected), 0.5, 0.325, 0.04, "black"),
        new UIText(() => "Total Aerobeams Collected: " + formatNumber(game.stats.totalaerobeamscollected), 0.5, 0.35, 0.04, "black"),
        new UIText(() => "Total Angel Beams Collected: " + formatNumber(game.stats.totalangelbeamscollected), 0.5, 0.375, 0.04, "black"),
        new UIText(() => "Total Reinforced Beams Collected: " + formatNumber(game.stats.totalreinforcedbeamscollected), 0.5, 0.4, 0.04, "black"),
        new UIText(() => "Total Quests completed: " + game.stats.totalquests.toFixed(0), 0.5, 0.425, 0.04, "black"),
        new UIText(() => "Total Merge Tokens: " + formatNumber(game.stats.totalmergetokens), 0.5, 0.45, 0.04, "black"),
        new UIText(() => "Total Dark Scrap: " + formatNumber(game.stats.totaldarkscrap), 0.5, 0.475, 0.04, "black"),
        new UIText(() => "Total Fragments: " + formatNumber(game.stats.totalfragments), 0.5, 0.5, 0.04, "black"),
        new UIText(() => "Total Dark Fragments: " + formatNumber(game.stats.totaldarkfragments), 0.5, 0.525, 0.04, "black"),
        new UIText(() => "Total Achievements: " + game.ms.length + "/" + game.milestones.achievements.length, 0.5, 0.55, 0.04, "black"),
        new UIText(() => "Total Tires Collected: " + formatNumber(game.stats.totaltirescollected), 0.5, 0.575, 0.04, "black"),
        new UIText(() => "Total GS Resets: " + formatNumber(game.stats.totalgsresets), 0.5, 0.6, 0.04, "black"),
        new UIText(() => "Play Time: " + formatNumber(game.stats.playtime), 0.5, 0.625, 0.04, "black"),

        new UIText(() => "Total Merges: " + game.totalMerges, 0.5, 0.675, 0.04, "black"),
        new UIText(() => "Self Merges: " + game.selfMerges, 0.5, 0.7, 0.04, "black"),


        new UIText(() => "Please note: Many of these stats were not\ntracked prior to update 2.2!", 0.5, 0.8, 0.04, "black"),

        new UIButton(0.8, 0.95, 0.3, 0.07, images.buttonEmpty, () => Scene.loadScene("StatCompare")),
        new UIText("Compare", 0.8, 0.95, 0.06, "white", { bold: true, valign: "middle",
            }),
    ],
    function () {
        ctx.fillStyle = colors[C].bg;
        ctx.fillRect(0, 0, w, h);
    }),

        new Scene("StatCompare",
            [
                new UIText("Statistics", 0.5, 0.05, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Statistics"), { quadratic: true }),


                new UIButton(0.2, 0.95, 0.3, 0.07, images.buttonEmpty, () => {
                    let exportCode;
                    exportCode = Object.assign({}, game.stats, {
                        highestMasteryLevel: game.highestMasteryLevel,
                        highestBarrelReached : game.highestBarrelReached,
                        highestScrapReached: game.highestScrapReached,
                        totalAchievements: game.ms.length,
                        selfMerges: game.selfMerges,
                        totalMerges : game.totalMerges
                    });
                    console.log(exportCode);
                    exportCode = "tPt3-" + btoa(JSON.stringify(exportCode));
                    Utils.copyToClipboard(exportCode);
                    alert("The compare code has  been copied to your clipboard. Paste it into a text file and keep the file safe.");
                }),
                new UIText("Export CompareCode", 0.2, 0.95, 0.03, "white", {
                    bold: true, valign: "middle",
                }),



                new UIButton(0.8, 0.95, 0.3, 0.07, images.buttonEmpty, () => {
                    let importCode = prompt("");
                    importCode = importCode.slice(5);
                    try {
                        importCode = atob(importCode);
                    }
                    catch {
                        alert("The provided Save Code could not be decoded.");
                        return false;
                    }
                    try {
                        importCode = JSON.parse(importCode);
                    }
                    catch {
                        alert("An error occured while parsing the save code");
                        return false;
                    }
                    compareStats = {};
                    for (i in importCode) {
                        compareStats[i] = importCode[i];
                    }
                }),
                new UIText("Import CompareCode", 0.8, 0.95, 0.03, "white", {
                    bold: true, valign: "middle",
                }),




                new UIText(() => "Highest Merge Mastery Level", 0.5, 0.1, 0.03, "black"),
                new UIText(() => "" + formatNumber(game.highestMasteryLevel), 0.01, 0.1, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.highestMasteryLevel), 0.99, 0.1, 0.04, "black", { halign: "right" }),

                new UIText(() => "Highest Barrel", 0.5, 0.125, 0.03, "black"),
                new UIText(() => "" + formatNumber(game.highestBarrelReached), 0.01, 0.125, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.highestBarrelReached), 0.99, 0.125, 0.04, "black", { halign: "right" }),

                new UIText(() => "Highest Scrap Reached", 0.5, 0.15, 0.03, "black"),
                new UIText(() => "" + formatNumber(game.highestScrapReached), 0.01, 0.15, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.highestScrapReached), 0.99, 0.15, 0.04, "black", { halign: "right" }),


                new UIText(() => "Total Wrenches", 0.5, 0.2, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalwrenches), 0.01, 0.2, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalwrenches), 0.99, 0.2, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Beams", 0.5, 0.225, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalbeams), 0.01, 0.225, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalbeams), 0.99, 0.225, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Aerobeams", 0.5, 0.25, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalaerobeams), 0.01, 0.25, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalaerobeams), 0.99, 0.25, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Angel Beams", 0.5, 0.275, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalangelbeams), 0.01, 0.275, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalangelbeams), 0.99, 0.275, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Reinforced Beams", 0.5, 0.3, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalreinforcedbeams), 0.01, 0.3, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalreinforcedbeams), 0.99, 0.3, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Beams Collected", 0.5, 0.325, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalbeamscollected), 0.01, 0.325, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalbeamscollected), 0.99, 0.325, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Aerobeams Collected", 0.5, 0.35, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalaerobeamscollected), 0.01, 0.35, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalaerobeamscollected), 0.99, 0.35, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Angel Beams Collected", 0.5, 0.375, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalangelbeamscollected), 0.01, 0.375, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalangelbeamscollected), 0.99, 0.375, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Reinforced Beams Collected", 0.5, 0.4, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalreinforcedbeamscollected), 0.01, 0.4, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalreinforcedbeamscollected), 0.99, 0.4, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Quests completed", 0.5, 0.425, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalquests), 0.01, 0.425, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalquests), 0.99, 0.425, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Merge Tokens", 0.5, 0.45, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalmergetokens), 0.01, 0.45, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalmergetokens), 0.99, 0.45, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Dark Scrap", 0.5, 0.475, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totaldarkscrap), 0.01, 0.475, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totaldarkscrap), 0.99, 0.475, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Fragments", 0.5, 0.5, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalfragments), 0.01, 0.5, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalfragments), 0.99, 0.5, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Dark Fragments", 0.5, 0.525, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totaldarkfragments), 0.01, 0.525, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totaldarkfragments), 0.99, 0.525, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Achievements", 0.5, 0.55, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.ms.length), 0.01, 0.55, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalAchievements), 0.99, 0.55, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total Tires Collected", 0.5, 0.575, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totaltirescollected), 0.01, 0.575, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totaltirescollected), 0.99, 0.575, 0.04, "black", { halign: "right" }),

                new UIText(() => "Total GS Resets", 0.5, 0.6, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.totalgsresets), 0.01, 0.6, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalgsresets), 0.99, 0.6, 0.04, "black", { halign: "right" }),

                new UIText(() => "Play Time", 0.5, 0.625, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.stats.playtime), 0.01, 0.625, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.playtime), 0.99, 0.625, 0.04, "black", { halign: "right" }),


                new UIText(() => "Total Merges", 0.5, 0.675, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.totalMerges), 0.01, 0.675, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.totalMerges), 0.99, 0.675, 0.04, "black", { halign: "right" }),

                new UIText(() => "Self Merges", 0.5, 0.7, 0.04, "black"),
                new UIText(() => "" + formatNumber(game.selfMerges), 0.01, 0.7, 0.04, "black", { halign: "left" }),
                new UIText(() => "" + formatNumber(compareStats.selfMerges), 0.99, 0.7, 0.04, "black", { halign: "right" }),
                ],
    function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
            }
            ),
        new Scene("Options",
            [
                new UIText("Options", 0.5, 0.1, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), { quadratic: true }),

                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.barrelShadows", "Toggle Barrel Shadows\n(can slow down Game)", colors[C].table),
                    new UIToggleOption(0.35, "game.settings.useCachedBarrels", "Cache some Barrel Images\n(may slow down\nor speed up Game)", colors[C].bg),
                    new UIOption(0.45, images.options.barrelQuality, () => {
                        game.settings.barrelQuality = (++game.settings.barrelQuality) % 3;
                        setBarrelQuality(game.settings.barrelQuality, "Options");
                    }, () => "Barrel Quality: " + ["High", "Low", "Ultra Low"][game.settings.barrelQuality], colors[C].table),
                    new UIOption(0.55, images.options.numberFormat, () => {
                        game.settings.numberFormatType = (++game.settings.numberFormatType) % NUM_FORMAT_TYPES;
                    }, () => {
                        let fmtnmb = [];
                        for (let i = 6, j = 0; j < 4; i = (i + 3) * 1.25, j++) {
                            fmtnmb.push(formatNumber(Decimal.pow(10, i)));
                        }
                        return "Switch Number format\n" + fmtnmb.join(", ");
                    }, colors[C].bg),
                    new UIOption(0.65, images.options.barrelQuality, () => {
                        game.settings.C = (++game.settings.C) % 3;
                        C = ["default", "darkblue", "dark"][game.settings.C];
                    }, () => "Theme: " + ["Default light blue", "Dark Blue", "Dark Theme"][game.settings.C], colors[C].table),
                ], () => game.settings.optionsPage === 0),
                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.destroyBarrels", "Double Click Barrels to remove them", colors[C].table),
                    new UIToggleOption(0.35, "game.settings.resetConfirmation", "Reset Confirmation", colors[C].bg),
                    new UIToggleOption(0.45, "game.settings.lowPerformance", "Low performance Mode", colors[C].table),
                    new UIToggleOption(0.55, "game.settings.barrelSpawn", "Barrel Spawn", colors[C].bg),
                ], () => game.settings.optionsPage === 1),
                new UIGroup([
                    new UIToggleOption(0.25, "game.settings.musicOnOff", "Music", colors[C].bg),
                    new UIOption(0.35, images.options.numberFormat, () => {
                        if (game.ms.length > [-1, 9, 24, 49][game.settings.musicSelect]) {
                            game.settings.musicSelect = game.settings.musicSelect + 1;
                        }
                        else {
                            game.settings.musicSelect = 0;
                        }
                        if (game.settings.musicSelect == 4) game.settings.musicSelect = 0;
                    }, () => "Current: " + ["Newerwave", "Getting It Done", "Spellbound", "Voltaic"][game.settings.musicSelect] + " by Kevin MacLeod"),
                    new UIOption(0.45, images.scenes.options, () => {
                        if (confirm("Warning! You are about to reset your Dark Scrap (Upgrades), Dark Fragment (Upgrades) and related achievements. Press cancel if you want to keep them.")) {
                            game.darkscrap.amount = new Decimal(0);
                            Object.keys(game.darkscrap.upgrades).forEach(k => {
                                game.darkscrap.upgrades[k].level = 0;
                            })

                            game.darkfragment.amount = new Decimal(0);
                            Object.keys(game.darkfragment.upgrades).forEach(k => {
                                game.darkfragment.upgrades[k].level = 0;
                            })

                            const removethose = [70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84];
                            for (i = 0; i < removethose.length; i++) {
                                const index = game.ms.indexOf(removethose[i]);
                                if (index > -1) {
                                    game.ms.splice(index, 1);
                                }
                            }
                        }
                    }, "Reset Second Dimension Progress", colors[C].bg),
                    /*new UIOption(0.55, images.scenes.options, () => {
                        const removethose = [85, 86, 87, 88, 89];
                        let removedthose = [];
                        for (i = 0; i < removethose.length; i++) {
                            const index = game.ms.indexOf(removethose[i]);
                            if (index > -1) {
                                game.ms.splice(index, 1);
                                removedthose.push(removethose[i]);
                                i -= 1;
                            }
                        }
                        for (i = 0; i < removedthose.length; i++) {
                            const index = game.ms.indexOf(removedthose[i]);
                            if (index == -1) {
                                game.ms.push(removedthose[i]);
                            }
                        }
                    }, "Optimize savecode", colors[C].bg),*/
                ], () => game.settings.optionsPage === 2),
                new UIButton(0.25, 0.65, 0.075, 0.075, images.arrows.left, () => game.settings.changeOptionsPage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage > 0
                    }),
                new UIButton(0.75, 0.65, 0.075, 0.075, images.arrows.right, () => game.settings.changeOptionsPage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.settings.optionsPage < 2
                    }),
                new UIButton(0.1, 0.89, 0.05, 0.05, images.logos.discord, () => location.href = "https://discord.gg/3T4CBmh", {quadratic: true}),
                new UIText("My Discord Server", 0.18, 0.89, 0.045, "black", {halign: "left", valign: "middle"}),
                new UIButton(0.1, 0.96, 0.05, 0.05, images.logos.youtube, () => location.href = "https://www.youtube.com/channel/UC7qnN9M1_PUqmrgOHQipC2Q", {quadratic: true}),
                new UIText("My Youtube Channel", 0.18, 0.96, 0.045, "black", { halign: "left", valign: "middle" }),
                new UIText("Mod of VeproGames' Scrap 2 Fanmade", 0.95, 0.93, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Modded by Schrottii", 0.95, 0.94, 0.025, "black", { halign: "right", valign: "bottom" }),
                new UIText("Libraries used:\nbreak_infinity\ngrapheme-splitter", 0.95, 0.99, 0.025, "black", {halign: "right", valign: "bottom"}),
                new UIText("Export and Import", 0.3, 0.825, 0.035, "black"),
                new UIButton(0.3, 0.775, 0.09, 0.09, images.exportImport, () => document.querySelector("div.absolute").style.display = "block", {quadratic: true}),
                new UIText("Play the Original SC2", 0.7, 0.825, 0.035, "black"),
                new UIButton(0.7, 0.775, 0.09, 0.09, images.logos.scrap2, () => location.href = "https://play.google.com/store/apps/details?id=com.scrap.clicker.android&hl=gsw", {quadratic: true}),
            ],
            function ()
            {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
                ctx.fillStyle = colors[C].table;
                ctx.fillRect(0, h * 0.85, w, h * 0.15);
            }),
        new Scene("MergeQuests",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), { quadratic: true }),
                new UIButton(0.1, 0.125, 0.07, 0.07, images.scenes.scrapyard, () => Scene.loadScene("Scrapyard"), {
                    isVisible: () => game.skillTree.upgrades.unlockScrapyard.isUnlocked(),
                    quadratic: true,
                }),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.scrapBoost, images.upgrades.moreScrap, 0.63, "Get More Scrap"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.goldenScrapBoost, images.upgrades.goldenScrapBoost, 0.73, "Get More Golden Scrap", colors[C].table2),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.magnetBoost, images.upgrades.magnetBoost, 0.83, "Get More Magnets"),
                new UIMergeTokenUpgrade(game.mergeQuests.upgrades.fallingMagnetValue, images.upgrades.fasterFallingMagnets, 0.93, "Falling Magnets are\nworth more", colors[C].table2, () => applyUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet)),


                new UIButton(0.9, 0.105, 0.05, 0.05, images.buttonReset, () => {
                    if (confirm("Do you really want to reset all 3 quests?")) {
                        for (i = 0; i < 3; i++) {
                            game.mergeQuests.quests[i].active = false;
                            game.mergeQuests.quests[i].currentCooldown = 0;
                        }
                    }
                }, { quadratic: true }),

                new UIButton(0.84, 0.255, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[0].active)
                    {
                        if (game.mergeQuests.quests[0].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[0].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)}),
                new UIButton(0.84, 0.385, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[1].active)
                    {
                        if (game.mergeQuests.quests[1].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[1].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)}),
                new UIButton(0.84, 0.515, 0.05, 0.05, images.ezUpgrade, () =>
                {
                    if(game.mergeQuests.quests[2].active)
                    {
                        if (game.mergeQuests.quests[2].barrelLvl < game.scrapUpgrades.betterBarrels.maxLevel) {
                            game.scrapUpgrades.betterBarrels.buyToTarget(game.mergeQuests.quests[2].barrelLvl);
                            Scene.loadScene("Barrels");
                        }
                    }
                }, {quadratic: true, isVisible: () => applyUpgrade(game.skillTree.upgrades.ezUpgraderQuests)})
            ],
            function ()
            {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                drawCurrencyBar(game.mergeQuests.mergeTokens, images.mergeToken, -h * 0.125);

                for (let [idx, q] of game.mergeQuests.quests.entries())
                {
                    q.render(ctx, w * 0.15, h * (0.225 + 0.13 * idx));
                }
            }, null, null),
        new Scene("Scrapyard",
            [
                new UIText("Scrapyard", 0.5, 0.1, 0.08, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("MergeQuests"), { quadratic: true }),

                new UIText(() => "$images.mergeToken$ Tokens: " + game.mergeQuests.mergeTokens.toFixed(0), 0.5, 0.2, 0.06, "yellow"),
                new UIText(() => "Every level reduces the merges needed for Merge Mastery\nby 1%! Current Boost: " + (game.mergeQuests.scrapyard - 1) + "%!\nCosts to next level: " + (10-game.mergeQuests.scrapyardProgress) + "x " + game.mergeQuests.scrapyard + "!", 0.5, 0.3, 0.03, "black"),

                new UIText(() => "Level: " + game.mergeQuests.scrapyard + "\n Progress to next: " + game.mergeQuests.scrapyardProgress*10 + "%!", 0.5, 0.8, 0.06, "black"),
                new UIButton(0.5, 0.6, 0.4, 0.4, images.scrapyard, () => {
                    // Scrapyard
                    if (game.mergeQuests.mergeTokens.gte(new Decimal(game.mergeQuests.scrapyard))) { // AAAAAH
                        game.mergeQuests.mergeTokens = game.mergeQuests.mergeTokens.sub(game.mergeQuests.scrapyard);
                        currentScene.popupTexts.push(new PopUpText("-" + game.mergeQuests.scrapyard, w / 2, h * 0.5, { color: "#bbbbbb", bold: true, size: 0.1, border: h * 0.005 }));

                        game.mergeQuests.scrapyardProgress += 1;
                        if (game.mergeQuests.scrapyardProgress == 10) {
                            game.mergeQuests.scrapyardProgress = 0;
                            game.mergeQuests.scrapyard += 1;
                        }
                    }
                }, { quadratic: true }),
            ],
            function () {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
            }),
        new Scene("Milestones",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("Barrels"), {quadratic: true}),
                new UIButton(0.1, 0.93, 0.1, 0.1, images.arrows.left, () => game.milestones.changePage(-1),
                    {
                        quadratic: true,
                        isVisible: () => game.milestones.page > 0
                    }),
                new UIButton(0.9, 0.93, 0.1, 0.1, images.arrows.right, () => game.milestones.changePage(1),
                    {
                        quadratic: true,
                        isVisible: () => game.milestones.page < game.milestones.maxPage()
                    }),
                new UIText("Achievements", 0.5, 0.09, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIText(() => game.ms.length + " / " + game.milestones.achievements.length, 0.5, 0.15, 0.06, "white", {
                    bold: 900,
                    borderSize: 0.003,
                    font: fonts.title
                })
            ],
            function ()
            {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);

                let perRow = 5; //achievements per row
                let maxTrophies = game.milestones.achievements.length;

                ctx.font = "bold " + (h * 0.06) + "px " + fonts.default;
                ctx.fillStyle = "black";

                ctx.fillStyle = colors[C].table;
                ctx.fillRect(0, h * 0.2, w, w);
                for (let i = 25 * game.milestones.page; i < Math.min(25 * game.milestones.page + 25, maxTrophies); i++)
                {
                    let tSize = w / perRow;
                    let x = tSize * (i % perRow);
                    let y = h * 0.2 + tSize * Math.floor((i - 25 * game.milestones.page) / perRow);
                    let iid = game.milestones.achievements[i].imageId;
                    let iX = 256 * (iid % 10);
                    let iY = 256 * Math.floor(iid / 10);
                    ctx.drawImage(game.ms.includes(game.milestones.achievements[i].id - 1) ? images.achievements.unlocked : images.achievements.locked, iX, iY, 256, 256, x, y, tSize, tSize);
                    if(i === game.milestones.highlighted)
                    {
                        ctx.drawImage(images.highlightedSlot, x, y, tSize, tSize);
                    }
                    ctx.fillStyle = game.ms.includes(game.milestones.achievements[i].id - 1) ? game.milestones.achievements[i].fontColor : "white";
                    ctx.lineWidth = 0;
                }

                if(game.milestones.tooltip !== null)
                {
                    let y = h * 0.2 + w * ((1 / perRow) * Math.floor((game.milestones.tooltip - 25 * game.milestones.page) / perRow) + 0.18);
                    let cx = w * ((1 / perRow) * (game.milestones.tooltip % perRow) + 0.05);
                    let arrowX = cx + w / perRow / 4;
                    cx = Utils.clamp(cx, w * 0.325, w * 0.675);
                    ctx.fillStyle = "#000000";
                    ctx.fillRect(cx - w * 0.3, y, w * 0.6, h * 0.1);
                    ctx.beginPath();
                    ctx.moveTo(arrowX, y - w * 0.025);
                    ctx.lineTo(arrowX + w * 0.025, y);
                    ctx.lineTo(arrowX - w * 0.025, y);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = game.milestones.achievements[game.milestones.tooltip].fontColor;
                    ctx.textBaseline = "top";
                    ctx.textAlign = "center";
                    ctx.font = (w * 0.045) + "px " + fonts.default;
                    ctx.fillText(game.milestones.achievements[game.milestones.tooltip].title, cx, y + w * 0.02);
                    ctx.fillStyle = "white";
                    Utils.drawEscapedText(ctx, game.milestones.achievements[game.milestones.tooltip].getDescriptionDisplay(), cx, y + w * 0.065, 0.0225, w * 0.6);
                }
            },
            function ()
            {
                let perRow = 5;
                let clickedMileStone = Math.floor(mouseX / w * perRow) + perRow * Math.floor((mouseY - h * 0.2) / w * perRow) + 25 * game.milestones.page;
                if(clickedMileStone >= 25 * game.milestones.page && clickedMileStone < Math.min(25 * game.milestones.page + 25, game.milestones.achievements.length))
                {
                    game.milestones.highlighted = clickedMileStone;
                    if(game.milestones.tooltip === clickedMileStone)
                    {
                        game.milestones.tooltip = null;
                    }
                    else
                    {
                        game.milestones.tooltip = clickedMileStone;
                    }
                }
                else
                {
                    game.milestones.tooltip = null;
                }
            }),
        new Scene("SkillTree",
            [
                new UIButton(0.1, 0.05, 0.07, 0.07, images.buttonBack, () => Scene.loadScene("SolarSystem"), {quadratic: true}),
                new UIText("Skill Tree", 0.5, 0.09, 0.12, "white", {
                    bold: 900,
                    borderSize: 0.005,
                    font: fonts.title
                }),
                new UIScrollContainerY([
                    new UIRect(0.5, 0.4, 1, 0.4, colors[C].table),
                    new UIRect(0.5, 0.7, 1, 0.3, colors[C].table2),
                    new UIRect(0.5, 1.0, 1, 0.3, colors[C].table),
                    new UIRect(0.5, 1.3, 1, 0.3, colors[C].table2),
                    new UIRect(0.5, 1.6, 1, 0.3, colors[C].table),
                    new UIRect(0.5, 1.9, 1, 0.3, colors[C].table2),

                    new UISkillTreePath(0.5, 0.4, 0.5, 0.65, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.scrapBoost),

                    new UISkillTreePath(0.5, 0.7, 0.5, 0.85, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.xplustwo),

                    new UISkillTreePath(0.5, 0.95, 0.2, 1.2, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.unlockbeamtypes),
                    new UISkillTreePath(0.5, 0.95, 0.8, 1.2, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.unlockbeamtypes),

                    new UISkillTreePath(0.2, 1.25, 0.2, 1.55, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.brickBoost),
                    new UISkillTreePath(0.2, 1.25, 0.5, 1.55, 0.01, colors[C].skillTreePath, [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),
                    new UISkillTreePath(0.8, 1.25, 0.5, 1.55, 0.01, colors[C].skillTreePath, [game.skillTree.upgrades.brickBoost, game.skillTree.upgrades.mergeQuestUpgFallingMagnet]),
                    new UISkillTreePath(0.8, 1.25, 0.8, 1.55, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.moreFragments),

                    new UISkillTreePath(0.2, 1.55, 0.2, 1.85, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.tireBoost),
                    new UISkillTreePath(0.5, 1.55, 0.5, 1.85, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.magnetUpgBrickSpeed),
                    new UISkillTreePath(0.8, 1.55, 0.8, 1.85, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.moreFragments),

                    new UISkillTreePath(0.2, 1.85, 0.2, 2.15, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.scrapBoost2),
                    new UISkillTreePath(0.8, 1.85, 0.8, 2.15, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.fasterAutoMerge),

                    new UISkillTreePath(0.2, 2.15, 0.5, 2.45, 0.01, colors[C].skillTreePath, [game.skillTree.upgrades.higherAstroMax, game.skillTree.upgrades.tireValue]),
                    new UISkillTreePath(0.8, 2.15, 0.5, 2.45, 0.01, colors[C].skillTreePath, [game.skillTree.upgrades.higherAstroMax, game.skillTree.upgrades.tireValue]),

                    new UISkillTreePath(0.5, 2.45, 0.2, 2.75, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.moreMergeTokens),
                    new UISkillTreePath(0.5, 2.45, 0.8, 2.75, 0.01, colors[C].skillTreePath, game.skillTree.upgrades.moreMergeTokens),


                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost, images.upgrades.moreScrap, "More Scrap", 0.5, 0.35),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.xplustwo, images.upgrades.xplustwo, "x + 2", 0.5, 0.65, colors[C].table2),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockbeamtypes, images.upgrades.unlockbeamtypes, "Unlock Beam Types", 0.5, 0.95),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.brickBoost, images.upgrades.brickBoost, "More Bricks", 0.2, 1.25, colors[C].table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.mergeQuestUpgFallingMagnet, images.upgrades.fasterFallingMagnets, "Merge Quests\nUpgrade:\nFalling Magnets", 0.8, 1.25, colors[C].table2),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireBoost, images.upgrades.tireBoost, "Get more\nxTires per\ncollect", 0.2, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.magnetUpgBrickSpeed, images.upgrades.brickSpeed, "Magnet\nUpgrade:\nBrick Speed", 0.5, 1.55),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreFragments, images.upgrades.moreFragments, "More\nFragments", 0.8, 1.55),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.scrapBoost2, images.upgrades.moreScrap2, "More Scrap 2", 0.2, 1.85, colors[C].table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.ezUpgraderQuests, images.ezUpgrade, "EZ Upgrader\nfor Merge\nQuests", 0.5, 1.85, colors[C].table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.fasterAutoMerge, images.upgrades.brickSpeed, "Faster\nAuto Merge", 0.8, 1.85, colors[C].table2),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.higherAstroMax, images.upgrades.moreFragments, "Increased\nAstro Max.", 0.2, 2.15),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.tireValue, images.upgrades.tireBoost, "Double\nTire Worth", 0.8, 2.15),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.moreMergeTokens, images.upgrades.moreMergeTokens, "Double\nMerge Tokens", 0.5, 2.45, colors[C].table),

                    new UISkillTreeUpgrade(game.skillTree.upgrades.unlockScrapyard, images.upgrades.unlockscrapyard, "Unlock Scrapyard", 0.2, 2.75, colors[C].table2),
                    new UISkillTreeUpgrade(game.skillTree.upgrades.superEzUpgrader, images.ezUpgrade, "Unlock Super\nEZ Upgrader", 0.8, 2.75, colors[C].table2),

                ], 0, 0.2, 1, 0.8, () => true, {ymin: 0, ymax: 2.95})
            ],
            function ()
            {
                ctx.fillStyle = colors[C].bg;
                ctx.fillRect(0, 0, w, h);
            })
    ];

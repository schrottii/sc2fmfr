var canvas = document.querySelector("#gameCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var mouseX = 0, mouseY = 0, mouseMoveX = 0, mouseMoveY = 0;
var mousePressed = false;

var importType = 0;

var gSplitter = new GraphemeSplitter();

var barrels = [];
var draggedBarrel;
var tempDrawnBarrels = []; //barrels drawn below newly merged barrels
var lastClickedBarrel = -1;
var timeSinceLastBarrelClick = 0;

var currentScene = scenes[0];

var gameNotifications = [];
var movingItems = [];

var trophyMergeCounter = 0;
var trophyProgress = 0;

var reinforcedBeamCooldown = 0;

var spawnTime =
    {
        cooldown: 0,
        time: 0.15
    };

var incomeTextTime =
    {
        cooldown: 0,
        time: 1
    };

var saveTime =
    {
        cd: 10,
        time: 0
    };

var autoMergeTime = 0;
var autoConvertTime = 0;

var fallingMagnetTime = 0;
var gsStormTime = 0;

var deltaTimeOld = Date.now();
var deltaTimeNew = Date.now();

function isMobile()
{
    let check = false;
    (function (a)
    {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
        {
            check = true;
        }
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

function setup()
{
    for (let i = 0; i < 20; i++)
    {
        barrels.push(undefined);
    }

    resizeCanvas();

    for (let q of game.mergeQuests.quests)
    {
        q.generateQuest(q.possibleTiers[Math.floor(q.possibleTiers.length * Math.random())]);
    }

    try
    {
        loadGame();
    }
    catch(e)
    {
        alert("An error has occured:\n" + e.stack + "\n\nPlease contact the developer.");
        return;
    }
    setBarrelQuality(game.settings.barrelQuality);

    document.querySelector("div.absolute button#export").onclick = e => exportGame();
    document.querySelector("div.absolute button#import").onclick = e =>
    {
        thebool = confirm("Do you really want to import?");
        if (thebool == true) {
            alert("importing game (from text field)...");
            if (importType == 0) loadGame(document.querySelector("div.absolute textarea").value);
            if (importType == 1) loadCompare(document.querySelector("div.absolute textarea").value);
        }
    };
    document.querySelector("div.absolute button#close").onclick = e => document.querySelector("div.absolute").style.display = "none";

    requestAnimationFrame(update);
}

function update()
{
    deltaTimeNew = Date.now();
    let delta = Math.max(0, (deltaTimeNew - deltaTimeOld) / 1000);
    deltaTimeOld = Date.now();

    game.stats.playtime = game.stats.playtime.add(delta);

    if (!document.hidden/* && delta > 0.5*/)
    {
        if (game.scrap == 0) game.scrap = new Decimal(1);
        game.scrap = game.scrap.add(Barrel.getGlobalIncome().mul(delta));
        game.scrapThisPrestige = game.scrapThisPrestige.add(Barrel.getGlobalIncome().mul(delta));
        game.bricks.amount = game.bricks.amount.add(game.bricks.getCurrentProduction().mul(delta));

        spawnTime.cooldown += delta;

        let barrelsToSpawn = Math.min(20, Math.floor(spawnTime.cooldown / applyUpgrade(game.scrapUpgrades.fasterBarrels).toNumber()));
        if(barrelsToSpawn > 0)
        {
            spawnTime.cooldown = 0;
            for(let i = 0; i < barrelsToSpawn; i++)
            {
                spawnBarrel();
                if (Math.random() < applyUpgrade(game.solarSystem.upgrades.venus).toNumber())
                {
                    spawnBarrel();
                }
            }
        }

        if(game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS)
        {
            fallingMagnetTime += game.solarSystem.upgrades.earth.level >= EarthLevels.UNLOCK_MARS ? delta : 0;

            if (fallingMagnetTime >= applyUpgrade(game.solarSystem.upgrades.mars).toNumber())
            {
                fallingMagnetTime = 0;
                movingItemFactory.fallingMagnet(Decimal.round(getMagnetBaseValue().mul(5).mul((game.mergeQuests.upgrades.fallingMagnetValue.level) + 1).mul(applyUpgrade(game.aerobeams.upgrades.betterFallingMagnets))));
            }
        }

        if(game.milestones.achievements[6].isUnlocked())
        {
            if(game.settings.autoMerge)
            {
                autoMergeTime += delta;
            }
            if(autoMergeTime >= applyUpgrade(game.solarSystem.upgrades.saturn)  )
            {
                autoMergeBarrel();
                autoMergeTime = 0;
            }
        }

        if (game.highestBarrelReached > 299) {
            if (game.settings.autoConvert) {
                autoConvertTime += delta;
            }
            if (autoConvertTime >= 3 - applyUpgrade(game.solarSystem.upgrades.astro)) {
                autoConvertBarrel();
                autoConvertTime = 0;
            }
        }

        if(game.mergeQuests.isUnlocked())
        {
            for (let q of game.mergeQuests.quests)
            {
                q.tick(delta);
            }
            //game.mergeQuests.dailyQuest.tick(delta);
        }

        Milestone.check(true);

        timeSinceLastBarrelClick += delta;

        saveTime.time += delta;
        if (saveTime.time >= saveTime.cd)
        {
            saveTime.time = 0;
            saveGame();
        }

        game.magnets = game.magnets.add(applyUpgrade(game.solarSystem.upgrades.neptune).mul(delta));

        game.highestScrapReached = Decimal.max(game.highestScrapReached, game.scrap);

        currentScene.update(delta);

        if (gameNotifications.length > 0)
        {
            gameNotifications[0].render(ctx);
            gameNotifications[0].tick(delta);
        }

        for (let item of movingItems)
        {
            item.tick(delta);
        }

        if (game.aerobeams.upgrades.unlockGoldenScrapStorms.level > 0) {
            gsStormTime += delta;
            if (gsStormTime >= 60) {
                gsStormTime = 0;
                if (Math.random() < applyUpgrade(game.angelbeams.upgrades.goldenScrapStormChance) / 100) {
                    for (i = 0; i < 20; i++) {
                        setTimeout(function () { movingItemFactory.fallingGold(game.goldenScrap.getResetAmount() / 35) }, 250 * i);
                    }
                }
                else {
                    GameNotification.create(new TextNotification("So unlucky", "No storm! :("));
                }
            }
        }

        if (game.beams.isUnlocked()) {
            game.beams.time += delta;

            // Normal Beams
            if (game.beams.selected == 0) {
                if (game.beams.time > 30 - applyUpgrade(game.beams.upgrades.fasterBeams)) { // 30 - 15
                    if (Math.random() > 1 - applyUpgrade(game.beams.upgrades.beamStormChance) / 100) {
                        for (i = 0; i < (5 + applyUpgrade(game.beams.upgrades.beamStormValue)); i++) {
                            setTimeout(function () { movingItemFactory.fallingBeam(getBeamBaseValue()) }, 500 * i);
                        }
                    }
                    else {
                        movingItemFactory.fallingBeam(getBeamBaseValue());
                    }
                    game.beams.time = 0;
                }
            }

            // Aerobeams
            if (game.beams.selected == 1) {
                if (game.beams.time > 45 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.aerobeams.upgrades.fasterBeams)) { // 45 - 15 - 15
                    if (Math.random() > 1 - applyUpgrade(game.beams.upgrades.beamStormChance) / 100) {
                        for (i = 0; i < (5 + applyUpgrade(game.beams.upgrades.beamStormValue)); i++) {
                            setTimeout(function () { movingItemFactory.fallingAeroBeam(getBeamBaseValue()) }, 500 * i);
                        }
                    }
                    else {
                        movingItemFactory.fallingAeroBeam(getBeamBaseValue());
                    }
                    game.beams.time = 0;
                }
            }

            // Angel Beams
            if (game.beams.selected == 2) {
                if (game.beams.time > 30 - applyUpgrade(game.beams.upgrades.fasterBeams) - applyUpgrade(game.angelbeams.upgrades.fasterBeams)) { // 30 - 15 - 5
                    if (Math.random() > 1 - applyUpgrade(game.beams.upgrades.beamStormChance) / 100) {
                        for (i = 0; i < (5 + applyUpgrade(game.beams.upgrades.beamStormValue)); i++) {
                            setTimeout(function () { movingItemFactory.fallingAngelBeam(getAngelBeamValue()) }, 500 * i);
                        }
                    }
                    else {
                        movingItemFactory.fallingAngelBeam(getAngelBeamValue());
                    }
                    game.beams.time = 0;
                }
            }

            // Reinforced Beams
            reinforcedBeamCooldown += delta;
            if (game.beams.selected == 3) {
                if (game.beams.time > 60 - applyUpgrade(game.beams.upgrades.fasterBeams)) { // 60 - 15 
                    if (Math.random() > 1 - applyUpgrade(game.beams.upgrades.beamStormChance) / 100) {
                        for (i = 0; i < (5 + applyUpgrade(game.beams.upgrades.beamStormValue)); i++) {
                            setTimeout(function () { movingItemFactory.fallingReinforcedBeam(getReinforcedBeamValue()) }, 1000 * i);
                        }
                    }
                    else {
                        movingItemFactory.fallingReinforcedBeam(getReinforcedBeamValue());
                    }
                    game.beams.time = 0;
                }
            }
        }
    }

    //ctx.font = (h * .02) + "px " + fonts.default;
    //ctx.textAlign = "left";
    //ctx.textBaseline = "top";
    //ctx.fillStyle = "black";
    //ctx.fillText((1 / delta).toFixed(0) + " fps", w * 0.01, h * 0.005, w);
    //ctx.fillText("mouseMove: [" + mouseMoveX + ", " + mouseMoveY + "]", w * 0.33, h * 0.005, w);

    requestAnimationFrame(update);
}

function getBeamBaseValue() {
    return applyUpgrade(game.beams.upgrades.beamValue)
        + (2 * applyUpgrade(game.skillTree.upgrades.xplustwo));
}
function getAngelBeamValue() {
    return applyUpgrade(game.angelbeams.upgrades.beamValue);
}
function getReinforcedBeamValue() {
    return applyUpgrade(game.reinforcedbeams.upgrades.reinforce);
}

function getReinforcedTapsNeeded() {
    return 3 + game.reinforcedbeams.upgrades.reinforce.level - applyUpgrade(game.reinforcedbeams.upgrades.strength);
}

function getBrickIncrease() {
    return 1 + applyUpgrade(game.reinforcedbeams.upgrades.reinforcedbricks);
}

function getMagnetBaseValue()
{
    return applyUpgrade(game.goldenScrap.upgrades.magnetBoost)
        .mul(applyUpgrade(game.mergeQuests.upgrades.magnetBoost))
        .mul(game.mergeMastery.prestige.currentMagnetBoost())
        .mul(applyUpgrade(game.bricks.upgrades.magnetBoost))
        .mul(applyUpgrade(game.fragment.upgrades.magnetBoost))
        .mul(applyUpgrade(game.beams.upgrades.moreMagnets));
}

function onBarrelMerge(isAuto, lvl, bx, by)
{
    if (game.mergeQuests.isUnlocked())
    {
        for (let q of game.mergeQuests.quests)
        {
            let merged = q.check(lvl);
            if (merged)
            {
                break;
            }
        }
        let merged = game.mergeQuests.dailyQuest.check(lvl);
    }
    
    game.totalMerges += 1;
    if (isAuto == false) {
        game.selfMerges += 1;

        if (game.wrenches.isUnlocked()) {
            if (isMobile()) {
                game.wrenches.amount = game.wrenches.amount.add(1);
                game.stats.totalwrenches = game.stats.totalwrenches.add(1);
            }
            else {
                game.wrenches.amount = game.wrenches.amount.add(3);
                game.stats.totalwrenches = game.stats.totalwrenches.add(3);
            }

            // Double Mastery
            if (Math.random() <= 0.01 * applyUpgrade(game.wrenches.upgrades.doubleMergeMastery)) {
                game.mergeMastery.currentMerges++;
                game.mergeMastery.check(); //There is another one below
            }

            // Faster Beams
            if (Math.random() <= 0.01 * applyUpgrade(game.wrenches.upgrades.fasterBeamChance)) {
                game.beams.time += 0.25;
            }
        }
    }

    if (game.scrapUpgrades.betterBarrels.level == 224) {
        if (game.ms.includes(86) == false) {
            trophyMergeCounter += 1;
            if (trophyMergeCounter > 9999) {
                   game.ms.push(86);
                   GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[86]));
                }
            }
    }

    if (game.mergeMastery.isUnlocked())
    {
        game.mergeMastery.currentMerges++;
        game.mergeMastery.check();
    }

    if (game.bricks.isUnlocked())
    {
        game.bricks.onMerge();
    }

    if(game.tires.isUnlocked())
    {
        game.tires.onMerge();
    }

    game.highestBarrelReached = Math.floor(Math.max(lvl + 1, game.highestBarrelReached));

    if (Math.random() < applyUpgrade(game.magnetUpgrades.magnetMergeChance).toNumber())
    {
        //add the round amount of magnets, and save the remaining (not whole) magnets to add up later
        let amount = getMagnetBaseValue();
        game.remainderMagnets += amount.remainder(1).toNumber();
        let roundAmount = amount.floor();
        let magnetsToAdd = roundAmount.add(Math.floor(game.remainderMagnets));
        game.magnets = game.magnets.add(magnetsToAdd);
        game.remainderMagnets %= 1;
        game.magnets = Decimal.round(game.magnets);

        if(currentScene.name === "Barrels")
        {
            currentScene.popupTexts.push(new PopUpText("+" + formatNumber(magnetsToAdd), bx ? bx : mouseX, by ? by: mouseY, {
                color: "#4040ff",
                size: 0.05
            }));
        }
    }
}

function autoMergeBarrel()
{
    let lvls = [];
    for (let i = 0; i < barrels.length; i++)
    {
        if(barrels[i] !== undefined)
        {
            lvls.push({
                index: i,
                lvl: Math.round(barrels[i].level)
            });
        }
    }

    for (let l of lvls)
    {
        let filtered = lvls.filter(lv => Math.round(lv.lvl) === Math.round(l.lvl));
        if (filtered.length >= 2)
        {
            onBarrelMerge(true, Math.round(barrels[filtered[0].index].level), barrels[filtered[0].index].x, barrels[filtered[0].index].y);
            tempDrawnBarrels[filtered[0].index] = barrels[filtered[0].index].level;
            barrels[filtered[0].index] = new Barrel(barrels[filtered[0].index].level + 1);
            barrels[filtered[1].index] = undefined;
            break;
        }
    }
}

function autoConvertBarrel() {
    if (barrels[19] !== undefined) {
        if (game.dimension == 0) {
            let Amount = new Decimal(barrels[19].level / 10).mul(game.skillTree.upgrades.moreFragments.getEffect(game.skillTree.upgrades.moreFragments.level)).mul(game.darkfragment.upgrades.moreFragments.getEffect(game.darkfragment.upgrades.moreFragments.level)).mul(applyUpgrade(game.solarSystem.upgrades.posus));
            game.fragment.amount = game.fragment.amount.add(Amount);
            game.stats.totalfragments = game.stats.totalfragments.add(Amount);
        }
        else if (game.dimension == 1) {
            game.darkfragment.amount = game.darkfragment.amount.add(((barrels[19].level / 10)));
            game.stats.totaldarkfragments = game.stats.totaldarkfragments.add(((barrels[19].level / 10)));
        }
        barrels[19] = undefined;
    }
}

function setBarrelQuality(idx, fromScene)
{
    barrelsLoaded = false;
    Scene.loadScene("Loading");
    if (game.dimension == 0) {
        for (i = 1; i < 8; i++) {
            images["barrels" + i] = loadImage("Images/Barrels/" + ["barrels" + i + ".png", "barrels" + i + "_lq.png",
                "barrels" + i + "_ulq.png"][idx], () => {
                    barrelsLoaded = true;
                    Scene.loadScene(fromScene ? fromScene : "Barrels");
                });
        }
    }
    if (game.dimension == 1) {
        for (i = 1; i < 8; i++) {
            images["barrels" + i] = loadImage("Images/Barrels/" + ["barrels" + i + "b.png", "barrels" + i + "b_lq.png",
                "barrels" + i + "b_ulq.png"][idx], () => {
                    barrelsLoaded = true;
                    Scene.loadScene(fromScene ? fromScene : "Barrels");
                });
        }
    }
    BARREL_SPRITE_SIZE = [256, 128, 64][idx];
    images.shadowBarrels = []; //clear barrel cache
    images.previewBarrels = [];
}

function updateMouse(e)
{
    let oldmX = mouseX;
    let oldmY = mouseY;

    mouseX = e.clientX * devicePixelRatio || (e.touches && e.touches[0] ? e.touches[0].clientX * devicePixelRatio : mouseX);
    mouseY = e.clientY * devicePixelRatio || (e.touches && e.touches[0] ? e.touches[0].clientY * devicePixelRatio : mouseY);

    mouseMoveX = e.movementX !== undefined ? e.movementX : mouseX - oldmX;
    mouseMoveY = e.movementY !== undefined ? e.movementY : mouseY - oldmY;

    if(e.type === "touchstart")
    {
        mouseMoveX = 0;
        mouseMoveY = 0;
    }
}

function resizeCanvas()
{
    canvas.height = innerHeight * devicePixelRatio;
    canvas.width = innerWidth * devicePixelRatio;
    w = canvas.width;
    h = canvas.height;
}

function handlePress(e)
{
    updateMouse(e);
    mousePressed = true;

    currentScene.onPress();
}

function handleRelease(e)
{
    updateMouse(e);
    mousePressed = false;

    currentScene.onRelease();
}


if (isMobile())
{
    canvas.ontouchstart = function (e)
    {
        handlePress(e);
    };

    canvas.ontouchend = function (e)
    {
        handleRelease(e);
    };

    canvas.ontouchmove = function (e)
    {
        updateMouse(e);
    };
}
else
{
    canvas.onmousedown = function (e)
    {
        handlePress(e);
    };

    canvas.onmousemove = function (e)
    {
        updateMouse(e);
    };

    canvas.onmouseup = function (e)
    {
        handleRelease(e);
    };
}


function spawnBarrel()
{
    let idx = -1;
    for (let i = 0; i < barrels.length; i++)
    {
        if ((barrels[i] === undefined && draggedBarrel === undefined) || (barrels[i] === undefined && draggedBarrel !== undefined && i !== draggedBarrel.originPos))
        {
            idx = i;
            break;
        }
    }

    if (idx !== -1 && game.settings.barrelSpawn == true)
    {
        barrels[idx] = new Barrel(applyUpgrade(game.scrapUpgrades.betterBarrels).toNumber());
    }
}

function maxScrapUpgrades() {
    for (k in game.scrapUpgrades) {
        let upg = game.scrapUpgrades[k];
        while (upg.currentPrice().lte(game.scrap) && upg.level < upg.maxLevel) {
            upg.buy();
        }
    }
}

function maxSunUpgrades() {
        let upg = game.solarSystem.upgrades.sun;
        while (upg.currentPrice().lte(game.magnets) && upg.level < upg.maxLevel) {
            upg.buy();
        }
}

function saveGame(exportGame)
{
    const saveObj = JSON.parse(JSON.stringify(game)); //clone object
    if (saveObj.milestones.unlocked != undefined) {
        if (saveObj.milestones.unlocked.length > 1) {
            saveObj.ms = saveObj.milestones.unlocked;
        }
    }
    saveObj.barrelLvls = [];

    // Added in SC2FMFR 2.1 - rounds up the barrels, for example 21.99999 to 22 (both are barrel 22)
    // Reduces save size a bit (~300 chars less, I went from 11060 to 10716)
    for (let i = 0; i < barrels.length; i++)
    {
        saveObj.barrelLvls[i] = barrels[i] !== undefined ? Math.ceil(barrels[i].level) : undefined;
    }

    // Added in SC2FMFR 2.1: The save shorter 3000!
    // It removes the max. levels from most* upgrades in your save code
    // ...you don't need them in the save code. The game loads them every time anyway.
    // *afaik only tire upgrades are not affected. they are stored a little bit differently
    // It's great: I went from 10716 to 9672 (~1k less)   - both together reduce size by ~14%
    try {

        for (const [key, value] of Object.entries(saveObj)) {
            if (saveObj[key]["upgrades"] != undefined) { // For normal upgrades
                for (const [key2, value2] of Object.entries(saveObj[key]["upgrades"])) {
                    if (saveObj[key]["upgrades"][key2]["maxLevel"] != undefined || saveObj[key]["upgrades"][key2]["maxLevel"] == null) {
                        delete saveObj[key]["upgrades"][key2].maxLevel;
                    }
                }
            }

            else { // Upgrades such as scrapUpgrades which do not have another upgrades array...
                for (const [key2, value2] of Object.entries(saveObj[key])) {
                    if (saveObj[key][key2] != undefined) {
                        if (saveObj[key][key2]["maxLevel"] != undefined || saveObj[key][key2]["maxLevel"] == null) {
                            delete saveObj[key][key2].maxLevel;
                        }
                    }
                }
            
        
            }
        }

    }
    catch{
        // for the case your javascript is so old it doesn't have Object.entries...
        // it will just skip the entire try part and well, not shorten it at all.
        console.log("Your device might have old JavaScript!");
    }


    if (exportGame)
    {
        let save = btoa(JSON.stringify(saveObj));
        document.querySelector("div.absolute textarea").value = save;
        Utils.copyToClipboard(save);
        alert("The save code has also been copied to your clipboard. Paste it into a text file and keep the file safe.");
    }
    else
    {
        localStorage.setItem("ScrapFanmade", JSON.stringify(saveObj));
    }
}

function loadVal(v, alt)
{
    return v !== undefined ? v : alt;
}

function loadCompare(compareCode) {
    importCode = compareCode.slice(5);
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
        if (compareStats.totaldailyquests == undefined) compareStats.totaldailyquests = new Decimal(0);
    }
}

function loadGame(saveCode)
{
    let loadObj;
    if (saveCode !== undefined)
    {
        if (saveCode == "Mymergequestsbarrelsaretoohighohno") {
            game.highestBarrelReached = 1;
            for (i = 0; i < 3; i++) {
                game.mergeQuests.quests[i].active = false;
                game.mergeQuests.quests[i].currentCooldown = 0;
            }
        }
        else {
            try {
                loadObj = atob(saveCode);
            }
            catch (e) {
                alert("The provided Save Code could not be decoded.");
                return;
            }
        }
    }
    else
    {
        loadObj = localStorage.getItem("ScrapFanmade");
    }

    if (loadObj !== null)
    {
        try
        {
            loadObj = JSON.parse(loadObj);
        }
        catch (e)
        {
            if (saveCode == "Mymergequestsbarrelsaretoohighohno") {
                document.querySelector("div.absolute textarea").value = "";
                alert("Reset your highest barrel reached successfully!");
            }
            else {
                alert("An error occured while parsing the save code");
            }
            return;
        }


        game.scrap = loadVal(new Decimal(loadObj.scrap), new Decimal(0));
        game.scrapThisPrestige = loadVal(new Decimal(loadObj.scrapThisPrestige), new Decimal(0));
        game.highestScrapReached = loadVal(new Decimal(loadObj.highestScrapReached), new Decimal(0));
        game.magnets = loadVal(new Decimal(loadObj.magnets), new Decimal(0));
        game.highestBarrelReached = loadVal(loadObj.highestBarrelReached, 0);
        game.highestMasteryLevel = loadVal(loadObj.highestMasteryLevel, 0);
        game.milestonesUnlocked = loadVal(loadObj.milestonesUnlocked, 0);
        game.dimension = loadVal(loadObj.dimension, 0);
        game.totalMerges = loadVal(loadObj.totalMerges, 0);
        game.selfMerges = loadVal(loadObj.selfMerges, 0);


        if (loadObj.settings == undefined) {
            loadObj.settings = { "barrelQuality": 1 };
        }
        game.settings.barrelGalleryPage = loadVal(loadObj.settings.barrelGalleryPage, 0);
        game.settings.barrelShadows = loadVal(loadObj.settings.barrelShadows, false);
        game.settings.useCachedBarrels = loadVal(loadObj.settings.useCachedBarrels, false);
        game.settings.numberFormatType = loadVal(loadObj.settings.numberFormatType, 0);
        game.settings.barrelQuality = loadVal(loadObj.settings.barrelQuality, 1);
        game.settings.destroyBarrels = loadVal(loadObj.settings.destroyBarrels, false);
        game.settings.autoMerge = loadVal(loadObj.settings.autoMerge, false);
        game.settings.autoConvert = loadVal(loadObj.settings.autoConvert, false);
        game.settings.resetConfirmation = loadVal(loadObj.settings.resetConfirmation, true);
        game.settings.lowPerformance = loadVal(loadObj.settings.lowPerformance, false);
        game.settings.musicOnOff = loadVal(loadObj.settings.musicOnOff, false);
        game.settings.barrelSpawn = loadVal(loadObj.settings.barrelSpawn, true);
        game.settings.musicSelect = loadVal(loadObj.settings.musicSelect, 0);
        game.settings.C = loadVal(loadObj.settings.C, 0);
        game.settings.beamTimer = loadVal(loadObj.settings.beamTimer, false);

        C = ["default", "darkblue", "dark"][game.settings.C];

        //if (game.scrap == Infinity) game.scrap = new Decimal(0);
        // Whoever...
        // Put that awful crap there...
        // See you in HELL!
        
        if (loadObj.goldenScrap !== undefined)
        {
            game.goldenScrap.amount = loadVal(new Decimal(loadObj.goldenScrap.amount), new Decimal(0));
            if (loadObj.goldenScrap.upgrades !== undefined)
            {
                Object.keys(loadObj.goldenScrap.upgrades).forEach(k =>
                {
                    game.goldenScrap.upgrades[k].level = loadVal(loadObj.goldenScrap.upgrades[k].level, 0);
                });
            }
        }

        if (loadObj.stats !== undefined) {
            Object.keys(loadObj.stats).forEach(k => {
                if (loadObj.stats[k] != undefined) {
                    game.stats[k] = loadVal(new Decimal(loadObj.stats[k]), new Decimal(0));
                }
                else {
                    game.stats[k] = new Decimal(0);
                }
            });
        }
        else {
            Object.keys(game.stats).forEach(k => {
                game.stats[k] = new Decimal(0);
            });
            if (loadObj.selfMerges != undefined) game.stats.totalwrenches = new Decimal(loadObj.selfMerges.amount);
            if (loadObj.beams != undefined) game.stats.totalbeams = new Decimal(loadObj.beams.amount);
            if (loadObj.aerobeams != undefined) game.stats.totalaerobeams = new Decimal(loadObj.aerobeams.amount);
            if (loadObj.angelbeams != undefined) game.stats.totalangelbeams = new Decimal(loadObj.angelbeams.amount);
            if (loadObj.darkscrap != undefined) game.stats.totaldarkscrap = new Decimal(loadObj.darkscrap.amount);
            if (loadObj.fragment != undefined) game.stats.totalfragments = new Decimal(loadObj.fragment.amount);
            if (loadObj.darkfragment != undefined) game.stats.totaldarkfragments = new Decimal(loadObj.darkfragment.amount);
        }

        if (loadObj.scrapUpgrades !== undefined)
        {
            Object.keys(loadObj.scrapUpgrades).forEach(k =>
            {
                game.scrapUpgrades[k].level = loadVal(loadObj.scrapUpgrades[k].level, 0);
            });
        }

        if (loadObj.magnetUpgrades !== undefined)
        {
            Object.keys(loadObj.magnetUpgrades).forEach(k =>
            {
                game.magnetUpgrades[k].level = loadVal(loadObj.magnetUpgrades[k].level, 0);
            });
        }

        if (loadObj.solarSystem && loadObj.solarSystem.upgrades)
        {
            Object.keys(loadObj.solarSystem.upgrades).forEach(k =>
            {
                game.solarSystem.upgrades[k].level = loadVal(loadObj.solarSystem.upgrades[k].level, 0);
            });
        }

        if (loadObj.solarSystem.upgrades.astro == undefined) {
            game.solarSystem.upgrades.astro.level = 0;
            game.solarSystem.upgrades.mythus.level = 0;
        }

        if (loadObj.mergeQuests)
        {
            game.mergeQuests.mergeTokens = loadVal(new Decimal(loadObj.mergeQuests.mergeTokens), new Decimal(0));
            if (game.mergeQuests.mergeTokens == "NaN") game.mergeQuests.mergeTokens = new Decimal(50);
            if (loadObj.mergeQuests.dailyQuest == undefined) loadObj.mergeQuests.dailyQuest = new MergeQuest(12000, [5]);
            game.mergeQuests.scrapyard = loadVal(loadObj.mergeQuests.scrapyard, 1);
            game.mergeQuests.scrapyardProgress = loadVal(loadObj.mergeQuests.scrapyardProgress, 0);
            game.mergeQuests.nextDaily = loadVal(loadObj.mergeQuests.nextDaily, "20220721");
            if (loadObj.mergeQuests.quests) {
                for (let [i, q] of loadObj.mergeQuests.quests.entries()) {
                    game.mergeQuests.quests[i].barrelLvl = q.barrelLvl;
                    game.mergeQuests.quests[i].active = q.active;
                    game.mergeQuests.quests[i].reward = q.reward;
                    game.mergeQuests.quests[i].cooldown = q.cooldown;
                    game.mergeQuests.quests[i].currentCooldown = q.currentCooldown;
                    game.mergeQuests.quests[i].currentMerges = q.currentMerges;
                    game.mergeQuests.quests[i].neededMerges = q.neededMerges;
                }
            }
            if (loadObj.mergeQuests.dailyQuest) {
                let q = loadObj.mergeQuests.dailyQuest;
                    game.mergeQuests.dailyQuest.barrelLvl = q.barrelLvl;
                    game.mergeQuests.dailyQuest.active = q.active;
                    game.mergeQuests.dailyQuest.reward = q.reward;
                    game.mergeQuests.dailyQuest.cooldown = q.cooldown;
                    game.mergeQuests.dailyQuest.currentCooldown = q.currentCooldown;
                    game.mergeQuests.dailyQuest.currentMerges = q.currentMerges;
                    game.mergeQuests.dailyQuest.neededMerges = q.neededMerges;
                
            }
            if (loadObj.mergeQuests.upgrades)
            {
                Object.keys(loadObj.mergeQuests.upgrades).forEach(k =>
                {
                    game.mergeQuests.upgrades[k].level = loadVal(loadObj.mergeQuests.upgrades[k].level, 0);
                });
            }
        }

        if (loadObj.mergeMastery !== undefined)
        {
            game.mergeMastery.level = loadVal(loadObj.mergeMastery.level, 0);
            game.mergeMastery.currentMerges = loadVal(loadObj.mergeMastery.currentMerges, 0);
            if (loadObj.mergeMastery.prestige !== undefined)
            {
                game.mergeMastery.prestige.level = loadVal(loadObj.mergeMastery.prestige.level, 0);
            }
        }

        if (loadObj.bricks !== undefined)
        {
            game.bricks.amount = loadVal(new Decimal(loadObj.bricks.amount), new Decimal(0));
            game.bricks.productionLevel = loadVal(loadObj.bricks.productionLevel, 0);
            game.bricks.currentMergeProgress = loadVal(loadObj.bricks.currentMergeProgress, 0);
            if (loadObj.bricks.upgrades !== undefined)
            {
                for (let k of Object.keys(loadObj.bricks.upgrades))
                {
                    game.bricks.upgrades[k].level = loadVal(loadObj.bricks.upgrades[k].level, 0);
                }
            }
        }

        if (loadObj.tires !== undefined) {
            game.tires.amount = loadVal(new Decimal(loadObj.tires.amount), new Decimal(0));
            game.tires.value = loadVal(new Decimal(loadObj.tires.value), new Decimal(1));
            if (loadObj.tires.upgrades !== undefined) {
                for (let row = 0; row < loadObj.tires.upgrades.length; row++) {
                    for (let col = 0; col < loadObj.tires.upgrades[row].length; col++) {
                        game.tires.upgrades[row][col].level = loadVal(loadObj.tires.upgrades[row][col].level, 0);
                    }
                }
            }
        }
        if (loadObj.fragment !== undefined) {
            game.fragment.amount = loadVal(new Decimal(loadObj.fragment.amount), new Decimal(0));

            if (loadObj.fragment.upgrades !== undefined) {
                Object.keys(loadObj.fragment.upgrades).forEach(k => {
                    game.fragment.upgrades[k].level = loadVal(loadObj.fragment.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.fragment.amount = new Decimal(0);
            Object.keys(game.fragment.upgrades).forEach(k => {
                game.fragment.upgrades[k].level = 0;
            });
        }

        // ANTI EXPLOIT:
        if (loadObj.darkscrap !== undefined) { // 1 q
            if (loadObj.darkscrap.amount > 1000000000000000) {
                loadObj.darkscrap.amount = 1000000;
                if (loadObj.darkscrap.upgrades.darkScrapBoost.level > 30) loadObj.darkscrap.upgrades.darkScrapBoost.level = 30;
                if (loadObj.darkscrap.upgrades.mergeTokenBoost.level > 50) loadObj.darkscrap.upgrades.mergeTokenBoost.level = 50;
                if (loadObj.darkscrap.upgrades.goldenScrapBoost !== undefined) {
                    if (loadObj.darkscrap.upgrades.goldenScrapBoost.level > 100) loadObj.darkscrap.upgrades.goldenScrapBoost.level = 100;
                }
                alert("Exploit abuse detected! Your dark scrap has been reduced to realistic values!")
            }
        }

        if (loadObj.darkscrap !== undefined) {
            game.darkscrap.amount = loadVal(new Decimal(loadObj.darkscrap.amount), new Decimal(0));

            if (loadObj.darkscrap.upgrades !== undefined) {
                Object.keys(loadObj.darkscrap.upgrades).forEach(k => {
                    game.darkscrap.upgrades[k].level = loadVal(loadObj.darkscrap.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.darkscrap.amount = new Decimal(0);
            Object.keys(game.darkscrap.upgrades).forEach(k => {
                game.darkscrap.upgrades[k].level = 0;
            })
        }

        if (loadObj.beams !== undefined) {
            game.beams.amount = loadVal(new Decimal(loadObj.beams.amount), new Decimal(0));
            game.beams.selected = loadVal(new Decimal(loadObj.beams.selected), 0);

            if (loadObj.beams.upgrades !== undefined) {
                Object.keys(loadObj.beams.upgrades).forEach(k => {
                    game.beams.upgrades[k].level = loadVal(loadObj.beams.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.beams.amount = new Decimal(0);
            game.beams.selected = 0;

            Object.keys(game.beams.upgrades).forEach(k => {
                game.beams.upgrades[k].level = 0;
            })
        }

        if (loadObj.aerobeams !== undefined) {
            game.aerobeams.amount = loadVal(new Decimal(loadObj.aerobeams.amount), new Decimal(0));

            if (loadObj.aerobeams.upgrades !== undefined) {
                Object.keys(game.aerobeams.upgrades).forEach(k => {
                    if (loadObj.aerobeams.upgrades[k] != undefined) {
                        game.aerobeams.upgrades[k].level = loadVal(loadObj.aerobeams.upgrades[k].level, 0);
                    }
                    else {
                        game.aerobeams.upgrades[k].level = 0;
                    }
                });
            }
        }
        else {
            game.aerobeams.amount = new Decimal(0);
            Object.keys(game.aerobeams.upgrades).forEach(k => {
                game.aerobeams.upgrades[k].level = 0;
            })
        }

        if (loadObj.angelbeams !== undefined) {
            game.angelbeams.amount = loadVal(new Decimal(loadObj.angelbeams.amount), new Decimal(0));

            if (loadObj.angelbeams.upgrades !== undefined) {
                Object.keys(loadObj.angelbeams.upgrades).forEach(k => {
                    game.angelbeams.upgrades[k].level = loadVal(loadObj.angelbeams.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.angelbeams.amount = new Decimal(0);
            Object.keys(game.angelbeams.upgrades).forEach(k => {
                game.angelbeams.upgrades[k].level = 0;
            })
        }

        if (loadObj.reinforcedbeams !== undefined) {
            game.reinforcedbeams.amount = loadVal(new Decimal(loadObj.reinforcedbeams.amount), new Decimal(0));

            if (loadObj.reinforcedbeams.upgrades !== undefined) {
                Object.keys(loadObj.reinforcedbeams.upgrades).forEach(k => {
                    game.reinforcedbeams.upgrades[k].level = loadVal(loadObj.reinforcedbeams.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.reinforcedbeams.amount = new Decimal(0);
            Object.keys(game.reinforcedbeams.upgrades).forEach(k => {
                game.reinforcedbeams.upgrades[k].level = 0;
            })
        }

        if (loadObj.darkfragment !== undefined) {
            game.darkfragment.amount = loadVal(new Decimal(loadObj.darkfragment.amount), new Decimal(0));

            if (loadObj.darkfragment.upgrades !== undefined) {
                Object.keys(loadObj.darkfragment.upgrades).forEach(k => {
                    game.darkfragment.upgrades[k].level = loadVal(loadObj.darkfragment.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.darkfragment.amount = new Decimal(0);
            Object.keys(game.darkfragment.upgrades).forEach(k => {
                game.darkfragment.upgrades[k].level = 0;
            })
        }

        if(loadObj.skillTree !== undefined && loadObj.skillTree.upgrades !== undefined)
        {
            for (let k of Object.keys(game.skillTree.upgrades))
            {
                if (loadObj.skillTree.upgrades[k] != undefined) {
                    game.skillTree.upgrades[k].level = loadVal(loadObj.skillTree.upgrades[k].level, 0);
                }
                else {
                    game.skillTree.upgrades[k].level = 0;
                }
            }
        }


        if (loadObj.wrenches !== undefined) {
            game.wrenches.amount = loadVal(new Decimal(loadObj.wrenches.amount), new Decimal(0));

            if (loadObj.wrenches.upgrades !== undefined) {
                Object.keys(loadObj.wrenches.upgrades).forEach(k => {
                    game.wrenches.upgrades[k].level = loadVal(loadObj.wrenches.upgrades[k].level, 0);
                });
            }
        }
        else {
            game.wrenches.amount = new Decimal(0);
            Object.keys(game.wrenches.upgrades).forEach(k => {
                game.wrenches.upgrades[k].level = 0;
            })
        }

        
        if (loadObj.ms !== undefined) {
            if (loadObj.ms != undefined /*&& loadObj.milestones.achievements.length === game.milestones.achievements.length*/) {
                game.ms = loadObj.ms;
            }
            else {
                game.ms = [];
                Milestone.check(false);
            }
        }
        else if (loadObj.milestones !== undefined) {
            if (loadObj.milestones.unlocked != undefined) {
                loadObj.milestones = loadObj.milestones.unlocked;
                game.ms = loadObj.milestones;
            }
            else {
                game.ms = loadObj.milestones;
                Milestone.check(false);
            }
        }
        else {
            game.ms = [];
        }

        if (loadObj.mergeQuests.nextDaily == undefined) loadObj.mergeQuests.nextDaily = "20220721";
        game.milestones.highlighted = Math.min(game.milestones.achievements.length - 1, game.milestones.getHighestUnlocked());


        for (let i = 0; i < loadObj.barrelLvls.length; i++)
        {
            if (loadObj.barrelLvls[i] !== null)
            {
                barrels[i] = new Barrel(loadObj.barrelLvls[i]);
            }
            else
            {
                barrels[i] = undefined;
            }
        }


    }
}

function exportGame()
{
    saveGame(true);
}

function importGame()
{
    alert("Copy the save code you want to import to your clipboard. It will be inserted into the game automatically.")
    navigator.clipboard.readText().then(text =>
    {
        loadGame(text);
    });
}

onresize = e => resizeCanvas();

setup();

function updateBetterBarrels() {
    game.scrapUpgrades.betterBarrels.maxLevel = 3000 + game.solarSystem.upgrades.mythus.level * 20;
    game.beams.upgrades.beamValue.maxLevel = 12 + game.skillTree.upgrades.higherBeamValueMax.level;
}

function calculateCurrentHighest() {
    var currentHighest = 0;
    for (let i = 0; i < barrels.length; i++) {
        if (barrels[i] == undefined) continue;
        if (barrels[i].level > currentHighest) currentHighest = barrels[i].level;
    }
    return currentHighest;
}

updateBetterBarrels();
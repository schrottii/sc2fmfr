var canvas = document.querySelector("#gameCanvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var mouseX = 0, mouseY = 0, mouseMoveX = 0, mouseMoveY = 0;
var mousePressed = false;

var gSplitter = new GraphemeSplitter();

var barrels = [];
var draggedBarrel;
var tempDrawnBarrels = []; //barrels drawn below newly merged barrels
var lastClickedBarrel = -1;
var timeSinceLastBarrelClick = 0;

var currentScene = scenes[0];

var gameNotifications = [];
var movingItems = [];

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

var fallingMagnetTime = 0;

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
        alert("importing game (from text field)...");
        loadGame(document.querySelector("div.absolute textarea").value);
    };
    document.querySelector("div.absolute button#close").onclick = e => document.querySelector("div.absolute").style.display = "none";

    requestAnimationFrame(update);
}

function update()
{
    deltaTimeNew = Date.now();
    let delta = Math.max(0, (deltaTimeNew - deltaTimeOld) / 1000);
    deltaTimeOld = Date.now();

    if (!document.hidden)
    {
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
                movingItemFactory.fallingMagnet(Decimal.round(getMagnetBaseValue().mul(5).mul(applyUpgrade(game.mergeQuests.upgrades.fallingMagnetValue))));
            }
        }

        if(game.milestones.achievements[6].isUnlocked())
        {
            if(game.settings.autoMerge)
            {
                autoMergeTime += delta;
            }
            if(autoMergeTime >= applyUpgrade(game.solarSystem.upgrades.saturn))
            {
                autoMergeBarrel();
                autoMergeTime = 0;
            }
        }

        if(game.mergeQuests.isUnlocked())
        {
            for (let q of game.mergeQuests.quests)
            {
                q.tick(delta);
            }
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
    }

    ctx.font = (h * .02) + "px " + fonts.default;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    //ctx.fillText((1 / delta).toFixed(0) + " fps", w * 0.01, h * 0.005, w);
    //ctx.fillText("mouseMove: [" + mouseMoveX + ", " + mouseMoveY + "]", w * 0.33, h * 0.005, w);

    requestAnimationFrame(update);
}

function getMagnetBaseValue()
{
    return applyUpgrade(game.goldenScrap.upgrades.magnetBoost)
        .mul(applyUpgrade(game.mergeQuests.upgrades.magnetBoost))
        .mul(game.mergeMastery.prestige.currentMagnetBoost())
        .mul(applyUpgrade(game.bricks.upgrades.magnetBoost));
}

function onBarrelMerge(lvl, bx, by)
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
            onBarrelMerge(Math.round(barrels[filtered[0].index].level), barrels[filtered[0].index].x, barrels[filtered[0].index].y);
            tempDrawnBarrels[filtered[0].index] = barrels[filtered[0].index].level;
            barrels[filtered[0].index] = new Barrel(barrels[filtered[0].index].level + 1);
            barrels[filtered[1].index] = undefined;
            break;
        }
    }
}

function setBarrelQuality(idx, fromScene)
{
    barrelsLoaded = false;
    Scene.loadScene("Loading");
    images.barrels = loadImage("Images/" + ["barrels.png", "barrels_lq.png",
        "barrels_ulq.png"][idx], () =>
        {
            barrelsLoaded = true;
            Scene.loadScene(fromScene ? fromScene : "Barrels");
        });
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

    if (idx !== -1)
    {
        barrels[idx] = new Barrel(applyUpgrade(game.scrapUpgrades.betterBarrels).toNumber());
    }
}

function maxScrapUpgrades()
{
    for (k in game.scrapUpgrades)
    {
        let upg = game.scrapUpgrades[k];
        while (upg.currentPrice().lte(game.scrap) && upg.level < upg.maxLevel)
        {
            upg.buy();
        }
    }
}

function saveGame(exportGame)
{
    let saveObj = JSON.parse(JSON.stringify(game)); //clone object
    saveObj.barrelLvls = [];
    for (let i = 0; i < barrels.length; i++)
    {
        saveObj.barrelLvls[i] = barrels[i] !== undefined ? barrels[i].level : undefined;
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

function loadGame(saveCode)
{
    let loadObj;
    if (saveCode !== undefined)
    {
        try
        {
            loadObj = atob(saveCode);
        }
        catch (e)
        {
            alert("The provided Save Code could not be decoded.");
            return;
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
            alert("An error occured while parsing the save code");
            return;
        }

        game.scrap = loadVal(new Decimal(loadObj.scrap), new Decimal(0));
        game.scrapThisPrestige = loadVal(new Decimal(loadObj.scrapThisPrestige), new Decimal(0));
        game.highestScrapReached = loadVal(new Decimal(loadObj.highestScrapReached), new Decimal(0));
        game.magnets = loadVal(new Decimal(loadObj.magnets), new Decimal(0));
        game.highestBarrelReached = loadVal(loadObj.highestBarrelReached, 0);
        game.milestonesUnlocked = loadVal(loadObj.milestonesUnlocked, 0);
        game.settings.barrelGalleryPage = loadVal(loadObj.settings.barrelGalleryPage, 0);
        game.settings.barrelShadows = loadVal(loadObj.settings.barrelShadows, false);
        game.settings.useCachedBarrels = loadVal(loadObj.settings.useCachedBarrels, false);
        game.settings.numberFormatType = loadVal(loadObj.settings.numberFormatType, 0);
        game.settings.barrelQuality = loadVal(loadObj.settings.barrelQuality, 0);
        game.settings.destroyBarrels = loadVal(loadObj.settings.destroyBarrels, false);
        game.settings.autoMerge = loadVal(loadObj.settings.autoMerge, false);
        game.settings.resetConfirmation = loadVal(loadObj.settings.resetConfirmation, true);
        game.settings.lowPerformance = loadVal(loadObj.settings.lowPerformance, false);
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

        if (loadObj.mergeQuests)
        {
            game.mergeQuests.mergeTokens = loadVal(new Decimal(loadObj.mergeQuests.mergeTokens), new Decimal(0));
            if (loadObj.mergeQuests.quests)
            {
                for (let [i, q] of loadObj.mergeQuests.quests.entries())
                {
                    game.mergeQuests.quests[i].barrelLvl = q.barrelLvl;
                    game.mergeQuests.quests[i].active = q.active;
                    game.mergeQuests.quests[i].reward = q.reward;
                    game.mergeQuests.quests[i].cooldown = q.cooldown;
                    game.mergeQuests.quests[i].currentCooldown = q.currentCooldown;
                    game.mergeQuests.quests[i].currentMerges = q.currentMerges;
                    game.mergeQuests.quests[i].neededMerges = q.neededMerges;
                }
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

        if(loadObj.tires !== undefined)
        {
            game.tires.amount = loadVal(new Decimal(loadObj.tires.amount), new Decimal(0));
            game.tires.value = loadVal(new Decimal(loadObj.tires.value), new Decimal(1));
            if(loadObj.tires.upgrades !== undefined)
            {
                for(let row = 0; row < loadObj.tires.upgrades.length; row++)
                {
                    for(let col = 0; col < loadObj.tires.upgrades[row].length; col++)
                    {
                        game.tires.upgrades[row][col].level = loadVal(loadObj.tires.upgrades[row][col].level, 0);
                    }
                }
            }
        }

        if(loadObj.skillTree !== undefined && loadObj.skillTree.upgrades !== undefined)
        {
            for (let k of Object.keys(loadObj.skillTree.upgrades))
            {
                game.skillTree.upgrades[k].level = loadVal(loadObj.skillTree.upgrades[k].level, 0);
            }
        }

        if(loadObj.milestones !== undefined)
        {
            if(loadObj.milestones.achievements !== undefined && loadObj.milestones.achievements.length === game.milestones.achievements.length)
            {
                game.milestones.unlocked = loadObj.milestones.unlocked;
            }
            else
            {
                game.milestones.unlocked = [];
                Milestone.check(false);
            }
        }
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

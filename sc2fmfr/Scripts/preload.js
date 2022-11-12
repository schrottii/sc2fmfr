var barrelsLoaded = false;
var BARREL_SPRITE_SIZE = 64;


function loadImage(path, onload) {
    let img = new Image();
    img.src = path;
    if (onload) {
        img.onload = onload;
    }
    return img;
}

var images =
    {
        barrels: undefined,
        shadowBarrels: [],
        previewBarrels: [],
        appIcon: loadImage("Images/app-icon.png"),
        scrap: loadImage("Images/Currencies/scrap.png"),
        barrelTemplate: loadImage("Images/barrel_template.png"),
        magnet: loadImage("Images/Currencies/magnet.png"),
        goldenScrap: loadImage("Images/Currencies/goldenscrap.png"),
        brick: loadImage("Images/Currencies/brick.png"),
        tire: loadImage("Images/Currencies/tire.png"),
        fragment: loadImage("Images/Currencies/fragment.png"),
        starSmall: loadImage("Images/star_small.png"),
        mergeToken: loadImage("Images/Currencies/mergetoken.png"),
        container: loadImage("Images/container.png"),
        buttonEmpty: loadImage("Images/Buttons/button_empty.png"),
        buttonBack: loadImage("Images/Buttons/button_back.png"),
        buttonMaxAll: loadImage("Images/Buttons/maxall.png"),
        scrap2logo: loadImage("Images/scrap2logo.png"),
        gameNotifaction: loadImage("Images/gamenotification.png"),
        clock: loadImage("Images/clock.png"),
        trophy: loadImage("Images/trophies.png"),
        exportGame: loadImage("Images/Buttons/export_game.png"),
        importGame: loadImage("Images/Buttons/import_game.png"),
        exportImport: loadImage("Images/Buttons/export_import.png"),
        zoomOut: loadImage("Images/Buttons/button_zoom_out.png"),
        zoomIn: loadImage("Images/Buttons/button_zoom_in.png"),
        ezUpgrade: loadImage("Images/Buttons/ez_upgrade.png"),
        highlightedSlot: loadImage("Images/highlighted_slot.png"),
        locked: loadImage("Images/locked.png"),
        logos:
            {
                scrap2: loadImage("Images/scrap2logo.png"),
                discord: loadImage("Images/discord.png"),
                youtube: loadImage("Images/youtube.png"),
                cook1eegames: loadImage("Images/cook1eegames.png")
            },
        options:
            {
                barrelQuality: loadImage("Images/Buttons/barrel_quality.png"),
                numberFormat: loadImage("Images/Buttons/number_format.png")
            },
        arrows:
            {
                left: loadImage("Images/Buttons/arrow_left.png"),
                left_2: loadImage("Images/Buttons/arrow_left_2.png"),
                right: loadImage("Images/Buttons/arrow_right.png"),
                right_2: loadImage("Images/Buttons/arrow_right_2.png"),
            },
        checkbox:
            {
                off: loadImage("Images/Checkbox/checkbox_off.png"),
                on: loadImage("Images/Checkbox/checkbox_on.png"),
                autoMerge:
                {
                    off: loadImage("Images/Checkbox/automerge_off.png"),
                    on: loadImage("Images/Checkbox/automerge_on.png")
                },
                autoConvert:
                {
                    off: loadImage("Images/Checkbox/autoconvert_off.png"),
                    on: loadImage("Images/Checkbox/autoconvert_on.png")
                }
            },
        upgrades:
            {
                betterBarrels: loadImage("Images/Upgrades/betterbarrels.png"),
                fasterBarrels: loadImage("Images/Upgrades/fasterbarrels.png"),
                moreScrap: loadImage("Images/Upgrades/scrapboost.png"),
                moreScrap2: loadImage("Images/Upgrades/scrapboost2.png"),
                magnetBoost: loadImage("Images/Upgrades/magnetboost.png"),
                magnetChance: loadImage("Images/Upgrades/magnetchance.png"),
                goldenScrapBoost: loadImage("Images/Upgrades/goldenscrapboost.png"),
                moreGS: loadImage("Images/Upgrades/moregs.png"),
                brickBoost: loadImage("Images/Upgrades/brickboost.png"),
                brickSpeed: loadImage("Images/Upgrades/brickspeed.png"),
                questSpeed: loadImage("Images/Upgrades/questspeed.png"),
                questLevels: loadImage("Images/Upgrades/questlevels.png"),
                tireBoost: loadImage("Images/Upgrades/tireamount.png"),
                tireChance: loadImage("Images/Upgrades/tirechance.png"),
                fasterMastery: loadImage("Images/Upgrades/fastermastery.png"),
                fasterFallingMagnets: loadImage("Images/Upgrades/fasterfallingmagnets.png"),
            fasterAutoMerge: loadImage("Images/Upgrades/fasterautomerge.png"),
                moreFragments: loadImage("Images/Upgrades/fragmentboost.png")
            },
        scenes:
            {
                scrap: loadImage("Images/Scenes/scrap.png"),
                magnet: loadImage("Images/Scenes/magnet.png"),
                goldenScrap: loadImage("Images/Scenes/goldenscrap.png"),
                barrelGallery: loadImage("Images/Scenes/barrelgallery.png"),
                solarSystem: loadImage("Images/Scenes/solarsystem.png"),
                options: loadImage("Images/Scenes/options.png"),
                mergeQuests: loadImage("Images/Scenes/mergequests.png"),
                milestones: loadImage("Images/Scenes/milestones.png"),
                mergeMastery: loadImage("Images/Scenes/merge_mastery.png"),
                bricks: loadImage("Images/Scenes/bricks.png"),
                tires: loadImage("Images/Scenes/tires.png"),
                fragment: loadImage("Images/Scenes/fragment.png"),
                skillTree: loadImage("Images/Scenes/skilltree.png")
            },
        solarSystem:
            {
                inner: loadImage("Images/SolarSystem/inner.png"),
                sun: loadImage("Images/SolarSystem/sun.png"),
                mercury: loadImage("Images/SolarSystem/mercury.png"),
                venus: loadImage("Images/SolarSystem/venus.png"),
                earth: loadImage("Images/SolarSystem/earth.png"),
                mars: loadImage("Images/SolarSystem/mars.png"),
                jupiter: loadImage("Images/SolarSystem/jupiter.png"),
                saturn: loadImage("Images/SolarSystem/saturn.png"),
                uranus: loadImage("Images/SolarSystem/uranus.png"),
                neptune: loadImage("Images/SolarSystem/neptune.png")
            },
        achievements:
            {
                locked: loadImage("Images/Achievements/locked.png"),
                unlocked: loadImage("Images/Achievements/unlocked.png")
            },
        movingItems:
            {
                magnet: loadImage("Images/MovingItems/magnet.png"),
                tire: loadImage("Images/MovingItems/tire.png")
            }
    };

var colors =
    {
        bg: "rgb(153, 197, 255)",
        bgFront: "rgb(0, 99, 230)",
        table: "rgb(122, 180, 255)",
        table2: "rgb(181, 213, 255)",
        scrollTrack: "rgb(0,80,197)",
        scrollTrackbg: "rgb(118,152,203)",
        skillTreePath: "rgb(0,6,214)"
    };

var fonts =
    {
        default: "Work Sans, Arial, sans-serif",
        title: "Autumn, Arial, sans-serif"
    };

var cacheCanvas = document.createElement("canvas");
document.body.appendChild(cacheCanvas);
cacheCanvas.style.appearance = "none";
cacheCanvas.style.webkitAppearance = "none";
cacheCanvas.classList.add("cache");
var cacheCanvasCtx = cacheCanvas.getContext("2d");

function cacheBarrel(id) {
    let shadowOffset = BARREL_SPRITE_SIZE / 20;

    let x = BARREL_SPRITE_SIZE * (id % Math.floor(images.barrels.width / BARREL_SPRITE_SIZE));
    let y = BARREL_SPRITE_SIZE * Math.floor(id / Math.floor(images.barrels.width / BARREL_SPRITE_SIZE));

    cacheCanvasCtx.clearRect(0, 0, BARREL_SPRITE_SIZE + shadowOffset, BARREL_SPRITE_SIZE + shadowOffset);

    cacheCanvas.width = BARREL_SPRITE_SIZE + shadowOffset;
    cacheCanvas.height = BARREL_SPRITE_SIZE + shadowOffset;
    Utils.setCanvasShadow(cacheCanvasCtx, "#00000060", 0, shadowOffset, shadowOffset);
    cacheCanvasCtx.drawImage(images.barrels, x, y, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);

    let img = new Image();
    img.src = cacheCanvas.toDataURL();

    images.shadowBarrels[id] = img;

    cacheCanvas.width = BARREL_SPRITE_SIZE;
    cacheCanvas.height = BARREL_SPRITE_SIZE;
    cacheCanvasCtx.clearRect(0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);
    Utils.setCanvasShadow(cacheCanvasCtx, "#00000060", 0, shadowOffset + 1000, 0);
    cacheCanvasCtx.translate(-1000, 0);
    cacheCanvasCtx.drawImage(images.barrels, x, y, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE, 0, 0, BARREL_SPRITE_SIZE, BARREL_SPRITE_SIZE);

    img = new Image();
    img.src = cacheCanvas.toDataURL();
    cacheCanvasCtx.translate(1000, 0);
    images.previewBarrels[id] = img;
}


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function () {
        this.sound.play();
    }
    this.pause = function () {
        this.sound.pause();
    }
} 


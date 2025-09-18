class Milestone {
    constructor(id, title, imageId, description, isUnlocked, langConfig, fontColor) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isUnlocked = isUnlocked;
        this.imageId = imageId;
        this.langConfig = langConfig;
        this.fontColor = fontColor ? fontColor : "white";
    }

    getDescriptionDisplay() {
        let desc = tta(1, ("" + game.milestones.highlighted).padStart(3, "0"));
        if (this.langConfig == undefined) return desc;
        for (let lc = 0; lc < this.langConfig.length; lc += 2) {
            desc = desc.replace(this.langConfig[lc], eval(this.langConfig[lc + 1]));
        }
        return desc;
    }

    static check(createNotifs) {
        for (let i = 0; i < game.milestones.achievements.length; i++) {
            if (game.milestones.achievements[i].isUnlocked() && !game.ms.includes(game.milestones.achievements[i].id - 1)) {
                if (createNotifs) {
                    GameNotification.create(new MilestoneNotification(game.milestones.achievements[i].id));
                }
                game.ms.push(game.milestones.achievements[i].id - 1);
                game.milestones.next = game.milestones.getNext();

                if (currentScene.name == "Milestones") renderMilestones();
            }
        }
    }
}
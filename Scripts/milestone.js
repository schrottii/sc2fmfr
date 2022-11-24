class Milestone
{
    constructor(id, title, imageId, description, isUnlocked, fontColor) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.isUnlocked = isUnlocked;
        this.imageId = imageId;
        this.fontColor = fontColor ? fontColor: "white";
    }

    getDescriptionDisplay()
    {
        return typeof this.description === "function" ? this.description() : this.description;
    }

    static check(createNotifs)
    {
        for(let i = 0; i < game.milestones.achievements.length; i++)
        {
            if (game.milestones.achievements[i].isUnlocked() && !game.ms.includes(game.milestones.achievements[i].id - 1))
            {
                if(createNotifs)
                {
                    GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[i].id));
                }
                game.ms.push(game.milestones.achievements[i].id - 1);
                game.milestones.next = game.milestones.getNext();
            }
        }
    }
}
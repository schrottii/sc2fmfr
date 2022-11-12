class Milestone
{
    constructor(title, imageId, description, isUnlocked, fontColor)
    {
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
            if(game.milestones.achievements[i].isUnlocked() && !game.milestones.unlocked.includes(i))
            {
                if(createNotifs)
                {
                    GameNotification.create(new MilestoneNotificaion(game.milestones.achievements[i]));
                }
                game.milestones.unlocked.push(i);
            }
        }
    }
}
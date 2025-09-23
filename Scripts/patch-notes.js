const gameVersionText = "v3.7 (v4.4)";
const fullPatchNotes = `
-> Translations: 
- Added 4 new translations:
- Spanish by elmenda452
- Italian by Barduzzi
- Portuguese by deleteduser0
- Romanian by thunderstorm

-> Beam Factory:
- New feature, unlocked alongside the Factory area (1e100 GS)
- No extra unlock is needed
- Enable or disable it at any time
- When enabled, Beams don't fall
- But you get 10% of their worth automatically instead

-> Performance:
- Improved general performance
- Improved FPS limit option to be even better and no longer underperforming
- Reworked Beam spawning code, improving performance

-> Music:
- Removed Newerwave, remixed Powerbeams and added two new songs
- Before: Voltaic, Newerwave, Getting It Done, Power Beams
- After: Manua Merg, Voltaic, Mobile Destroyery, Getting It Done, Power Beams (Remix)
- Added auto play setting: when one song is over, the next begins, automatically
- Changing the volume no longer resets the song

-> Balance:
- Reduced costs of some Auto Buyers: Better Barrels, Faster Barrels, Scrap Boost
- Brick Upgrades Auto Buyer now costs 8 for the first level (others still 3)
- Reduced costs of some Auto Collectors: Aerobeams, Angel Beams, Re. Beams, Glitch Beams, Tires
- Higher Neptune Max.: reduced Bricks price from e100k to e80k
- Unlock New Tire Upgrades: reduced Tire price from e1M to e100k
- Posus affects Dark Fragments: increased Dark Fragment price from e12 to e20
- F.U.N.: changed boost from x2 to ^1.5 (excluding upgrades you get after it)

-> Achievements:
- Added 25 more Achievements, ending with 300 total!
- Added 3 new Achievement images
- Added more coloring, as most FR Achievements so far had no color: 
- Yellow for Unlocks
- Blue for Barrels
- Gray for Second Dimension
- Green when you need to grind, hoard or go out of your way
- Pink is for Secret Achievements
- Adjusted some descriptions slightly
- Moved some Achievements around
- They Call Me Santa: 100 Gifts -> 60 Gifts

-> Other:
- Added infinity notation
- Notation support for upgrade levels
- Reinforced Beams look broken after 33% and 66% progress
- Changed Screw image, with white outline
- Aerobeams no longer need to be selected for Glitches to spawn, any Beams work now
- Added favicon (for web version)
- Scrolling is faster and no longer bound to FPS
- Merge Quests: duplicates can no longer appear
- Scrapyard: added too expensive text, and also bought levels text for Hyperbuy
- Made Tire Upgrades more spaced out
- Changed Generator fill text color
- Changed Beam rounding
- Second Dimension text says how much merges give (x1.05 per merge, triple for manual)
- Mastery/merges display (bottom left) now only shows Merge Quests and daily if within a range of 5 barrels

-> Fixes:
- Changed how the game handles eternity values (>1e1e300), to prevent crashes and issues
- Fixed factory 0 time issue
- Fixed GS storm issue
- Fixed being able to get too many Mythus levels with Hyperbuy
`;

var patchNotesPage = 0;
var currentPatchNotes = fullPatchNotes.split("\n");
currentPatchNotes.splice(0, 1);

function splitLongNotes() {
	let tempNotes = [];
	for (let pn = 0; pn < currentPatchNotes.length; pn++) {
		if (currentPatchNotes[pn].length > 100) {
			let index = currentPatchNotes[pn].substr(0, 100).lastIndexOf(" ");
			tempNotes.push(currentPatchNotes[pn].substr(0, index));
			tempNotes.push(currentPatchNotes[pn].substr(index));
		}
		else tempNotes.push(currentPatchNotes[pn]);
	}
	currentPatchNotes = tempNotes;
}
splitLongNotes();
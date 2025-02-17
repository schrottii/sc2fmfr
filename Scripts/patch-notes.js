const gameVersionText = "v3.6.1 (v4.3.1)";
const fullPatchNotes = `
-> Patch Notes:
- Patch notes can now be read in-game! (only current version)
- Access them from Options (top right)
- Longer notes can have multiple pages, 30 lines/page

-> Performance:
- Improved FPS limit option to be more efficient and be closer to the goal FPS
- Heavily optimized calculations of the Achievement list (better performance)
- Improved barrel star rendering, and it supports notations now

-> Supernova:
- If all upgrades of a dust type are locked, no dust can be refunded anymore
- Dust refund when some are locked is now more accurate
- (Design) Made background square longer to include emblem amount

-> Mythus:
- Increased Mythus effect from 20 to 50 barrels per level
- This will cause some players to get a progress boost
- Added a notification when Mythus can be upgraded (appears when a new highest barrel is reached)

-> Other:
- Added the ability to remove friends from the friend list
- All three Shrine upgrades now show their level progress until maxed
- Added a notification when the crafting cooldown is over
- Changing the width limit setting now needs to be confirmed. If not, it gets reset after 10 seconds. This is to prevent softlocking on certain devices.
- The Hyper Buy LVL and % buttons are now always visible if the level/percentage aren't at the default value, to prevent complications after a supernova (where the tree upgrade is lost)
- Fragments scene: moved Dark Fragment upgrades lower for aesthetic purposes
- Increased max. width for Achievement descriptions
- More Tokens yay Achievement: clarified that the Tree Upgrade is needed
- Fixed rounding issue affecting certain low-quantity currencies
- Fixed hyperbuy factory cooldown ignoring exploit
- Fixed third Merge Quest time issue
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
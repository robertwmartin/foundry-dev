// Get all actors in the world (for dev testing)
// const actors = game.actors.filter(a => a.hasPlayerOwner);
const actors = game.actors.contents;

// Create an array of actor data snapshots
const backupData = actors.map(actor => {
  return {
    name: actor.name,
    id: actor.id,
    type: actor.type,
    data: actor.toObject()
  };
});

// Convert to JSON
const json = JSON.stringify(backupData, null, 2);

// Save to file (uses browser's download feature)
const filename = `actor-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
const blob = new Blob([json], { type: "application/json" });

// Trigger download
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = filename;
a.click();

ui.notifications.info(`Backed up ${actors.length} actors.`);



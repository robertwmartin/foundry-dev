new Dialog({
  title: "Session End Backup",
  content: `<p>Which actors would you like to back up?</p>`,
  buttons: {
    all: {
      label: "All Actors (dev testing)",
      callback: () => runBackup(game.actors.contents)
    },
    pcs: {
      label: "Player Characters Only",
      callback: () => runBackup(game.actors.filter(a =>
        a.type === "character" &&
        Object.entries(a.ownership).some(([userId, level]) => {
          const user = game.users.get(userId);
          return user && !user.isGM && level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        })
      ))
    },
    playerPlus: {
      label: "Player Characters + Player-Controlled NPCs",
      callback: () => runBackup(game.actors.filter(a =>
        ["character", "npc"].includes(a.type) &&
        Object.entries(a.ownership).some(([userId, level]) => {
          const user = game.users.get(userId);
          return user && !user.isGM && level >= CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;
        })
      ))
    },
    selected: {
      label: "Selected Tokens Only",
      callback: () => {
        const selected = canvas.tokens.controlled.map(t => t.actor).filter(Boolean);
        if (selected.length === 0) {
          ui.notifications.warn("No tokens selected.");
          return;
        }
        runBackup(selected);
      }
    }
  },
  default: "playerPlus"
}).render(true);


// --- Backup Logic ---
function runBackup(actors) {
  const backupData = actors.map(actor => ({
    name: actor.name,
    id: actor.id,
    type: actor.type,
    data: actor.toObject()
  }));

  const json = JSON.stringify(backupData, null, 2);
  const filename = `actor-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  const blob = new Blob([json], { type: "application/json" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();

  ui.notifications.info(`🗃️ Backup complete: ${actors.length} actor(s) exported.`);

  let backedUpNames = actors.map(a => a.name).join(", ");
  ChatMessage.create({
    content: `<strong>Session End Backup:</strong> Backed up ${actors.length} actor(s): ${backedUpNames}`,
    whisper: ChatMessage.getWhisperRecipients("GM")
  });
}

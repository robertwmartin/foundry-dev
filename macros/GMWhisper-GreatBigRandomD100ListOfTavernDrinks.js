// Name of your RollTable
const tableName = "Great Big Random d100 List of Tavern Drinks";

// Find the table
const table = game.tables.getName(tableName);

if (!table) {
  ui.notifications.error(`RollTable "${tableName}" not found.`);
} else {
  // Roll on the table
  table.roll().then(result => {
    const drink = result.results[0];
    ChatMessage.create({
      content: `🍻 <strong>Tavern Drink:</strong><br />${drink.text}`,
      whisper: [game.user.id]
    });
  });
}
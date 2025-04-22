function stripHtml(html) {
  let tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

const lines = [];

lines.push(`Chat Log Export — ${new Date().toLocaleString()}`);
lines.push(`-------------------------------------------`);

for (let msg of game.messages) {
  const timestamp = new Date(msg.timestamp).toLocaleString();
  const user = msg.author?.name ?? "Unknown User";
  const speaker = msg.speaker?.alias ?? "Unknown Speaker";
  const whisper = msg.whisper?.length
    ? game.users.contents
        .filter(u => msg.whisper.includes(u.id))
        .map(u => u.name)
        .join(", ")
    : null;
  const isBlind = msg.blind ? " (Blind GM-only)" : "";
  const flavor = msg.flavor ?? "";
  const content = stripHtml(msg.content).trim();

  lines.push(`[${timestamp}] ${user} as ${speaker}${isBlind}`);
  if (flavor) lines.push(`  Flavor: ${flavor}`);


  if (msg.roll) {
    lines.push(`  Roll: ${msg.roll.formula} = ${msg.roll.total}`);
  } else {
  // Try to extract roll info from rendered HTML
  const tmp = document.createElement("div");
  tmp.innerHTML = msg.content;

  const formula = tmp.querySelector(".dice-formula")?.innerText?.trim();
  const total = tmp.querySelector(".dice-total")?.innerText?.trim();
  const tooltip = tmp.querySelector(".dice-tooltip")?.innerText?.trim();

  if (formula && total) {
    lines.push(`  Roll (parsed): ${formula} = ${total}`);
  } else if (total) {
    lines.push(`  Roll (total only): ${total}`);
  } else if (tooltip) {
    lines.push(`  Roll (tooltip): ${tooltip}`);
  } else {
    const rawText = tmp.innerText?.trim();
    if (rawText) {
      lines.push(`  Roll (fallback): ${rawText}`);
    } else {
      lines.push(`  Roll: [unreadable]`);
    }
  }
}

  lines.push(`  Message: ${content}`);

  if (whisper) {
    lines.push(`  whispered to: ${whisper}`);
  }

  lines.push(`-------------------------------------------`);
}

const text = lines.join("\n");

// prompt for filename
new Dialog({
  title: "export full chat log",
  content: `
    <p>Enter a name for the exported file (leave blank for timestamped default):</p>
    <input id="chat-log-name" type="text" style="width:100%" placeholder="e.g., Session23-FullDump" />
  `,
  buttons: {
    export: {
      label: "Export",
      callback: html => {
        const inputName = html.find("#chat-log-name").val().trim();
        const filename = (inputName || `chat-full-${new Date().toISOString().replace(/[:.]/g, '-')}`) + ".txt";
        const blob = new Blob([text], { type: "text/plain" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();

        ui.notifications.info(`💬 Exported full chat log (${game.messages.size} messages).`);
      }
    },
    cancel: {
      label: "Cancel"
    }
  },
  default: "export"
}).render(true);:webkitURL
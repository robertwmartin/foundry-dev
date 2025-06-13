# Tavern Drinks RollTable Creation Guide

This document outlines the steps used to create a formatted RollTable for use in Foundry VTT, starting from a PDF-based supplement.

## 🔧 Process Summary

1. **Copied source text** from the original PDF supplement.
   
   1. The PDF supplement "The Great Big Random d100 Table of Tavern Drinks (5e)" was used to create this process. That is located in GameLibrary/DnD5e/GMReferences/RollTables.

2. **Created brace-delimited lines**, one per drink entry.
   
   - Escaped single quotes (`'` → `\'`)
   - Condensed long entries to meet chat line limits
   - Saved to `tavern-drinks.txt`

3. **Sanitized line endings** using `dos2unix`:
   
   ```bash
   dos2unix tavern-drinks.txt
   ```

4. **Ran `tavernRollTable.sh`** to generate HTML-formatted entries.

5. **Pasted results into [rolltable.khorne.me](https://rolltable.khorne.me/post/)** to generate a Foundry-compatible JSON file.

6. **Imported JSON** into Foundry VTT using an empty RollTable stub.

7. **Created macro** in Foundry to whisper a random drink to the GM.

## 📁 Files

- `data/tavern-drinks.txt` – Cleaned, line-based drink descriptions

- `tools/tavernRollTable.sh` – Bash script to format HTML for Foundry

- `data/tavern-drinks-rolltable.json` – Final JSON for import

- `macros/roll-tavern-drink.js` – Macro to whisper a drink result

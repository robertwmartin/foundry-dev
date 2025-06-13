#!/bin/bash

input="tavern-drinks.txt"
output="tavern_drinks_output.txt"

# Clear output file
> "$output"

# Read CSV line by line
while IFS='|' read -r num drinkName drinkColor drinkDescription drinkEffect drinkPrice
do
  # Strip leading/trailing whitespace (optional cleanup)
  drinkName=$(echo "$drinkName" | xargs)
  drinkColor=$(echo "$drinkColor" | xargs)
  drinkDescription=$(echo "$drinkDescription" | xargs)
  drinkEffect=$(echo "$drinkEffect" | xargs)
  drinkPrice=$(echo "$drinkPrice" | xargs)

  # Combine color and description with —
  colorDesc="${drinkColor} — ${drinkDescription}"

  # Build HTML
  html="<strong>${drinkName}</strong><br />${colorDesc}<br /><p></p><strong>Effect:</strong> ${drinkEffect}<br /><p></p><strong>Price:</strong> ${drinkPrice}"

  # Write to output
  echo "$html" >> "$output"
  echo "" >> "$output"  # blank line between entries

done < "$input"

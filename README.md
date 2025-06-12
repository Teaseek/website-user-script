# Website – Shikimori Rating

A userscript that inserts Shikimori rating and vote count into Website anime detail pages.

## Features
- Automatically displays Shikimori rating and votes on Website anime pages.
- Caches results for 1 day.

## Installation & Build

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Teaseek/website-user-script.git
   cd website-user-script
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Build the userscript:**
   ```bash
   pnpm run build
   ```
   The final userscript will appear at `dist/website-user-script.user.js`.

## Adding the Userscript to Tampermonkey

1. Open Tampermonkey in your browser (make sure the extension is installed).
2. Click `Create a new script`.
3. Remove the template code and paste the contents of `dist/website-user-script.user.js`.
4. Save the script (Ctrl+S or File → Save).
5. Go to any anime detail page at https://WEBSITE/item/view/* — the script will automatically show the Shikimori rating.

### Alternative (Drag & Drop)
- Simply drag and drop the `dist/website-user-script.user.js` file into the Tampermonkey dashboard, or open the file in your browser and Tampermonkey will prompt you to install it automatically.

## Development
- Source code is in the `src/` folder.
- All userscript header and variable settings are in `.env` and `package.json`.
- Logger always logs with the package context.
- Prettier/postbuild is used to format the final userscript.
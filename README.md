# Jira Helper Mozilla Add-on

This add-on adds convenient "Copy" buttons to Jira pages, allowing users to quickly copy ticket id.

## Features

- Adds "Copy" buttons to specific Jira elements
- Handles dynamic page changes using MutationObserver
- Safe clipboard operations with error handling
- No duplicate buttons
- Lightweight and easy to use

## Installation

1. Clone or download this repository.
2. make zip from source files. (ex. zip -r ../JiraTicketsHelper.zip . -x "*.DS_Store")
3. Load the extension in your browser (about:debugging in Firefox).
4. Use Jira as usual — "Copy" buttons will appear automatically.

## Development

- Main logic: `source/content.js`
- Uses modern JavaScript (ES6+)
- No external dependencies

## License

MIT

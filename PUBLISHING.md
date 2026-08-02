# Publishing to here.now

The application remains a standalone offline `index.html`. Publishing is optional and handled by `publish.mjs`, which sends only `index.html` to here.now.

## Store the API key safely

Create `.env` in the project root, beside `index.html`:

```sh
cp .env.example .env
chmod 600 .env
```

Then place the key after `HERENOW_API_KEY=`. Never put the key in `index.html`, documentation, a commit, a ZIP archive, or a chat message.

The publisher checks credentials in this order:

1. The `HERENOW_API_KEY` environment variable.
2. The project-local `.env` file.
3. `~/.herenow/credentials`, the location recommended by here.now.

## Publish

```sh
node publish.mjs
```

The first run creates an authenticated permanent site. Later runs update the same site using the ignored `.herenow-publish.json` state file. The script:

- creates or updates the site through the authenticated API;
- rejects any upload path other than `index.html`;
- uploads the HTML through the presigned URL;
- finalizes the version;
- downloads the live page and verifies its SHA-256 hash;
- never logs the API key or writes it into the site.

The default here.now audience is anyone with the link. Do not change access permissions unless explicitly requested.

Official reference: <https://here.now/docs>

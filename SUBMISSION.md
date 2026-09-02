# Cursor marketplace submission (David)

Repo: `https://github.com/davidbbn/contextcore-mcp`

## Before submit

- [ ] Local test: copy repo to `~/.cursor/plugins/local/contextcore`, reload Cursor
- [ ] Connect **`contextcore`** MCP → OAuth → consent → `/contextcore-init` works
- [ ] Optional: disable **`contextcore-stdio`** if not testing PAT path

## Submit to both

| Target | URL |
|--------|-----|
| Official marketplace | https://cursor.com/marketplace/publish |
| Cursor Directory | https://cursor.directory/plugins/new |

## If review stalls

Email `marketplace-publishing@cursor.com` with plugin name **contextcore**, repo URL, submission date.

## After listing

- Update `context-os` `McpConnectPanel` with "Install from Cursor Plugins"
- Update `docs/mcp-user-guide.md` with marketplace link

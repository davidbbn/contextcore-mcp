# Cursor marketplace submission

Repo: `https://github.com/babaVC/contextcore-mcp`

Plugin name: **contextcore** (manifest `name`; display name **ContextCore**)

## Pre-submit checklist

- [x] Repo under **babaVC** org (official home)
- [x] `.cursor-plugin/plugin.json` — name, displayName, description, logo, repository
- [x] Skill at `skills/contextcore/SKILL.md` with frontmatter
- [x] Command at `commands/contextcore-init.md` with frontmatter
- [x] `mcp.json` — remote OAuth server + optional stdio fallback
- [x] MIT license, README, trust link (contextcore.md/trust)
- [ ] Local test: copy to `~/.cursor/plugins/local/contextcore`, reload Cursor
- [ ] Connect **`contextcore`** MCP → browser OAuth → consent
- [ ] Run **`/contextcore-init`** end-to-end

## Submit

| Target | URL | What to paste |
|--------|-----|---------------|
| **Official marketplace** | https://cursor.com/marketplace/publish | `https://github.com/babaVC/contextcore-mcp` |
| **Cursor Directory** | https://cursor.directory/plugins/new | Same repo + one-liner from README |

### Suggested listing copy

**One-liner:** Product context for AI agents — read and propose vision, scope, GTM, rules, and risks over MCP.

**Longer:** ContextCore gives Cursor agents secure access to your project's context (components, rules, skills, risks, open questions) via a hosted MCP gateway. Browser OAuth — no token to paste. Includes the Initialize playbook skill and `/contextcore-init` for first-run setup.

## Deeplinks (after listing)

| Format | URL |
|--------|-----|
| Plugin (repo) | `cursor://anysphere.cursor-deeplink/plugin/install?repo=babaVC%2Fcontextcore-mcp` |
| Plugin (marketplace name) | `cursor://anysphere.cursor-deeplink/plugin/install?name=contextcore` |
| MCP only | `cursor://anysphere.cursor-deeplink/mcp/install?name=contextcore&config=…` |

## If review stalls

Email **marketplace-publishing@cursor.com** with plugin name **contextcore**, repo URL, submission date.

## After listing

- [ ] Update `context-os` `McpConnectPanel` primary deeplink to `?name=contextcore` when marketplace slug is confirmed
- [ ] Update `docs/mcp-user-guide.md` with marketplace search link
- [ ] Remove "Marketplace listing is pending" from README

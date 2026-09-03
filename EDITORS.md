# Which editor?

This repo serves **three audiences**. Pick the row that matches yours.

| Editor | Install from this repo | Initialize | Playbook |
|--------|------------------------|------------|----------|
| **Cursor** | **Plugin** — MCP + skill + `/contextcore-init` | Type `/contextcore-init` or paste the first prompt | Bundled `skills/contextcore/SKILL.md` |
| **Claude Code** | **MCP only** — not the Cursor plugin | Paste `Set up ContextCore and initialize it.` | Over MCP: `read_skill` slug `contextcore` |
| **Other MCP clients** | **Remote URL** or **stdio npm** (see README) | Paste the first prompt | Over MCP: `read_skill` slug `contextcore` |
| **Terminal / CI** | [`contextcore-cli`](https://www.npmjs.com/package/contextcore-cli) | `contextcore` commands | N/A |

## Cursor — full plugin

**[Add to Cursor](cursor://anysphere.cursor-deeplink/plugin/install?repo=babaVC%2Fcontextcore-mcp)** or the button on [contextcore.md](https://contextcore.md).

Installs:

- Remote MCP server (`contextcore`) with browser OAuth
- Optional stdio fallback (`contextcore-stdio`) for PAT/automation
- ContextCore playbook skill (when to read, how to propose, Initialize procedure)
- `/contextcore-init` slash command

Marketplace listing submitted 2026-09-03 — awaiting review. Local test: copy this repo to `~/.cursor/plugins/local/contextcore` and reload Cursor.

## Claude Code — MCP only

Claude Code does **not** use Cursor plugins. The `skills/` and `commands/` folders are **Cursor-native** — Claude ignores them unless you copy content into your own project instructions.

**1. Add the MCP server** (run in your project folder):

```bash
claude mcp add --transport http contextcore https://cloud.contextcore.md/mcp
```

**2. Connect.** On the first tool call, Claude opens browser sign-in and the ContextCore consent screen (projects + write scope).

**3. Initialize.** Paste in chat:

```
Set up ContextCore and initialize it.
```

That triggers the same **Initialize ContextCore** procedure as Cursor's `/contextcore-init` (Connect → Orient → Bootstrap → Handoff). The agent loads the procedure via the `read_skill` MCP tool (slug `contextcore`) or from exported `CONTEXTCORE.md` in a connected repo.

Full guide: [contextcore.md/docs/mcp](https://contextcore.md/docs/mcp)

## Other editors

**Remote HTTP (OAuth when supported):**

```json
{
  "mcpServers": {
    "contextcore": {
      "url": "https://cloud.contextcore.md/mcp"
    }
  }
}
```

**Stdio-only clients** — use the npm package from this repo (`npx contextcore-mcp`) with a Personal Access Token from ContextCore **Account → Integrations**. See README § Standalone stdio package.

## Same gateway for everyone

All paths hit **`https://cloud.contextcore.md/mcp`** (or your on-prem URL). Federation, review gates, and OAuth are server-side — the editor only differs in how it installs and surfaces the playbook.

# ContextCore for Cursor

**Official ContextCore plugin for Cursor** — product context over MCP, the ContextCore playbook skill, and the `/contextcore-init` command.

> **Using Claude Code or another editor?** This repo is still for you — but not as a plugin. See **[EDITORS.md](./EDITORS.md)** for Claude Code, stdio clients, and the terminal CLI.

Give agents **secure access to your ContextCore project context** — vision, audience, scope, tech decisions, rules, skills, risks, and open questions — plus write tools to propose updates.

With a **read-scoped** token or OAuth grant, the agent reads published context only. With **write** access, it can also propose context, rules, skills, risks, and problems (landing in **New** for review unless you have direct-publish permission).

The agent gets exactly the context *you* can see. Access is enforced server-side by ContextCore's org/team/visibility federation.

## Quick start

| Editor | Action |
|--------|--------|
| **Cursor** | [Add to Cursor](cursor://anysphere.cursor-deeplink/plugin/install?repo=davidbbn%2Fcontextcore-mcp) → connect MCP → `/contextcore-init` |
| **Claude Code** | `claude mcp add --transport http contextcore https://cloud.contextcore.md/mcp` → paste `Set up ContextCore and initialize it.` |
| **Details** | [EDITORS.md](./EDITORS.md) |

## Cursor plugin (this repo's primary deliverable)

This repo **is** the ContextCore Cursor plugin — skills, commands, and MCP wiring in one installable bundle. Claude Code and other editors use the **same MCP gateway** but do **not** install the plugin bundle; see [EDITORS.md](./EDITORS.md).

**Marketplace listing is pending.** To test locally:

1. Clone this repo (or symlink it) to `~/.cursor/plugins/local/contextcore`
2. Open **Cursor → Customize → Plugins** and enable the local plugin
3. Connect the **`contextcore`** MCP server (browser OAuth on first use)
4. Configure variables if needed (on-prem URLs, or a PAT for the stdio fallback)
5. Type **`/contextcore-init`** in chat to run the first-run Initialize procedure

The plugin ships:

| Component | Path | Cursor only? |
|-----------|------|--------------|
| Skill | `skills/contextcore/SKILL.md` | Yes — Cursor plugin format |
| Command | `commands/contextcore-init.md` | Yes — `/contextcore-init` |
| MCP | `mcp.json` | Remote OAuth works in any editor that supports HTTP MCP |

Trust and security posture: [contextcore.md/trust](https://contextcore.md/trust)

## Claude Code (MCP only — not the plugin)

```bash
claude mcp add --transport http contextcore https://cloud.contextcore.md/mcp
```

Browser OAuth on the first MCP call. Then paste **`Set up ContextCore and initialize it.`** in chat — same Initialize procedure as `/contextcore-init`, loaded over MCP via `read_skill` (`contextcore`).

More: [EDITORS.md § Claude Code](./EDITORS.md#claude-code--mcp-only) · [MCP user guide](https://contextcore.md/docs/mcp)

## MCP servers in the plugin (Cursor)

**Primary — `contextcore` (remote / OAuth).** No token to paste. The first request opens browser sign-in and consent. Configure **`CONTEXTCORE_MCP_URL`** (default `https://cloud.contextcore.md/mcp`).

**Fallback — `contextcore-stdio`.** For headless setups or when you prefer a Personal Access Token. Set **`CONTEXTCORE_TOKEN`** and optionally **`CONTEXTCORE_API_URL`**. Uses this repo's npm package via `npx`.

If you only use OAuth, leave **`CONTEXTCORE_TOKEN`** unset and **disable** the `contextcore-stdio` server in Cursor MCP settings — otherwise it shows as failed until a token is configured.

**On-prem:** point **`CONTEXTCORE_MCP_URL`** and **`CONTEXTCORE_API_URL`** at your instance.

## What your agent gets

Read tools (default):

| Tool | What it returns |
|------|-----------------|
| `list_projects` | Projects you can access (id, name, tagline) |
| `get_manifest` | Resolved map, gaps, counts, watch roll-ups |
| `get_context_core` | A project's full context as one Markdown document |
| `get_context_tree` | File layout of the Core export |
| `read_component` | One component (e.g. `vision`, `scope`, `tech`) as Markdown |
| `read_rule` / `read_skill` | One rule or skill by slug — use **`contextcore`** for the platform playbook |
| `list_components` | Component list for a project |
| `search_context` | Keyword matches across pieces, rules, skills, risks, and problems |

Write tools (write-scoped token or OAuth grant with propose changes):

| Tool | What it does |
|------|----------------|
| `propose_context` | Propose a context piece or update (with `why` evidence) |
| `propose_rule` / `propose_skill` | Propose agent guidance assets |
| `flag_risk` / `flag_problem` | Propose watch items |
| `list_suggestions` | List pending items in New |
| `review` | Approve or reject a suggestion |

Tools are fetched from the server at startup — no package upgrade needed when the gateway adds tools.

## Standalone stdio package (non-Cursor editors)

The **`contextcore-mcp`** npm package (`bin/cli.js` in this repo) is a JSON-RPC proxy for **stdio-only** MCP clients. The Cursor plugin reuses it as `contextcore-stdio`; other editors can use it directly:

```json
{
  "mcpServers": {
    "contextcore": {
      "command": "npx",
      "args": ["-y", "contextcore-mcp"],
      "env": { "CONTEXTCORE_TOKEN": "YOUR_TOKEN" }
    }
  }
}
```

For sync/review/propose from the terminal, see [`contextcore-cli`](https://www.npmjs.com/package/contextcore-cli).

## Manual MCP config (no plugin)

Remote OAuth — works in Cursor, Claude Code, and other HTTP MCP clients:

```json
{
  "mcpServers": {
    "contextcore": {
      "url": "https://cloud.contextcore.md/mcp"
    }
  }
}
```

Mint a token under **Account → Integrations** only if you need stdio or automation.

## Sync workflow (maintainers)

Playbook copy lives in the main ContextCore app repo, not here. **`skills/`** and **`commands/`** are generated — do not hand-edit.

1. Edit `src/constants/mcpPlaybook.js` in [context-os](https://github.com/davidbbn/context-os) (private app repo)
2. Run `npm run sync:cursor-plugin` from that repo

That writes `skills/contextcore/SKILL.md`, `commands/contextcore-init.md`, and dogfoods the command into `context-os/.cursor/commands/`.

## Configuration

| Variable / env | Required | Default | Description |
|----------------|----------|---------|-------------|
| `CONTEXTCORE_MCP_URL` | no | `https://cloud.contextcore.md/mcp` | Remote MCP gateway (plugin variable) |
| `CONTEXTCORE_API_URL` | no | `https://cloud.contextcore.md` | App origin for stdio proxy |
| `CONTEXTCORE_TOKEN` | stdio only | — | Personal Access Token from ContextCore |

Legacy `CONTEXTOS_TOKEN` / `CONTEXTOS_API_URL` still work in the stdio client.

## Security

- OAuth grant or token maps to one ContextCore user. Federation gates match the web app.
- Write proposals land in **New** unless you have direct-publish permission.
- Token hashes only — revoke anytime from **Account → Integrations**.
- Never commit tokens. Use plugin variables or `${env:…}` in config.

See [contextcore.md/trust](https://contextcore.md/trust).

## License

MIT

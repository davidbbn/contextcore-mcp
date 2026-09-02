# ContextCore for Cursor

Give Cursor **secure access to your ContextCore project context** — vision, audience, scope, tech decisions, rules, skills, risks, and open questions — plus write tools to propose updates.

With a **read-scoped** token or OAuth grant, the agent reads published context only. With **write** access, it can also propose context, rules, skills, risks, and problems (landing in **New** for review unless you have direct-publish permission).

The agent gets exactly the context *you* can see. Access is enforced server-side by ContextCore's org/team/visibility federation.

## Cursor plugin

This repo is the **ContextCore Cursor plugin** — skills, commands, and MCP server wiring in one installable bundle.

**Marketplace listing is pending.** To test locally:

1. Clone this repo (or symlink it) to `~/.cursor/plugins/local/contextcore`
2. Open **Cursor → Settings → Plugins** and enable the local plugin
3. Configure variables if needed (on-prem URLs, or a PAT for the stdio fallback)
4. Type **`/contextcore-init`** in chat to run the first-run Initialize procedure

The plugin ships:

| Component | Path | Purpose |
|-----------|------|---------|
| Skill | `skills/contextcore/SKILL.md` | Full ContextCore playbook — read before you answer, propose updates |
| Command | `commands/contextcore-init.md` | Human trigger for Initialize (connect → orient → bootstrap → handoff) |
| MCP | `mcp.json` | Two servers — remote OAuth (primary) and stdio PAT fallback |

Trust and security posture: [contextcore.md/trust](https://contextcore.md/trust)

## MCP servers (dual path)

**Primary — `contextcore` (remote / OAuth).** No token to paste. Cursor stores the MCP URL; the first request opens browser sign-in and consent. Configure **`CONTEXTCORE_MCP_URL`** (default `https://cloud.contextcore.md/mcp`).

**Fallback — `contextcore-stdio`.** For headless setups or when you prefer a Personal Access Token. Set **`CONTEXTCORE_TOKEN`** and optionally **`CONTEXTCORE_API_URL`** (default `https://cloud.contextcore.md`). Uses the [`contextcore-mcp`](https://www.npmjs.com/package/contextcore-mcp) npm package via `npx`.

If you only use OAuth, leave **`CONTEXTCORE_TOKEN`** unset and **disable** the `contextcore-stdio` server in Cursor MCP settings — otherwise it shows as failed until a token is configured.

**On-prem:** point **`CONTEXTCORE_MCP_URL`** and **`CONTEXTCORE_API_URL`** at your instance (e.g. `https://onprem.example.com/mcp` and `https://onprem.example.com`).

## What your agent gets

Read tools (default):

| Tool | What it returns |
|------|-----------------|
| `list_projects` | Projects you can access (id, name, tagline) |
| `get_manifest` | Resolved map, gaps, counts, watch roll-ups |
| `get_context_core` | A project's full context as one Markdown document |
| `get_context_tree` | File layout of the Core export |
| `read_component` | One component (e.g. `vision`, `scope`, `tech`) as Markdown |
| `read_rule` / `read_skill` | One rule or skill by slug |
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

The tool list is fetched from the server at startup rather than baked in here, so it stays current without you upgrading the package.

## Standalone stdio package

The **`contextcore-mcp`** npm package (this repo's `bin/cli.js`) is a pure JSON-RPC proxy for editors that only speak stdio MCP. The Cursor plugin includes it as the `contextcore-stdio` server; you can also install it directly:

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

## Manual connect (no plugin)

**Remote (OAuth).** Works in Cursor and Claude Code without installing anything:

```json
{
  "mcpServers": {
    "contextcore": {
      "url": "https://cloud.contextcore.md/mcp"
    }
  }
}
```

Mint a token in ContextCore under **Account → Integrations** if you need the stdio path or automation.

## Sync workflow (maintainers)

Playbook copy lives in the main ContextCore app repo (`context-os`), not here. **`skills/`** and **`commands/`** are generated — do not hand-edit them.

1. Edit `src/constants/mcpPlaybook.js` in [context-os](https://github.com/davidbbn/context-os)
2. From that repo, run:

```bash
npm run sync:cursor-plugin
```

That writes `skills/contextcore/SKILL.md`, `commands/contextcore-init.md`, and dogfoods the command into `context-os/.cursor/commands/`.

## Configuration

| Variable / env | Required | Default | Description |
|----------------|----------|---------|-------------|
| `CONTEXTCORE_MCP_URL` | no | `https://cloud.contextcore.md/mcp` | Remote MCP gateway (plugin variable) |
| `CONTEXTCORE_API_URL` | no | `https://cloud.contextcore.md` | App origin for stdio proxy |
| `CONTEXTCORE_TOKEN` | stdio only | — | Personal Access Token from ContextCore |

The pre-rename `CONTEXTOS_TOKEN` and `CONTEXTOS_API_URL` are still accepted by the stdio client.

## Security

- The token or OAuth grant maps to a single ContextCore user. Every read runs through the same federation gates as the web app — restricted context you can't see is never returned.
- Write access can propose content; proposals default to the **New** tab unless your account has direct-publish permission on the project.
- Only a SHA-256 hash of your token is stored server-side. Revoke any token anytime from **Account → Integrations**.
- Never commit your token. Use plugin variables or environment references in MCP config.

See [contextcore.md/trust](https://contextcore.md/trust) for the full trust posture.

## License

MIT

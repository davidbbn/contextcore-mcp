# contextcore-mcp

Give Cursor, Claude Code, and any other MCP-aware agent **secure access to your ContextCore project context** — vision, audience, scope, tech decisions, rules, skills, risks, and open questions.

With a **read-scoped** token, the agent reads published context only. With a **write-scoped** token, it can also propose context, rules, skills, risks, and problems (landing in New for review unless you have direct-publish permission).

The agent gets exactly the context *you* can see. Access is enforced server-side by ContextCore's org/team/visibility federation — this client holds no authorization logic and can never widen access.

> **Most people don't need this package.** ContextCore's gateway speaks MCP over HTTP, so any editor that supports remote MCP servers can connect with a URL and a token — no install. Use this package only if your client is stdio-only.

## What your agent gets

Read tools (default token):

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

Write tools (write-scoped token only):

| Tool | What it does |
|------|----------------|
| `propose_context` | Propose a context piece or update (with `why` evidence) |
| `propose_rule` / `propose_skill` | Propose agent guidance assets |
| `flag_risk` / `flag_problem` | Propose watch items |
| `list_suggestions` | List pending items in New |
| `review` | Approve or reject a suggestion |

The tool list is fetched from the server at startup rather than baked in here, so it stays current without you upgrading the package.

## Setup

### 1. Generate a token

In ContextCore, open **Account → Integrations → Generate token** and copy it (shown once). Choose **read** or **read + write** scope when minting.

### 2. Connect

**Remote (preferred).** Works in Cursor and Claude Code without installing anything:

```json
{
  "mcpServers": {
    "contextcore": {
      "url": "https://cloud.contextcore.md/mcp",
      "headers": { "Authorization": "Bearer ${env:CONTEXTCORE_TOKEN}" }
    }
  }
}
```

**Stdio (this package).** For clients that don't support remote servers:

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

Cursor reads `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` (per project); Claude Code reads `.mcp.json` in your project root, or:

```bash
claude mcp add contextcore --env CONTEXTCORE_TOKEN=YOUR_TOKEN -- npx -y contextcore-mcp
```

### 3. Use it

Ask your agent things like *"Load the context for my ContextCore project"* or *"What's the target audience according to ContextCore?"*. It will call the tools automatically.

## Configuration

| Env var | Required | Default | Description |
|---------|----------|---------|-------------|
| `CONTEXTCORE_TOKEN` | yes | — | Personal Access Token from ContextCore |
| `CONTEXTCORE_API_URL` | no | `https://cloud.contextcore.md` | ContextCore cloud app base URL |

The pre-rename `CONTEXTOS_TOKEN` and `CONTEXTOS_API_URL` are still accepted.

## Security

- The token maps to a single ContextCore user. Every read runs through the same federation gates as the web app — restricted context you can't see is never returned.
- Write-scoped tokens can propose content; proposals default to the New tab unless your account has direct-publish permission on the project.
- Only a SHA-256 hash of your token is stored server-side. Revoke any token anytime from **Account → Integrations**.
- Never commit your token. Reference it via an environment variable in your MCP config where possible.

## License

MIT

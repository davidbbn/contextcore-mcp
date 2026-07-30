#!/usr/bin/env node
// ContextCore MCP server (stdio).
//
// A pure proxy. ContextCore's gateway already speaks MCP over HTTP, so this
// process does nothing but carry JSON-RPC between your editor's stdio
// transport and that endpoint. It holds no tool definitions and no
// authorization logic: `tools/list` is fetched from the server at startup, and
// every `tools/call` is forwarded verbatim. The server enforces the exact
// org/team/visibility rules the web app uses, so this client can never widen
// access — and can never drift out of sync with the tools on offer.
//
// Most editors can talk to the gateway directly (see the remote-server config
// in the README). This exists for clients that only speak stdio.
//
// Config (environment variables):
//   CONTEXTCORE_TOKEN     required — a Personal Access Token from ContextCore
//                         (Account -> Integrations -> Generate token)
//   CONTEXTCORE_API_URL   optional — base URL of the ContextCore deployment

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const DEFAULT_API_URL = 'https://context-os.babavc.com';
const MCP_ROUTE = '/mcp';
const JSON_RPC_VERSION = '2.0';
const SERVER_NAME = 'contextcore-mcp';
const SERVER_VERSION = '0.0.1';

// CONTEXTOS_* are the pre-rename names, still honoured so existing configs
// keep working.
const TOKEN = process.env.CONTEXTCORE_TOKEN || process.env.CONTEXTOS_TOKEN;
const API_URL = (
  process.env.CONTEXTCORE_API_URL ||
  process.env.CONTEXTOS_API_URL ||
  DEFAULT_API_URL
).replace(/\/+$/, '');
const ENDPOINT = `${API_URL}${MCP_ROUTE}`;

if (!TOKEN) {
  // stderr only — stdout is the MCP transport.
  console.error(
    'contextcore-mcp: missing CONTEXTCORE_TOKEN. Generate one in ContextCore ' +
      '(Account -> Integrations) and set it in your MCP config env.',
  );
  process.exit(1);
}

let nextId = 1;

async function callGateway(method, params) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
      'Mcp-Method': method,
      ...(params?.name ? { 'Mcp-Name': params.name } : {}),
    },
    body: JSON.stringify({
      jsonrpc: JSON_RPC_VERSION,
      id: nextId++,
      method,
      params,
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.error?.message ||
        payload?.error ||
        `ContextCore request failed (${response.status}).`,
    );
  }
  if (payload?.error) throw new Error(payload.error.message || 'ContextCore request failed.');
  return payload?.result ?? {};
}

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const result = await callGateway('tools/list', {});
  return { tools: result.tools ?? [] };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    return await callGateway('tools/call', {
      name: request.params.name,
      arguments: request.params.arguments || {},
    });
  } catch (error) {
    return {
      content: [{ type: 'text', text: error?.message || 'ContextCore request failed.' }],
      isError: true,
    };
  }
});

async function main() {
  await server.connect(new StdioServerTransport());
  console.error(`contextcore-mcp connected (${API_URL})`);
}

main().catch((error) => {
  console.error('contextcore-mcp fatal:', error?.message || error);
  process.exit(1);
});

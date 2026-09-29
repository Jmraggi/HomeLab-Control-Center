# HomeLab Control Center

Modern, local-first web dashboard for observing a home lab. The project currently runs entirely with deterministic local mock data; it does not contact a server or execute system commands.

## Current status

The dashboard monitors a mock `Dell Inspiron N4010` host and presents system health, services, Docker state, and a 24-hour CPU/RAM chart. The interface is prepared for a future Linux monitoring agent, but that agent has not been implemented yet.

## Features

- Responsive dark-mode dashboard with a collapsible sidebar
- System CPU, memory, storage, temperature, and uptime metrics
- Service availability and Docker container monitoring views
- Static 24-hour historical CPU and memory chart
- Local mock provider for development without a server
- Remote-provider architecture with automatic mock fallback
- Runtime validation of future agent payloads with Zod
- Dedicated System, Docker, Services, Network and Settings views
- Container search and status filters, chart metric selection, and manual refresh
- Accessible mobile navigation, loading states, and retry after failed requests

Network currently lists service ports only; traffic, latency and interface metrics
remain unavailable until a future agent provides them. Data-source badges are
shown independently per panel so partial fallback is visible.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- ESLint
- Lucide React icons
- Recharts
- Zod runtime validation
- npm

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Quality checks:

```bash
npm run lint
npm run build
```

## Architecture

```text
Dashboard UI
  ↓
Next.js Route Handlers
  ↓
SystemProvider
  ├── MockSystemProvider
  └── FallbackSystemProvider
        ↓
      RemoteSystemProvider
        ↓
      Linux Agent (future)
```

`SystemProvider` provides the dashboard-shaped data model. `RemoteSystemProvider` will call the future agent endpoints (`/v1/system`, `/v1/services`, `/v1/docker`, and `/v1/history?range=24h`), validates their responses with Zod, and maps them to the dashboard model. No Linux agent exists in this repository or is contacted by default.

When a remote provider is selected but unavailable, times out, returns an HTTP error, or has an invalid payload, `FallbackSystemProvider` serves the existing mock data. Route responses include safe metadata: `source`, `fallback`, `lastUpdated`, and a generic error when applicable. No stack trace, URL, token, or sensitive configuration is exposed.

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `HOMELAB_PROVIDER` | Selects `mock` or `remote`. Unsupported/missing values use mock mode. | `mock` |
| `HOMELAB_AGENT_URL` | Future Linux agent base URL. | empty |
| `HOMELAB_AGENT_TOKEN` | Optional bearer token sent only by the remote provider. | empty |
| `HOMELAB_AGENT_TIMEOUT_MS` | Remote request timeout in milliseconds. | `5000` |

Start from [.env.example](.env.example); `.env*` files are ignored by Git.

## Development without a server

Set `HOMELAB_PROVIDER=mock` (the default). The dashboard, APIs, navigation, graphs, and Settings screen remain fully functional with no Home Lab access and no real IP configured.

## Security

- Keep secrets exclusively in environment variables; never commit a real `.env` file.
- The future Linux agent should use shared-token authentication and private connectivity.
- This project does not require exposing a home-network port to the public internet.
- The remote provider reports only safe fallback metadata to the UI and never exposes tokens, URLs, or stack traces.

## Project structure

```text
src/
  app/          # Pages and Route Handlers
  components/   # Presentational dashboard components
  data/         # Single source of static mock data
  lib/          # Environment configuration helpers
  providers/    # Provider factory, remote and fallback implementations
  types/        # Dashboard types and future-agent Zod contracts
```

## Roadmap

- [x] Dashboard mock
- [ ] Linux monitoring agent
- [ ] Docker integration
- [ ] Historical metrics persistence
- [ ] Multi-server support
- [ ] Authentication
- [ ] Remote access

## Scope today

There is no database, authentication, Supabase integration, Linux agent, live Docker connection, Cloudflare Tunnel, Tailscale, exposed port, or remote access. Those capabilities are deliberately outside this milestone.

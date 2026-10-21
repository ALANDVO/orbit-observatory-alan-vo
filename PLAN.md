# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

skeleton

## Roadmap

### skeleton — FastAPI/React skeleton with health endpoint

Status: done

Acceptance:
- FastAPI backend runs on port 8000 with /health endpoint returning 200
- React + Vite + TypeScript frontend runs on port 5173
- Docker Compose starts both services with healthchecks
- Backend tests pass (pytest)
- Frontend typecheck and build pass

Implementation: `backend/app/main.py`, `backend/app/api/health.py`, `backend/app/core/config.py`, `backend/app/db/session.py`, `backend/requirements.txt`, `backend/Dockerfile`, `backend/.dockerignore`, `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/pages/Dashboard.tsx`, `frontend/src/pages/HealthCheck.tsx`, `frontend/src/api/client.ts`, `frontend/package.json`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore`, `docker-compose.yaml`, `.github/workflows/ci.yml`

Tests: `backend/app/tests/test_health.py`, `backend/app/tests/conftest.py`, `frontend/src/App.test.tsx`

### agent-management — Agent CRUD and listing

Status: planned

Acceptance:
- Create, read, update, delete agents via API
- Frontend dashboard lists agents with pagination
- Agent detail view shows configuration
- SQLite persistence with audit log

### workflow-execution — Workflow execution and monitoring

Status: planned

Acceptance:
- Define workflows as DAGs of agent steps
- Execute workflows with status tracking
- View execution history and logs

### oidc-auth — OIDC authentication with Keycloak

Status: planned

Acceptance:
- Keycloak integration via Docker Compose
- Backend validates JWT tokens
- Frontend login/logout flow
- Protected API endpoints


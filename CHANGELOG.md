# Changelog

## 1.2.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.1.0 — work-in-progress checkpoint

### Added
- Agent management backend API (CRUD operations)
- Agent SQLAlchemy model with name, description, system_prompt, config, is_active
- Pydantic schemas for agent create, update, response, and paginated list
- RESTful API endpoints: POST/GET/PATCH/DELETE /api/v1/agents
- Agent listing with pagination and active status filtering
- Comprehensive test suite for agent API (12 tests)

### Changed
- Updated PLAN.md and feature-plan.json to reflect agent-management progress

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-10-21

### Added
- FastAPI backend skeleton with health endpoints
- React + Vite + TypeScript frontend skeleton
- Docker Compose configuration
- Health check page with database connectivity test
- Basic project structure and documentation

---

Alan Vo · [alanvo.net](https://alanvo.net) · [X: @alanvoasi](https://x.com/alanvoasi)

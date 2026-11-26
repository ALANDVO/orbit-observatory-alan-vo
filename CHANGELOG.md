# Changelog

## 1.6.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.5.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.4.1 — work-in-progress checkpoint

### Added
- Audit logging for agent CRUD operations (create, update, delete)
- AuditLog model tracks entity, action, old_data, and new_data in SQLite

### Changed
- Updated `backend/app/api/agents.py` to create audit entries on agent lifecycle events
- Updated PLAN.md and STATUS.md to reflect agent-management progress

## 1.4.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.3.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

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

---

Alan Vo · [alanvo.net](https://alanvo.net) · [X: @alanvoasi](https://x.com/alanvoasi)

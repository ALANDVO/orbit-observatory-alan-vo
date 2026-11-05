"""Agent API tests."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_create_agent(client):
    """Test creating a new agent."""
    agent_data = {
        "name": "test-agent",
        "description": "A test agent",
        "system_prompt": "You are a helpful assistant",
        "config": {"model": "gpt-4", "temperature": 0.7},
        "is_active": True,
    }
    response = await client.post("/api/v1/agents", json=agent_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "test-agent"
    assert data["description"] == "A test agent"
    assert data["system_prompt"] == "You are a helpful assistant"
    assert data["config"] == {"model": "gpt-4", "temperature": 0.7}
    assert data["is_active"] is True
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


@pytest.mark.asyncio
async def test_create_agent_duplicate_name(client):
    """Test creating agent with duplicate name returns 409."""
    agent_data = {"name": "duplicate-agent"}
    await client.post("/api/v1/agents", json=agent_data)
    response = await client.post("/api/v1/agents", json=agent_data)
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_list_agents(client):
    """Test listing agents with pagination."""
    # Create a few agents
    for i in range(3):
        await client.post("/api/v1/agents", json={"name": f"agent-{i}"})

    response = await client.get("/api/v1/agents?page=1&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 3
    assert data["page"] == 1
    assert data["page_size"] == 2
    assert len(data["items"]) == 2
    assert data["total_pages"] >= 2


@pytest.mark.asyncio
async def test_list_agents_filter_active(client):
    """Test listing agents filtered by active status."""
    await client.post("/api/v1/agents", json={"name": "active-agent", "is_active": True})
    await client.post("/api/v1/agents", json={"name": "inactive-agent", "is_active": False})

    response = await client.get("/api/v1/agents?is_active=true")
    assert response.status_code == 200
    data = response.json()
    for agent in data["items"]:
        assert agent["is_active"] is True

    response = await client.get("/api/v1/agents?is_active=false")
    assert response.status_code == 200
    data = response.json()
    for agent in data["items"]:
        assert agent["is_active"] is False


@pytest.mark.asyncio
async def test_get_agent_by_id(client):
    """Test getting agent by ID."""
    create_resp = await client.post("/api/v1/agents", json={"name": "get-by-id-agent"})
    agent_id = create_resp.json()["id"]

    response = await client.get(f"/api/v1/agents/{agent_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == agent_id
    assert data["name"] == "get-by-id-agent"


@pytest.mark.asyncio
async def test_get_agent_by_name(client):
    """Test getting agent by name."""
    await client.post("/api/v1/agents", json={"name": "get-by-name-agent"})

    response = await client.get("/api/v1/agents/name/get-by-name-agent")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "get-by-name-agent"


@pytest.mark.asyncio
async def test_get_agent_not_found(client):
    """Test getting non-existent agent returns 404."""
    response = await client.get("/api/v1/agents/999999")
    assert response.status_code == 404

    response = await client.get("/api/v1/agents/name/nonexistent")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_agent(client):
    """Test updating an agent."""
    create_resp = await client.post("/api/v1/agents", json={"name": "update-agent"})
    agent_id = create_resp.json()["id"]

    update_data = {"description": "Updated description", "is_active": False}
    response = await client.patch(f"/api/v1/agents/{agent_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["description"] == "Updated description"
    assert data["is_active"] is False
    assert data["name"] == "update-agent"  # Unchanged


@pytest.mark.asyncio
async def test_update_agent_name_conflict(client):
    """Test updating agent name to existing name returns 409."""
    await client.post("/api/v1/agents", json={"name": "agent-one"})
    create_resp = await client.post("/api/v1/agents", json={"name": "agent-two"})
    agent_id = create_resp.json()["id"]

    response = await client.patch(f"/api/v1/agents/{agent_id}", json={"name": "agent-one"})
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


@pytest.mark.asyncio
async def test_update_agent_not_found(client):
    """Test updating non-existent agent returns 404."""
    response = await client.patch("/api/v1/agents/999999", json={"name": "new-name"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_agent(client):
    """Test deleting an agent."""
    create_resp = await client.post("/api/v1/agents", json={"name": "delete-agent"})
    agent_id = create_resp.json()["id"]

    response = await client.delete(f"/api/v1/agents/{agent_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_resp = await client.get(f"/api/v1/agents/{agent_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_agent_not_found(client):
    """Test deleting non-existent agent returns 404."""
    response = await client.delete("/api/v1/agents/999999")
    assert response.status_code == 404

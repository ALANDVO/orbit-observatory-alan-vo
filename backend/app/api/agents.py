"""Agent API endpoints."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.models.agent import Agent
from app.schemas.agent import (
    AgentCreate,
    AgentUpdate,
    AgentResponse,
    AgentListResponse,
)

router = APIRouter(prefix="/agents", tags=["agents"])


@router.post(
    "",
    response_model=AgentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new agent",
)
async def create_agent(
    agent_in: AgentCreate,
    db: AsyncSession = Depends(get_db),
) -> AgentResponse:
    """Create a new agent."""
    # Check if agent with same name exists
    result = await db.execute(select(Agent).where(Agent.name == agent_in.name))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Agent with name '{agent_in.name}' already exists",
        )

    agent = Agent(
        name=agent_in.name,
        description=agent_in.description,
        system_prompt=agent_in.system_prompt,
        config=agent_in.config,
        is_active=agent_in.is_active if agent_in.is_active is not None else True,
    )
    db.add(agent)
    await db.commit()
    await db.refresh(agent)
    return agent


@router.get(
    "",
    response_model=AgentListResponse,
    summary="List agents with pagination",
)
async def list_agents(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    is_active: bool | None = Query(None, description="Filter by active status"),
    db: AsyncSession = Depends(get_db),
) -> AgentListResponse:
    """List agents with pagination and optional filtering."""
    # Build base query
    query = select(Agent)
    count_query = select(func.count(Agent.id))

    if is_active is not None:
        query = query.where(Agent.is_active == is_active)
        count_query = count_query.where(Agent.is_active == is_active)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination
    query = query.order_by(Agent.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    agents = result.scalars().all()

    total_pages = (total + page_size - 1) // page_size

    return AgentListResponse(
        items=agents,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/{agent_id}",
    response_model=AgentResponse,
    summary="Get agent by ID",
)
async def get_agent(
    agent_id: int,
    db: AsyncSession = Depends(get_db),
) -> AgentResponse:
    """Get an agent by ID."""
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found",
        )
    return agent


@router.get(
    "/name/{name}",
    response_model=AgentResponse,
    summary="Get agent by name",
)
async def get_agent_by_name(
    name: str,
    db: AsyncSession = Depends(get_db),
) -> AgentResponse:
    """Get an agent by name."""
    result = await db.execute(select(Agent).where(Agent.name == name))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with name '{name}' not found",
        )
    return agent


@router.patch(
    "/{agent_id}",
    response_model=AgentResponse,
    summary="Update an agent",
)
async def update_agent(
    agent_id: int,
    agent_in: AgentUpdate,
    db: AsyncSession = Depends(get_db),
) -> AgentResponse:
    """Update an agent."""
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found",
        )

    # Check for name conflict if name is being changed
    if agent_in.name is not None and agent_in.name != agent.name:
        existing_result = await db.execute(
            select(Agent).where(Agent.name == agent_in.name)
        )
        existing = existing_result.scalar_one_or_none()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Agent with name '{agent_in.name}' already exists",
            )

    update_data = agent_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(agent, field, value)

    await db.commit()
    await db.refresh(agent)
    return agent


@router.delete(
    "/{agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an agent",
)
async def delete_agent(
    agent_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    """Delete an agent."""
    result = await db.execute(select(Agent).where(Agent.id == agent_id))
    agent = result.scalar_one_or_none()
    if not agent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Agent with id {agent_id} not found",
        )

    await db.delete(agent)
    await db.commit()

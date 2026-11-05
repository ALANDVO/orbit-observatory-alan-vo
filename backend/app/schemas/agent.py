"""Agent schemas."""

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict


class AgentBase(BaseModel):
    """Base schema for agent."""

    name: str
    description: Optional[str] = None
    system_prompt: Optional[str] = None
    config: Optional[dict[str, Any]] = None
    is_active: Optional[bool] = None


class AgentCreate(AgentBase):
    """Schema for creating an agent."""

    name: str


class AgentUpdate(AgentBase):
    """Schema for updating an agent."""

    name: Optional[str] = None


class AgentResponse(AgentBase):
    """Schema for agent response."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AgentListResponse(BaseModel):
    """Schema for paginated agent list response."""

    items: list[AgentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

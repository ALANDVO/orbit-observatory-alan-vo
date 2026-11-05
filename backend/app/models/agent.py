"""Agent model."""

from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, Integer, Boolean
from sqlalchemy.dialects.sqlite import JSON

from app.db.session import Base


class Agent(Base):
    """Agent model representing an AI agent configuration."""

    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    system_prompt = Column(Text, nullable=True)
    config = Column(JSON, nullable=True)  # Model config, tools, etc.
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    def __repr__(self) -> str:
        return f"<Agent(id={self.id}, name='{self.name}')>"


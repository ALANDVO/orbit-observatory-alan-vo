"""Audit log model."""

from datetime import datetime
from sqlalchemy import Column, String, JSON, DateTime, Integer

from app.db.session import Base


class AuditLog(Base):
    """Audit log model for tracking changes."""

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    entity = Column(String(100), index=True, nullable=False)  # e.g., "Agent"
    entity_id = Column(Integer, index=True, nullable=False)  # ID of the entity
    action = Column(String(50), nullable=False)  # e.g., "create", "update", "delete"
    old_data = Column(JSON, nullable=True)  # previous state (for updates/deletes)
    new_data = Column(JSON, nullable=True)  # new state (for creates/updates)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<AuditLog(id={self.id}, entity='{self.entity}', action='{self.action}', entity_id={self.entity_id})>"

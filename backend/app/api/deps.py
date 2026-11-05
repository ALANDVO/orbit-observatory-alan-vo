"""API dependencies."""

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db


# Re-export for convenience
__all__ = ["get_db"]

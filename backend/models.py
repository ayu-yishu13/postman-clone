import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from database import Base

class Collection(Base):
    __tablename__ = "collections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    requests = relationship("SavedRequest", back_populates="collection", cascade="all, delete-orphan")

class SavedRequest(Base):
    __tablename__ = "saved_requests"

    id = Column(Integer, primary_key=True, index=True)
    collection_id = Column(Integer, ForeignKey("collections.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    method = Column(String, nullable=False)  # GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
    url = Column(Text, nullable=False)
    headers = Column(Text, nullable=True)  # JSON string
    body_type = Column(String, nullable=True)  # none, raw, form-data, x-www-form-urlencoded
    body_content = Column(Text, nullable=True)  # JSON string or raw text
    auth_type = Column(String, nullable=True)  # none, bearer, basic
    auth_config = Column(Text, nullable=True)  # JSON string
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    collection = relationship("Collection", back_populates="requests")

class Environment(Base):
    __tablename__ = "environments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    variables = relationship("EnvVariable", back_populates="environment", cascade="all, delete-orphan")

class EnvVariable(Base):
    __tablename__ = "env_variables"

    id = Column(Integer, primary_key=True, index=True)
    environment_id = Column(Integer, ForeignKey("environments.id", ondelete="CASCADE"), nullable=False)
    key = Column(String, nullable=False)
    value = Column(Text, nullable=False)

    environment = relationship("Environment", back_populates="variables")

class HistoryItem(Base):
    __tablename__ = "history_items"

    id = Column(Integer, primary_key=True, index=True)
    method = Column(String, nullable=False)
    url = Column(Text, nullable=False)
    headers = Column(Text, nullable=True)  # JSON string
    body_type = Column(String, nullable=True)  # none, raw, form-data, x-www-form-urlencoded
    body_content = Column(Text, nullable=True)  # JSON string or raw text
    auth_type = Column(String, nullable=True)  # none, bearer, basic
    auth_config = Column(Text, nullable=True)  # JSON string
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)
    status_code = Column(Integer, nullable=True)
    response_time_ms = Column(Integer, nullable=True)
    response_size_bytes = Column(Integer, nullable=True)
    is_error = Column(Boolean, default=False)

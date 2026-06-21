import logging
import re
from typing import Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("supply_chain_security")

def log_audit_event(action: str, user: str, details: str):
    """Logs security and important business rule events for auditing."""
    logger.info(f"AUDIT_EVENT | USER: {user} | ACTION: {action} | DETAILS: {details}")

def sanitize_input(text: str) -> str:
    """Basic sanitization to strip dangerous characters from input to prevent basic injection."""
    if not text:
        return text
    # Remove HTML tags or basic script tags
    sanitized = re.sub(r'<[^>]*>', '', text)
    return sanitized

def detect_prompt_injection(text: str) -> bool:
    """
    A simple heuristic check to detect prompt injection attempts.
    In production, this could call an LLM or a specialized classifier.
    """
    suspicious_keywords = ["ignore previous instructions", "system prompt", "bypass", "override", "you are now"]
    text_lower = text.lower()
    for keyword in suspicious_keywords:
        if keyword in text_lower:
            return True
    return False

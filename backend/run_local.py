import os
import time
from collections import defaultdict
from typing import Literal, Dict, List
import re

from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from services.cv_parser import extract_cv_text
from services.model import CoverLetterGenerator

# Load environment variables from .env if present
load_dotenv()

app = FastAPI(
    title="AI Cover Letter Generator API",
    description="Backend API to extract CV and job details and generate personalized cover letters using Mistral AI.",
    version="1.0.0"
)

# CORS middleware configuration (allow all origins for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Rate Limiter (In-Memory: 10 requests per minute per IP) ---
class SimpleRateLimiter:
    """
    In-memory rate limiter tracking requests per IP over a 60-second sliding window.
    """
    def __init__(self, requests_per_minute: int = 10):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, List[float]] = defaultdict(list)

    def check_rate_limit(self, request: Request):
        # Extract IP address considering potential proxy headers
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()
        else:
            client_ip = request.client.host if request.client else "127.0.0.1"

        now = time.time()
        window_start = now - 60.0

        # Filter out timestamps older than 60 seconds
        self.requests[client_ip] = [
            ts for ts in self.requests[client_ip] if ts > window_start
        ]

        if len(self.requests[client_ip]) >= self.requests_per_minute:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Maximum {self.requests_per_minute} requests per minute allowed per IP."
            )

        self.requests[client_ip].append(now)


rate_limiter = SimpleRateLimiter(requests_per_minute=10)


# --- Request and Response Models ---
class GenerateRequest(BaseModel):
    cv_content: str = Field(
        ...,
        description="Plain text content of the CV or base64-encoded PDF string",
        examples=["Experienced software engineer with 5 years in Python and FastAPI..."]
    )
    cv_type: Literal["text", "pdf"] = Field(
        "text",
        description="Format of cv_content: 'text' or 'pdf'"
    )
    job_offer: str = Field(
        ...,
        description="Full text of the target job posting/offer",
        examples=["We are looking for a Senior Backend Developer proficient in Python, FastAPI, and AI integration..."]
    )
    tone: Literal["formal", "creative", "direct"] = Field(
        "formal",
        description="Tone of the cover letter: 'formal', 'creative', or 'direct'"
    )
    language: Literal["fr", "en"] = Field(
        "fr",
        description="Language of the generated letter: 'fr' (French) or 'en' (English)"
    )


class Metadata(BaseModel):
    word_count: int
    language: str


class GenerateResponse(BaseModel):
    letter: str
    metadata: Metadata


# --- API Routes ---
@app.get("/api/health", summary="Health Check")
def health_check():
    """
    Health check endpoint returning system status.
    """
    return {"status": "ok"}


@app.post(
    "/api/generate",
    response_model=GenerateResponse,
    summary="Generate Cover Letter",
    dependencies=[Depends(rate_limiter.check_rate_limit)]
)
def generate_cover_letter(payload: GenerateRequest):
    """
    Generates a personalized cover letter based on candidate CV and target job offer.
    Supports text and PDF input formats, custom tone, and output language.
    """
    try:
        # 1. Extract CV text (decode base64 if PDF)
        cv_text = extract_cv_text(payload.cv_content, payload.cv_type)

        # 2. Instantiate generator service
        generator = CoverLetterGenerator()

        # 3. Generate cover letter text
        letter_text = generator.generate(
            cv_text=cv_text,
            job_offer=payload.job_offer,
            tone=payload.tone,
            language=payload.language
        )

        # 4. Calculate metadata
        word_count = len(letter_text.split())

        return GenerateResponse(
            letter=letter_text,
            metadata=Metadata(
                word_count=word_count,
                language=payload.language
            )
        )

    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except RuntimeError as re:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(re)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )

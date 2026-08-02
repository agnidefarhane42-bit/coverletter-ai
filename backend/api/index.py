"""
FastAPI app for Vercel Python runtime.
Serves cover letter generation endpoints.
"""
import os
import io
import base64
import logging

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CoverLetter AI Backend", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)


# --- Models ---
class GenerateRequest(BaseModel):
    cv_content: str = Field(..., description="CV text or base64 PDF")
    cv_type: str = Field("text", description="'text' or 'pdf'")
    job_offer: str = Field(..., description="Job offer text")
    tone: str = Field("formal", description="formal, creative, or direct")
    language: str = Field("fr", description="fr or en")


# --- Mistral client (lazy init) ---
_mistral_client = None


def get_mistral_client():
    global _mistral_client
    if _mistral_client is None:
        from mistralai import Mistral
        api_key = os.getenv("MISTRAL_API_KEY")
        if not api_key:
            raise ValueError("MISTRAL_API_KEY is not set")
        _mistral_client = Mistral(api_key=api_key)
    return _mistral_client


# --- Prompt builder ---
def build_prompt(cv_text: str, job_offer: str, tone: str = "formal", language: str = "fr") -> str:
    tone_descriptions = {
        "formal": "Professionnel, courtois et respectueux des normes traditionnelles. Utilise un vocabulaire soutenu et des formules de politesse classiques.",
        "creative": "Original, captivant et dynamique. Met en valeur la personnalite du candidat avec une approche innovante tout en restant professionnel.",
        "direct": "Concis, percutant et axe sur les resultats. Va droit au but, met en avant les faits marquants et la valeur ajoutee sans fioritures.",
    }
    selected_tone_desc = tone_descriptions.get(tone.lower(), tone_descriptions["formal"])
    target_lang_str = "francais" if language.lower() == "fr" else "anglais"

    return f"""Tu es un expert en recrutement et en redaction professionnelle.
Ta mission est de rediger une lettre de motivation sur mesure, hautement personnalisee et percutante, en {target_lang_str}.

--- CONSIGNES STRICTES ---
1. LANGUE : {target_lang_str}
2. TON : {tone.upper()} ({selected_tone_desc})
3. LONGUEUR : 250-400 mots
4. STRUCTURE : Intro accroche + Corps (2-3 paragraphes, lien CV-offre) + Conclusion (appel a l'action)
5. AUTHENTICITE : Base-toi sur le CV uniquement. Pas d'invention. Pas de placeholders.
6. UNIQUE : Pas de template generique.

--- CV ---
{cv_text.strip()}

--- OFFRE ---
{job_offer.strip()}

Genere UNIQUEMENT la lettre de motivation.
"""


# --- CV extraction ---
def extract_cv_text(content: str, cv_type: str) -> str:
    if cv_type == "text":
        if not content or not content.strip():
            raise ValueError("CV content cannot be empty.")
        return content.strip()

    if cv_type == "pdf":
        if not content:
            raise ValueError("PDF content is empty.")
        base64_data = content
        if "," in content:
            base64_data = content.split(",", 1)[1]
        try:
            pdf_bytes = base64.b64decode(base64_data)
        except Exception as e:
            raise ValueError(f"Invalid base64: {str(e)}")
        try:
            import pdfplumber
            extracted_pages = []
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_pages.append(page_text.strip())
            full_text = "\n\n".join(extracted_pages)
            if not full_text.strip():
                raise ValueError("Could not extract text from PDF.")
            return full_text
        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"Failed to parse PDF: {str(e)}")

    raise ValueError(f"Unsupported cv_type: '{cv_type}'.")


# --- Routes (with /api/ prefix for Vercel) ---
@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/generate")
async def generate(req: GenerateRequest):
    if not req.cv_content:
        raise HTTPException(status_code=400, detail="Le contenu du CV est requis.")
    if not req.job_offer:
        raise HTTPException(status_code=400, detail="L'offre d'emploi est requise.")

    try:
        cv_text = extract_cv_text(req.cv_content, req.cv_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        prompt = build_prompt(cv_text=cv_text, job_offer=req.job_offer, tone=req.tone, language=req.language)
        client = get_mistral_client()

        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[{"role": "user", "content": prompt}]
        )

        if not response or not response.choices:
            raise HTTPException(status_code=500, detail="Empty response from Mistral AI.")

        letter_content = response.choices[0].message.content
        if not letter_content or not letter_content.strip():
            raise HTTPException(status_code=500, detail="Mistral AI returned empty content.")

        word_count = len(letter_content.split())

        return {
            "letter": letter_content.strip(),
            "metadata": {
                "word_count": word_count,
                "language": req.language,
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

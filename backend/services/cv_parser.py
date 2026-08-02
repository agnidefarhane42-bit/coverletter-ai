import base64
import io
import re
from typing import Dict, List, Optional
import pdfplumber


def extract_cv_text(content: str, cv_type: str) -> str:
    """
    Extract text from CV content based on cv_type ('text' or 'pdf').

    Args:
        content (str): Plain text or base64 encoded PDF string.
        cv_type (str): Type of the CV content ('text' or 'pdf').

    Returns:
        str: Extracted plain text content.

    Raises:
        ValueError: If cv_type is invalid or PDF decoding/extraction fails.
    """
    if cv_type == "text":
        if not content or not content.strip():
            raise ValueError("CV content cannot be empty.")
        return content.strip()

    if cv_type == "pdf":
        if not content:
            raise ValueError("PDF content is empty.")

        # Clean base64 string if data URL prefix exists
        base64_data = content
        if "," in content:
            base64_data = content.split(",", 1)[1]

        try:
            pdf_bytes = base64.b64decode(base64_data)
        except Exception as e:
            raise ValueError(f"Invalid base64 encoding for PDF content: {str(e)}")

        try:
            extracted_pages: List[str] = []
            with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
                for page_num, page in enumerate(pdf.pages, start=1):
                    page_text = page.extract_text()
                    if page_text:
                        extracted_pages.append(page_text.strip())

            full_text = "\n\n".join(extracted_pages)
            if not full_text.strip():
                raise ValueError("Could not extract readable text from PDF file.")

            return full_text
        except Exception as e:
            if isinstance(e, ValueError):
                raise
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

    raise ValueError(f"Unsupported cv_type: '{cv_type}'. Expected 'text' or 'pdf'.")


def extract_cv_sections(text: str) -> Dict[str, str]:
    """
    Extract key sections from CV text using regex patterns.

    Args:
        text (str): Full text of the CV.

    Returns:
        Dict[str, str]: Dictionary containing 'skills', 'experience', 'education', and 'contact_info'.
    """
    if not text:
        return {
            "skills": "",
            "experience": "",
            "education": "",
            "contact_info": ""
        }

    # Section header regex keywords (supports French & English)
    headers = {
        "contact_info": r"(?:contact|coordonn[eé]es|informations? de contact|personal info|profile|profil)",
        "skills": r"(?:comp[eé]tences|skills|savoir-faire|connaissances techniques|technologies|hard skills|soft skills)",
        "experience": r"(?:exp[eé]riences?|exp[eé]rience professionnelle|work experience|employment history|parcours professionnel|exp[eé]riences)",
        "education": r"(?:formation|formations|dipl[oô]mes|education|parcours acad[eé]mique|academic background|études)"
    }

    # Pattern to match section headers at line starts or surrounded by headers indicators
    combined_header_pattern = r"(?i)^(?:[#*=-]|\d+\.|\b)?\s*(" + "|".join(headers.values()) + r")\b\s*[:\-=]*\s*$"

    lines = text.split("\n")
    sections: Dict[str, List[str]] = {
        "contact_info": [],
        "skills": [],
        "experience": [],
        "education": []
    }

    current_section: Optional[str] = None

    # First pass: look for structured sections
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_section:
                sections[current_section].append("")
            continue

        matched_section = None
        for sec_name, sec_regex in headers.items():
            if re.match(r"(?i)^(?:[#*=-]|\d+\.|\b)?\s*" + sec_regex + r"\b\s*[:\-=]*$", stripped):
                matched_section = sec_name
                break

        if matched_section:
            current_section = matched_section
        elif current_section:
            sections[current_section].append(stripped)

    result = {k: "\n".join(v).strip() for k, v in sections.items()}

    # Extract email and phone for contact_info fallback if contact_info is empty
    if not result["contact_info"]:
        emails = re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        phones = re.findall(r"(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{2,4}[\s.-]?\d{2,4}(?:[\s.-]?\d{2,4})?", text)
        contact_parts = []
        if emails:
            contact_parts.append(f"Email: {emails[0]}")
        if phones:
            # Pick phone-like strings with at least 8 digits
            valid_phones = [p.strip() for p in phones if len(re.sub(r"\D", "", p)) >= 8]
            if valid_phones:
                contact_parts.append(f"Phone: {valid_phones[0]}")
        if contact_parts:
            result["contact_info"] = " | ".join(contact_parts)

    return result

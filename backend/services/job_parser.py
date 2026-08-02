import re
from typing import Dict, List, Any, Optional


def extract_job_info(offer_text: str) -> Dict[str, Any]:
    """
    Extract key job details from offer text using regex patterns.

    Args:
        offer_text (str): Job posting text.

    Returns:
        Dict[str, Any]: Extracted metadata containing:
            - company_name (str or None)
            - position (str or None)
            - requirements (List[str])
            - location (str or None)
            - contract_type (str or None)
    """
    if not offer_text or not offer_text.strip():
        return {
            "company_name": None,
            "position": None,
            "requirements": [],
            "location": None,
            "contract_type": None
        }

    cleaned_text = offer_text.strip()

    # 1. Company Name
    company_name = _extract_company_name(cleaned_text)

    # 2. Position / Job Title
    position = _extract_position(cleaned_text)

    # 3. Location
    location = _extract_location(cleaned_text)

    # 4. Contract Type
    contract_type = _extract_contract_type(cleaned_text)

    # 5. Requirements List
    requirements = _extract_requirements(cleaned_text)

    return {
        "company_name": company_name,
        "position": position,
        "requirements": requirements,
        "location": location,
        "contract_type": contract_type
    }


def _extract_company_name(text: str) -> Optional[str]:
    patterns = [
        r"(?i)(?:entreprise|soci[eé]t[eé]|company|client|firm)\s*[:\-]\s*([^\n,.]+)",
        r"(?i)(?:chez|rejoindre|a propos de|about)\s+([A-Z0-9\&\-\. ]{2,30})",
        r"(?i)recrute pour\s+([A-Z0-9\&\-\. ]{2,30})"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            extracted = match.group(1).strip()
            if len(extracted) > 1 and not re.match(r"(?i)^(le|la|les|un|une|de|du)$", extracted):
                return extracted
    return None


def _extract_position(text: str) -> Optional[str]:
    patterns = [
        r"(?i)(?:poste|intitul[eé]\s+du\s+poste|position|job\s+title|role|titre)\s*[:\-]\s*([^\n,.]+)",
        r"(?i)(?:recherche|recrute)\s+(?:un|une|des)?\s*([^\n,.]+?(?:développeu?r|ingénieur|lead|consultant|chef|manager|designer|analyste|architecte|spécialiste)[^\n,.]*)",
        r"(?i)^(?:poste\s*:?\s*)?([A-Z][a-zA-Z0-9\s\-/]{3,40})(?=\n|$)"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            extracted = match.group(1).strip()
            if len(extracted) > 2:
                return extracted
    return None


def _extract_location(text: str) -> Optional[str]:
    patterns = [
        r"(?i)(?:lieu|localisation|location|ville|bas[eé]\s+[aà])\s*[:\-]\s*([^\n,.]+)",
        r"(?i)(?:bas[eé]\s+[aà]|poste\s+bas[eé]\s+[aà])\s+([A-Z][a-zA-Z\s\-]{2,25})"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            extracted = match.group(1).strip()
            if len(extracted) > 1:
                return extracted
    return None


def _extract_contract_type(text: str) -> Optional[str]:
    # Direct contract term search
    contract_terms = [
        r"\bCDI\b", r"\bCDD\b", r"\bStage\b", r"\bAlternance\b",
        r"\bFreelance\b", r"\bFull-time\b", r"\bPart-time\b", r"\bTemps plein\b", r"\bTemps partiel\b"
    ]
    patterns = [
        r"(?i)(?:type\s+de\s+contrat|contrat|contract\s+type)\s*[:\-]\s*([^\n,.]+)"
    ]
    for pattern in patterns:
        match = re.search(pattern, text)
        if match:
            return match.group(1).strip()

    for term in contract_terms:
        if re.search(term, text, re.IGNORECASE):
            match = re.search(term, text, re.IGNORECASE)
            if match:
                return match.group(0)
    return None


def _extract_requirements(text: str) -> List[str]:
    requirements = []

    # First, look for a Requirements / Profil section
    req_section_match = re.search(
        r"(?i)(?:profil\s+recherch[eé]|exigences|requirements|pr[eé]requis|qualifications|comp[eé]tences\s+requises)\s*[:\-]?\n([\s\S]*?)(?=\n\n[A-Z]|\Z)",
        text
    )

    source_text = req_section_match.group(1) if req_section_match else text

    # Extract bullet points
    lines = source_text.split("\n")
    for line in lines:
        stripped = line.strip()
        bullet_match = re.match(r"^(?:[\-\*•\+]|\d+[\.\)])\s*(.+)", stripped)
        if bullet_match:
            item = bullet_match.group(1).strip()
            if len(item) > 3:
                requirements.append(item)

    # Fallback: if no bullet points found in section, split by newlines if req section matched
    if not requirements and req_section_match:
        for line in source_text.split("\n"):
            stripped = line.strip()
            if len(stripped) > 5 and not stripped.endswith(":"):
                requirements.append(stripped)

    return requirements

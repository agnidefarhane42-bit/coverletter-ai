"""
Module for constructing LLM prompts for cover letter generation.
"""


def build_prompt(cv_text: str, job_offer: str, tone: str = "formal", language: str = "fr") -> str:
    """
    Build a detailed prompt for Mistral AI to generate a tailored cover letter.

    Args:
        cv_text (str): Extracted plain text content from the candidate's CV.
        job_offer (str): Raw text of the job posting/offer.
        tone (str): Desired tone ('formal', 'creative', 'direct').
        language (str): Target output language ('fr' or 'en').

    Returns:
        str: Fully formatted prompt string for Mistral AI.
    """
    tone_descriptions = {
        "formal": (
            "Professionnel, courtois et respectueux des normes traditionnelles. "
            "Utilise un vocabulaire soutenu et des formules de politesse classiques."
        ),
        "creative": (
            "Original, captivant et dynamique. "
            "Met en valeur la personnalité du candidat avec une approche innovante tout en restant professionnel."
        ),
        "direct": (
            "Concis, percutant et axé sur les résultats. "
            "Va droit au but, met en avant les faits marquants et la valeur ajoutée sans fioritures."
        )
    }

    selected_tone_desc = tone_descriptions.get(
        tone.lower(),
        tone_descriptions["formal"]
    )

    target_lang_str = "français" if language.lower() == "fr" else "anglais"

    prompt = f"""Tu es un expert en recrutement et en rédaction professionnelle.
Ta mission est de rédiger une lettre de motivation sur mesure, hautement personnalisée et percutante, en {target_lang_str}.

--- CONSIGNES STRICTES DE RÉDACTION ---
1. LANGUE : La lettre doit être rédigée intégralement en {target_lang_str}.
2. TON : Applique un ton **{tone.upper()}**. ({selected_tone_desc})
3. LONGUEUR : Entre 250 et 400 mots. Ne génère pas une lettre trop courte ni trop longue.
4. STRUCTURE :
   - **Introduction** : Accroche dynamique mentionnant le poste visé et l'entreprise (si le nom est connu).
   - **Corps de la lettre (2 à 3 paragraphes)** : Fais le lien explicite entre les expériences/compétences clés tirées du CV et les exigences du poste. Démontre la valeur ajoutée du candidat.
   - **Conclusion** : Appel à l'action pour fixer un entretien, suivi d'une formule de politesse adaptée au ton choisi.
5. AUTHENTICITÉ :
   - Basse-toi EXCLUSIVEMENT sur les informations réelles fournies dans le CV. N'invente aucun diplôme, entreprise ou chiffre clé.
   - Si le nom de l'entreprise est présent dans l'offre, adresse-toi directement à elle.
   - Si le nom du recruteur est mentionné, adresse-toi directement à lui/elle. Sinon, utilise une formule adaptée ("Madame, Monsieur").
   - INTERDICTION STRICTE d'utiliser des crochets ou des placeholders comme [Nom de l'entreprise] ou [Votre nom]. Intègre directement les informations disponibles ou formule la phrase de manière naturelle si l'information est absente.
6. PAS DE TEMPLATE GÉNÉRIQUE : Rédige une lettre unique, engageante et parfaitement adaptée à ce couple CV/Offre d'emploi.

--- DONNÉES DU CANDIDAT (CV) ---
{cv_text.strip()}

--- OFFRE D'EMPLOI ---
{job_offer.strip()}

Génère UNIQUEMENT le texte de la lettre de motivation (aucun commentaire d'introduction ni de conclusion en dehors de la lettre).
"""
    return prompt

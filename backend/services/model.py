import os
import logging
from typing import Optional
from mistralai import Mistral
from prompts.cover_letter import build_prompt

logger = logging.getLogger(__name__)


class CoverLetterGenerator:
    """
    Service responsible for interacting with Mistral AI API to generate personalized cover letters.
    """

    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the CoverLetterGenerator with Mistral AI client.

        Args:
            api_key (str, optional): Mistral API key. Defaults to MISTRAL_API_KEY environment variable.
        """
        self.api_key = api_key or os.getenv("MISTRAL_API_KEY")
        if not self.api_key:
            raise ValueError(
                "MISTRAL_API_KEY environment variable or parameter is required."
            )
        
        self.client = Mistral(api_key=self.api_key)

    def generate(
        self,
        cv_text: str,
        job_offer: str,
        tone: str = "formal",
        language: str = "fr"
    ) -> str:
        """
        Generate a personalized cover letter using Mistral AI (mistral-large-latest).

        Args:
            cv_text (str): Candidate CV text.
            job_offer (str): Job posting text.
            tone (str): Desired tone ('formal', 'creative', 'direct').
            language (str): Desired output language ('fr' or 'en').

        Returns:
            str: Generated cover letter text.

        Raises:
            RuntimeError: If generation or API call fails.
        """
        if not cv_text or not cv_text.strip():
            raise ValueError("CV text cannot be empty.")
        if not job_offer or not job_offer.strip():
            raise ValueError("Job offer text cannot be empty.")

        prompt = build_prompt(
            cv_text=cv_text,
            job_offer=job_offer,
            tone=tone,
            language=language
        )

        try:
            response = self.client.chat.complete(
                model="mistral-large-latest",
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            if not response or not response.choices:
                raise RuntimeError("Empty response received from Mistral AI API.")

            letter_content = response.choices[0].message.content
            if not letter_content or not letter_content.strip():
                raise RuntimeError("Mistral AI returned an empty response content.")

            return letter_content.strip()

        except Exception as e:
            logger.error(f"Error during Mistral AI cover letter generation: {str(e)}")
            if isinstance(e, (ValueError, RuntimeError)):
                raise
            raise RuntimeError(f"Mistral AI API error: {str(e)}") from e

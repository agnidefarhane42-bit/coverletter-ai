# AI Cover Letter Generator - Backend

FastAPI backend for generating personalized cover letters using Mistral AI (`mistral-large-latest`). Parses CVs (plain text or base64 PDF) and job postings to create tailored, structured cover letters in French or English.

## Features

- **CV Parsing**: Supports raw text and base64-encoded PDF parsing via `pdfplumber`.
- **Job Offer Analysis**: Extracts requirements, company name, position, location, and contract type.
- **Mistral AI Integration**: Uses `mistral-large-latest` to generate professional cover letters.
- **Tone Customization**: Supports `formal`, `creative`, and `direct` tones.
- **Language Support**: Generates letters in French (`fr`) or English (`en`).
- **Rate Limiting**: Built-in in-memory rate limiting (10 requests per minute per IP).
- **Health Check Endpoint**: `/api/health` for uptime checks.

## Project Structure

```
coverletter-ai/backend/
├── main.py                  # FastAPI application entrypoint & routing
├── Dockerfile               # Container build instructions
├── requirements.txt         # Python dependencies
├── .env.example             # Template for environment variables
├── README.md                # Documentation
├── prompts/
│   ├── __init__.py
│   └── cover_letter.py      # Mistral AI prompt construction
└── services/
    ├── __init__.py
    ├── cv_parser.py         # Text & PDF CV parsing functions
    ├── job_parser.py        # Job posting metadata extraction
    └── model.py             # Mistral AI API integration service
```

## Getting Started

### Prerequisites

- Python 3.11+ or Docker
- Mistral AI API Key

### Local Setup

1. **Clone the repository & navigate to backend directory**:
   ```bash
   cd coverletter-ai/backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Add your Mistral AI API key:
   ```env
   MISTRAL_API_KEY=your_actual_mistral_api_key
   ```

5. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The API will be available at `http://localhost:8000`. Swagger documentation is available at `http://localhost:8000/docs`.

### Docker Deployment

1. **Build the Docker image**:
   ```bash
   docker build -t coverletter-backend .
   ```

2. **Run the Docker container**:
   ```bash
   docker run -d -p 8000:8000 -e MISTRAL_API_KEY="your_actual_mistral_api_key" coverletter-backend
   ```

## API Endpoints

### 1. Health Check
- **URL**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "ok"
  }
  ```

### 2. Generate Cover Letter
- **URL**: `POST /api/generate`
- **Rate Limit**: 10 requests / minute per IP
- **Request Body**:
  ```json
  {
    "cv_content": "Experienced Full Stack Engineer with 4 years of experience in Python, FastAPI, and React...",
    "cv_type": "text",
    "job_offer": "We are looking for a Backend Engineer proficient in FastAPI and LLM integrations at TechCorp...",
    "tone": "formal",
    "language": "fr"
  }
  ```
  *For PDF CVs*: set `cv_type` to `"pdf"` and pass base64-encoded PDF data in `cv_content`.

- **Response**:
  ```json
  {
    "letter": "Madame, Monsieur,\n\nC'est avec un vif intérêt...",
    "metadata": {
      "word_count": 312,
      "language": "fr"
    }
  }
  ```

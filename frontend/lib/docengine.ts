/**
 * DocEngine PDF generation — raw HTML mode
 * API: https://docengine-kappa.vercel.app/api/v1/generate-pdf
 * Auth: X-API-Key header
 * Body: { html, css, data }
 * Response: PDF binary (application/pdf)
 */

function letterToHtml(letter: string, userName: string): string {
  // Convert markdown-style bold (**text**) to HTML <strong>
  let html = letter
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Convert line breaks to proper paragraphs
    .split(/\n\n+/)
    .map(block => block.trim())
    .filter(block => block.length > 0)
    .map(block => {
      if (block.startsWith('# ')) return `<h1>${block.slice(2)}</h1>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3)}</h2>`;
      if (block.startsWith('### ')) return `<h3>${block.slice(4)}</h3>`;
      // Single newlines within a block become <br>
      return `<p>${block.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('\n');

  const dateStr = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
  <div class="cover-letter">
    <div class="header">
      <h1>Lettre de Motivation</h1>
      <p class="meta">${userName} — ${dateStr}</p>
    </div>
    <div class="body">
      ${html}
    </div>
  </div>`;
}

const COVER_LETTER_CSS = `
  @page { margin: 2cm 2.5cm; }
  body { font-family: 'Georgia', 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; color: #1a1a1a; }
  .cover-letter { max-width: 100%; }
  .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4338ca; padding-bottom: 15px; }
  .header h1 { font-size: 20pt; color: #4338ca; margin: 0 0 5px 0; }
  .meta { font-size: 10pt; color: #6b7280; margin: 0; }
  .body p { margin: 0 0 12px 0; text-align: justify; }
  .body h2 { font-size: 14pt; color: #1e1b4b; margin: 20px 0 10px 0; }
  .body strong { color: #111827; }
  .body em { color: #374151; }
`;

export async function generateCoverLetterPDF(letter: string, userName: string): Promise<string> {
  const apiKey = process.env.DOCENGINE_API_KEY;

  if (!apiKey) {
    throw new Error('DOCENGINE_API_KEY non configuree. Ajoutez la cle API DocEngine dans les variables denvironnement Vercel.');
  }

  const html = letterToHtml(letter, userName);

  const response = await fetch('https://docengine-kappa.vercel.app/api/v1/generate-pdf', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      html,
      css: COVER_LETTER_CSS,
      data: {},
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`DocEngine API error (${response.status}): ${errorText || response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/pdf')) {
    // DocEngine returns PDF binary directly
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:application/pdf;base64,${base64}`;
  }

  if (contentType.includes('application/json')) {
    const result = await response.json().catch(() => null);
    const pdfUrl = result?.url || result?.pdf_url || result?.pdfUrl;
    if (pdfUrl) return pdfUrl;
    throw new Error('DocEngine: reponse JSON sans URL de PDF');
  }

  // Fallback
  const text = await response.text();
  throw new Error(`DocEngine: format de reponse inattendu (${contentType}): ${text.slice(0, 200)}`);
}

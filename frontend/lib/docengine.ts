export async function generateCoverLetterPDF(letter: string, userName: string): Promise<string> {
  const apiKey = process.env.DOCENGINE_API_KEY || '';

  const response = await fetch('https://docengine-kappa.vercel.app/api/v1/generate-pdf', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      templateId: 'cover-letter',
      data: {
        content: letter,
        author: userName,
        date: new Date().toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DocEngine API error (${response.status}): ${errorText || response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    const result = await response.json();
    const pdfUrl = result.url || result.pdf_url || result.pdfUrl || result.downloadUrl || result.file_url;
    if (!pdfUrl) {
      throw new Error('DocEngine Response missing URL');
    }
    return pdfUrl;
  } else if (contentType.includes('application/pdf')) {
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return `data:application/pdf;base64,${base64}`;
  } else {
    const text = await response.text();
    try {
      const parsed = JSON.parse(text);
      return parsed.url || parsed.pdf_url || parsed.pdfUrl || parsed.downloadUrl || parsed.file_url || text;
    } catch {
      return text;
    }
  }
}

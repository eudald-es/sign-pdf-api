// api/sign-pdf.js
const { PDFDocument } = require('pdf-lib');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Obtenir el PDF enviat a través del cos de la petició
      const pdfBytes = Buffer.from(req.body.pdf, 'base64');

      // Carregar el PDF
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Afegir la signatura (aquesta part és només un exemple)
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      // Afegir un text de signatura com a placeholder (en una posició fixa)
      firstPage.drawText('Signat Digitalment', {
        x: width - 200,
        y: height - 100,
        size: 20,
      });

      // Obtenir el PDF signat com a bytes
      const signedPdfBytes = await pdfDoc.save();

      // Retornar el PDF signat com a base64
      const base64SignedPdf = signedPdfBytes.toString('base64');
      return res.status(200).json({ signedPdf: base64SignedPdf });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}

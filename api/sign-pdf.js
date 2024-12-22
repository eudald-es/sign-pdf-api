import { PDFDocument } from 'pdf-lib';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 400]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);
      page.drawText('PDF signat amb Vercel i pdf-lib!', {
        x: 50,
        y: height - 100,
        font,
        size: 30,
      });

      const pdfBytes = await pdfDoc.save();
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBytes);
    } catch (error) {
      res.status(500).json({ error: 'No s\'ha pogut signar el PDF' });
    }
  } else {
    res.status(405).json({ error: 'Métode no permès' });
  }
}


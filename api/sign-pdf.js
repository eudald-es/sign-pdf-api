import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { pdfBuffer, signature } = req.body;
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const page = pdfDoc.getPages()[0];
      const { height } = page.getSize();

      const signatureImagePath = path.join(process.cwd(), 'signatures', signature);
      const signatureImage = fs.readFileSync(signatureImagePath);
      const signatureImageEmbed = await pdfDoc.embedPng(signatureImage);

      page.drawImage(signatureImageEmbed, {
        x: 100,
        y: height - 150,
        width: 200,
        height: 50,
      });

      const signedPdfBytes = await pdfDoc.save();
      res.status(200).json({ signedPdf: signedPdfBytes.toString('base64') });
    } catch (error) {
      console.error('Error signant el PDF:', error);
      res.status(500).json({ error: 'No s\'ha pogut signar el PDF.' });
    }
  } else {
    res.status(405).json({ error: 'Mètode no permès.' });
  }
}




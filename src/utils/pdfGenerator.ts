import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PaperSize } from '../types';

/**
 * Helper to capture a DOM element into a canvas cleanly without scroll displacement or text overlapping.
 */
const captureElementToCanvas = async (el: HTMLElement): Promise<HTMLCanvasElement> => {
  const currentScrollX = window.scrollX;
  const currentScrollY = window.scrollY;

  // Temporarily scroll to top left to prevent html2canvas coordinate shifting
  window.scrollTo(0, 0);

  // Wait for any images to complete loading
  const images = Array.from(el.querySelectorAll('img'));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );

  const canvas = await html2canvas(el, {
    scale: 2, // High DPI resolution
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: el.ownerDocument.documentElement.clientWidth || 1200,
    onclone: (clonedDoc) => {
      // Hide any preview-only break indicators in the cloned DOM
      const breakIndicators = clonedDoc.querySelectorAll('.no-print');
      breakIndicators.forEach((node) => ((node as HTMLElement).style.display = 'none'));
    },
  });

  // Restore user scroll position
  window.scrollTo(currentScrollX, currentScrollY);
  return canvas;
};

export const exportToPdf = async (
  elementId: string,
  filename: string,
  paperSize: PaperSize = 'a3'
): Promise<void> => {
  try {
    if (paperSize === 'a4') {
      const page1El = document.getElementById('doc-preview-page-1');
      const page2El = document.getElementById('doc-preview-page-2');

      if (page1El && page2El) {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

        // Capture Page 1 (Header, Client Info, Scope Table)
        const canvas1 = await captureElementToCanvas(page1El);
        const imgData1 = canvas1.toDataURL('image/png');
        const imgProps1 = pdf.getImageProperties(imgData1);
        const p1HeightMm = (imgProps1.height * pdfWidth) / imgProps1.width;

        if (p1HeightMm > pdfHeight) {
          const scale = pdfHeight / p1HeightMm;
          const scaledW = pdfWidth * scale;
          const xPos = (pdfWidth - scaledW) / 2;
          pdf.addImage(imgData1, 'PNG', xPos, 0, scaledW, pdfHeight);
        } else {
          pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, p1HeightMm);
        }

        // Capture Page 2 (Terms, Financial Summary, Signatures, Footer)
        pdf.addPage();
        const canvas2 = await captureElementToCanvas(page2El);
        const imgData2 = canvas2.toDataURL('image/png');
        const imgProps2 = pdf.getImageProperties(imgData2);
        const p2HeightMm = (imgProps2.height * pdfWidth) / imgProps2.width;

        if (p2HeightMm > pdfHeight) {
          const scale = pdfHeight / p2HeightMm;
          const scaledW = pdfWidth * scale;
          const xPos = (pdfWidth - scaledW) / 2;
          pdf.addImage(imgData2, 'PNG', xPos, 0, scaledW, pdfHeight);
        } else {
          pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, p2HeightMm);
        }

        pdf.save(`${filename}_A4.pdf`);
        return;
      }
    }

    // Fallback or A3 Single-Page Export
    const element = document.getElementById(elementId) || document.getElementById('doc-preview-page-1');
    if (!element) {
      console.error(`Element for PDF export not found`);
      return;
    }

    const canvas = await captureElementToCanvas(element);
    const format = paperSize === 'legal' ? 'legal' : 'a3';
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: format,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgData = canvas.toDataURL('image/png');
    const imgProps = pdf.getImageProperties(imgData);
    const calculatedHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (calculatedHeight > pdfHeight) {
      const scale = pdfHeight / calculatedHeight;
      const scaledWidth = pdfWidth * scale;
      const xOffset = (pdfWidth - scaledWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, 0, scaledWidth, pdfHeight);
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, calculatedHeight);
    }

    pdf.save(`${filename}_${format.toUpperCase()}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    alert('PDF generation encountered an error. Printing fallback will trigger.');
    window.print();
  }
};



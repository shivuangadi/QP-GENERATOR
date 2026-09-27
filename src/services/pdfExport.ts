// Client-side PDF export and robust print helper

export async function exportPaperToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Target element not found:', elementId);
    return false;
  }

  // Temporarily hide elements with .no-print
  const noPrintEls = element.querySelectorAll<HTMLElement>('.no-print');
  noPrintEls.forEach((el) => {
    el.dataset.prevDisplay = el.style.display;
    el.style.display = 'none';
  });

  try {
    // Dynamic import of html2pdf.js
    // @ts-ignore
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [6, 4, 6, 4] as [number, number, number, number],
      filename: filename.endsWith('.pdf') ? filename : `${filename}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
      },
      jsPDF: { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    // Fallback: trigger print
    window.print();
    return false;
  } finally {
    // Restore .no-print elements
    noPrintEls.forEach((el) => {
      el.style.display = el.dataset.prevDisplay || '';
      delete el.dataset.prevDisplay;
    });
  }
}

export function printPaperSafely(_elementId?: string): void {
  // Direct window.print() ensures print preview opens in the SAME window
  // All non-printable elements are hidden via CSS .no-print
  try {
    window.print();
  } catch (err) {
    console.warn('Print error:', err);
    window.print();
  }
}

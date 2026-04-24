export const cleanupHtml2PdfArtifacts = () => {
  const selectors = [
    '.html2pdf__overlay',
    '.html2pdf__container',
    '.html2canvas-container',
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node);
      }
    });
  });
};


import { jsPDF } from 'jspdf';

export const generateLetterPDF = async (letterPayload) => {
    const { title, user, loan, generatedAt, type } = letterPayload;
    const loanId = loan?.loanId || 'N/A';
    const name = user?.name || 'Valued Client';
    const date = new Date(generatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- Header ---
    // Top blue line
    pdf.setFillColor(29, 78, 216); // blue-700
    pdf.rect(0, 0, pageWidth, 2, 'F');

    // Logo
    pdf.setFillColor(0, 0, 0);
    pdf.roundedRect(margin, 20, 20, 20, 3, 3, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text('L', margin + 10, 33, { align: 'center' });

    // Company Name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LENNI PROTOCOL', margin + 25, 28);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Verification Hub • NODE-RSA-02', margin + 25, 33);

    // Right Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('OFFICIAL ARCHIVE COPY', pageWidth - margin, 28, { align: 'right' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Financial District, Central 400', pageWidth - margin, 32, { align: 'right' });
    pdf.text('secure.verify.lenni.com', pageWidth - margin, 35, { align: 'right' });

    // Artifact Info
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 45, pageWidth - margin, 45);

    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('GLOBAL ARTIFACT ID', margin, 52);
    pdf.text('VALIDATION TIMESTAMP', pageWidth - margin, 52, { align: 'right' });

    pdf.setFontSize(8);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`LMS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-V842`, margin, 56);
    pdf.text(date, pageWidth - margin, 56, { align: 'right' });

    pdf.setDrawColor(240, 240, 240);
    pdf.line(margin, 60, pageWidth - margin, 60);

    // --- Salutation ---
    let y = 75;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text(title.toUpperCase(), margin, y);
    
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`REF: ${letterPayload.filename.split('.')[0]}`, pageWidth - margin, y, { align: 'right' });

    y += 15;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Dear ${name},`, margin, y);

    // --- Body ---
    y += 12;
    pdf.setFontSize(11);
    
    const drawTable = (rows, currentY) => {
        pdf.setFillColor(248, 248, 248);
        pdf.setDrawColor(230, 230, 230);
        const tableHeight = rows.length * 10;
        pdf.roundedRect(margin, currentY, contentWidth, tableHeight, 1, 1, 'FD');
        
        rows.forEach((row, i) => {
            const rowY = currentY + (i * 10) + 6.5;
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 100, 100);
            pdf.text(row.label, margin + 5, rowY);
            
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(0, 0, 0);
            pdf.text(row.value, pageWidth - margin - 5, rowY, { align: 'right' });
            
            if (i < rows.length - 1) {
                pdf.line(margin + 5, currentY + (i * 10) + 10, pageWidth - margin - 5, currentY + (i * 10) + 10);
            }
        });
        return currentY + tableHeight + 15;
    };

    if (type === 'SETTLEMENT') {
        const lines = pdf.splitTextToSize(`This letter serves to confirm the settlement amount required to close your loan account ${loanId} in full.`, contentWidth);
        pdf.text(lines, margin, y);
        y += (lines.length * 6) + 5;
        
        y = drawTable([
            { label: 'Borrower Name', value: name },
            { label: 'Loan Account Number', value: loanId },
            { label: 'Settlement Amount', value: `R ${loan.outstandingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` }
        ], y);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        const note = pdf.splitTextToSize('Please note that this settlement figure is valid for a period of 7 calendar days from the date of this letter. Failure to settle within this period may result in additional interest charges.', contentWidth);
        pdf.text(note, margin, y);
    } else if (type === 'PAID_UP') {
        const lines = pdf.splitTextToSize(`We are pleased to confirm that your loan account ${loanId} has been settled in full and is now closed.`, contentWidth);
        pdf.text(lines, margin, y);
        y += (lines.length * 6) + 5;
        
        y = drawTable([
            { label: 'Loan Account Number', value: loanId },
            { label: 'Original Principal', value: `R ${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Outstanding Balance', value: 'R 0.00' }
        ], y);
        
        pdf.text('We thank you for your patronage and look forward to assisting you with your future financial needs.', margin, y);
    } else if (type === 'CONFIRMATION') {
        const lines = pdf.splitTextToSize(`This letter serves to confirm that you have an active loan agreement with Lenni Lending Protocol.`, contentWidth);
        pdf.text(lines, margin, y);
        y += (lines.length * 6) + 5;
        
        y = drawTable([
            { label: 'Loan Status', value: loan.statusLabel },
            { label: 'Principal Amount', value: `R ${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
            { label: 'Loan Account Number', value: loanId }
        ], y);
        
        pdf.text('This confirmation is issued for any official verification requirements.', margin, y);
    } else if (type === 'REJECTION') {
        pdf.text('Thank you for your recent loan application with Lenni Lending Protocol.', margin, y);
        y += 7;
        const lines = pdf.splitTextToSize(`After careful review of your application ${loanId}, we regret to inform you that we are unable to approve your request at this time.`, contentWidth);
        pdf.text(lines, margin, y);
        y += (lines.length * 6) + 10;
        
        pdf.setFillColor(255, 241, 242);
        pdf.setDrawColor(255, 228, 230);
        pdf.roundedRect(margin, y, contentWidth, 20, 1, 1, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(159, 18, 57);
        pdf.setFontSize(8);
        pdf.text('REASON FOR REJECTION', margin + 10, y + 7);
        pdf.setFontSize(10);
        pdf.text(loan.rejectionReason || 'Does not meet internal credit criteria', margin + 10, y + 14);
        
        y += 30;
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text('We encourage you to review your financial standing and apply again in the future once your circumstances have improved.', margin, y);
    }

    // --- Signature ---
    y = 210;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.text('Yours faithfully,', margin, y);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, y + 15, margin + 50, y + 15);
    
    y += 20;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lenni Compliance Department', margin, y);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Digitally Verified Document', margin, y + 5);

    // --- Footer ---
    const footerY = 280;
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Lenni Financial Services (Pty) Ltd', pageWidth / 2, footerY, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text('support@lenni.com | www.lenni.com | +27 12 345 6789', pageWidth / 2, footerY + 4, { align: 'center' });

    pdf.save(letterPayload.filename);
};

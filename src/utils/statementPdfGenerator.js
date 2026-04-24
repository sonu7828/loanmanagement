import { jsPDF } from 'jspdf';

export const generateStatementPDF = async (loan, user, transactions) => {
    const loanId = loan?.id || 'LN-2024-001';
    const name = loan?.name || user?.name || 'Valued Client';
    const totalBalance = 2500.00;
    const nextPayment = 1250.00;
    const dueDate = '30 APR 2024';
    const statementDate = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    const period = 'January 2024 - April 2024';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Helper to draw horizontal line
    const line = (y) => {
        pdf.setDrawColor(230, 230, 230);
        pdf.line(margin, y, pageWidth - margin, y);
    };

    // --- Header ---
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LENNI LENDING PROTOCOL', margin, 25);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('OFFICIAL FINANCIAL STATEMENT', margin, 31);

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('ACCOUNT STATEMENT', pageWidth - margin, 25, { align: 'right' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`DATE: ${statementDate}`, pageWidth - margin, 31, { align: 'right' });

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(margin, 38, pageWidth - margin, 38);

    // --- Employee Info ---
    let y = 55;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text('EMPLOYEE DETAILS', margin, y);
    
    y += 7;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(name, margin, y);
    
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(60, 60, 60);
    pdf.text(`Loan ID: ${loanId}`, margin, y);
    
    y += 5;
    pdf.text(`Period: ${period}`, margin, y);

    // --- Balance Summary Box ---
    const boxX = margin + (contentWidth / 2);
    const boxY = 50;
    const boxWidth = contentWidth / 2;
    const boxHeight = 35;

    pdf.setDrawColor(240, 240, 240);
    pdf.setFillColor(248, 248, 248);
    pdf.roundedRect(boxX, boxY, boxWidth, boxHeight, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text('BALANCE SUMMARY', boxX + 8, boxY + 10);

    const totalPaid = transactions.filter(t => t.type === 'repayment').reduce((sum, t) => sum + t.amount, 0);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Opening Balance:', boxX + 8, boxY + 18);
    pdf.text('R 0.00', boxX + boxWidth - 8, boxY + 18, { align: 'right' });

    pdf.text('Total Repaid:', boxX + 8, boxY + 24);
    pdf.setTextColor(5, 150, 105); // emerald
    pdf.text(`R ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, boxX + boxWidth - 8, boxY + 24, { align: 'right' });

    pdf.setDrawColor(220, 220, 220);
    pdf.line(boxX + 8, boxY + 27, boxX + boxWidth - 8, boxY + 27);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Closing Balance:', boxX + 8, boxY + 32);
    pdf.setTextColor(220, 38, 38); // red
    pdf.text(`R ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, boxX + boxWidth - 8, boxY + 32, { align: 'right' });

    // --- Next Payment Bar ---
    y = 100;
    pdf.setFillColor(0, 0, 0);
    pdf.roundedRect(margin, y, contentWidth, 18, 1, 1, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(200, 200, 200);
    pdf.text('NEXT PAYMENT DUE', margin + 10, y + 7);
    
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`R ${nextPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, margin + 10, y + 14);

    pdf.setFontSize(8);
    pdf.setTextColor(200, 200, 200);
    pdf.text('DUE DATE', pageWidth - margin - 10, y + 7, { align: 'right' });
    
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text(dueDate, pageWidth - margin - 10, y + 14, { align: 'right' });

    // --- Table Headers ---
    y = 135;
    pdf.setFillColor(0, 0, 0);
    pdf.rect(margin, y, contentWidth, 10, 'F');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255);
    pdf.text('DATE', margin + 4, y + 6.5);
    pdf.text('REFERENCE', margin + 28, y + 6.5);
    pdf.text('DESCRIPTION', margin + 60, y + 6.5);
    pdf.text('DEBIT (R)', margin + 115, y + 6.5, { align: 'right' });
    pdf.text('CREDIT (R)', margin + 145, y + 6.5, { align: 'right' });
    pdf.text('BALANCE (R)', margin + 170, y + 6.5, { align: 'right' });

    // --- Table Rows ---
    y += 10;
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    const transactionsWithBalance = sortedTx.map(tx => {
        if (tx.type === 'disbursement') {
            runningBalance += tx.amount;
        } else {
            runningBalance -= tx.amount;
        }
        return { ...tx, balance: runningBalance };
    }).reverse();

    transactionsWithBalance.forEach((tx, i) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(60, 60, 60);

        const rowY = y + (i * 10) + 7;
        
        // Zebra striping
        if (i % 2 === 1) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin, y + (i * 10), contentWidth, 10, 'F');
        }

        pdf.text(new Date(tx.date).toLocaleDateString(), margin + 4, rowY);
        pdf.setFont('courier', 'normal');
        pdf.text(tx.id, margin + 28, rowY);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(tx.description, margin + 60, rowY);

        const isCredit = tx.type === 'repayment';
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(220, 38, 38);
        pdf.text(!isCredit ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-', margin + 115, rowY, { align: 'right' });
        
        pdf.setTextColor(5, 150, 105);
        pdf.text(isCredit ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-', margin + 145, rowY, { align: 'right' });
        
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.text(tx.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }), margin + 170, rowY, { align: 'right' });

        // Row line
        pdf.setDrawColor(240, 240, 240);
        pdf.setLineWidth(0.1);
        pdf.line(margin, y + (i * 10) + 10, pageWidth - margin, y + (i * 10) + 10);
    });

    // --- Footer ---
    const footerY = 280;
    pdf.setDrawColor(230, 230, 230);
    pdf.setLineWidth(0.5);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('LENNI FINANCIAL SERVICES (PTY) LTD', pageWidth / 2, footerY, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('This is a computer-generated document. For official records only.', pageWidth / 2, footerY + 4, { align: 'center' });
    pdf.text('Contact: support@lenni.com | +27 12 345 6789', pageWidth / 2, footerY + 8, { align: 'center' });

    pdf.save(`Statement-${loanId}.pdf`);
};



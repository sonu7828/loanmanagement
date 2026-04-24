import { jsPDF } from 'jspdf';

export const generateApplicationHTML = (application, applicantData) => {
    // This remains for the Print functionality (browser print)
    const { id, status, date } = application;
    const { name, email, idNumber, mobile, company, salary, jobTitle, amount, paymentMethod } = applicantData;

    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';
    const loanAmount = Number(amount || 0);
    const interest = loanAmount * 0.09;
    const fee = loanAmount * 0.03;
    const totalRepayable = loanAmount + interest + fee;

    return `
        <div style="font-family: Arial, sans-serif; color: #000; padding: 40px; background: white;">
            <div style="border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900;">LENNI LENDING PROTOCOL</h1>
                    <p style="margin: 5px 0 0; font-size: 10px; color: #666; text-transform: uppercase;">Official Loan Application Summary</p>
                </div>
                <div style="text-align: right;">
                    <h2 style="margin: 0; font-size: 16px; font-weight: 700;">REF: ${id}</h2>
                    <p style="margin: 5px 0 0; font-size: 10px; color: #666;">Date: ${formattedDate}</p>
                </div>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 12px; font-weight: 900; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">APPLICANT DETAILS</h3>
                <table style="width: 100%; font-size: 11px;">
                    <tr><td style="padding: 5px 0; color: #666;">Full Name</td><td style="padding: 5px 0; font-weight: 700;">${name}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">ID Number</td><td style="padding: 5px 0; font-weight: 700;">${idNumber}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Email</td><td style="padding: 5px 0; font-weight: 700;">${email}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Contact</td><td style="padding: 5px 0; font-weight: 700;">${mobile}</td></tr>
                </table>
            </div>

            <div style="margin-bottom: 30px;">
                <h3 style="font-size: 12px; font-weight: 900; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">EMPLOYMENT & FINANCIALS</h3>
                <table style="width: 100%; font-size: 11px;">
                    <tr><td style="padding: 5px 0; color: #666;">Employer</td><td style="padding: 5px 0; font-weight: 700;">${company}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Job Title</td><td style="padding: 5px 0; font-weight: 700;">${jobTitle}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Salary (Net)</td><td style="padding: 5px 0; font-weight: 700;">R ${salary.toLocaleString()}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Principal Amount</td><td style="padding: 5px 0; font-weight: 700;">R ${loanAmount.toLocaleString()}</td></tr>
                    <tr><td style="padding: 5px 0; color: #666;">Total Repayable</td><td style="padding: 5px 0; font-weight: 900; color: #2563eb;">R ${totalRepayable.toLocaleString()}</td></tr>
                </table>
            </div>

            <div style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
                <p style="font-size: 10px; font-weight: 700;">COMPLIANCE VERIFIED • LENNI FINANCIAL SERVICES</p>
                <p style="font-size: 8px; color: #999; margin-top: 5px;">This document is an official record of the loan application submitted via the Lenni Protocol.</p>
            </div>
        </div>
    `;
};

export const generateApplicationPDF = async (application, applicantData) => {
    const { id, status, date } = application;
    const { name, email, idNumber, mobile, company, salary, jobTitle, amount, paymentMethod } = applicantData;
    const formattedDate = date ? new Date(date).toLocaleDateString() : 'N/A';

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- Header ---
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(0, 0, 0);
    pdf.text('LENNI LENDING PROTOCOL', margin, 25);
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('OFFICIAL LOAN APPLICATION SUMMARY', margin, 31);

    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`REF: ${id}`, pageWidth - margin, 25, { align: 'right' });
    
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`DATE: ${formattedDate}`, pageWidth - margin, 31, { align: 'right' });

    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.8);
    pdf.line(margin, 38, pageWidth - margin, 38);

    // --- Status Section ---
    let y = 55;
    pdf.setFillColor(248, 248, 248);
    pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
    
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(120, 120, 120);
    pdf.text('APPLICATION STATUS', margin + 8, y + 8);
    
    pdf.setFontSize(14);
    pdf.setTextColor(37, 99, 235); // blue
    pdf.text(status.toUpperCase(), margin + 8, y + 15);

    // --- Applicant Details ---
    y += 35;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('APPLICANT INFORMATION', margin, y);
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);

    y += 10;
    const drawRow = (label, value, currentY) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(label, margin, currentY);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text(String(value), pageWidth - margin, currentY, { align: 'right' });
        pdf.setDrawColor(245, 245, 245);
        pdf.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
        return currentY + 10;
    };

    y = drawRow('Full Legal Name', name, y);
    y = drawRow('National ID / Passport', idNumber, y);
    y = drawRow('Email Address', email, y);
    y = drawRow('Contact Number', mobile, y);

    // --- Employment ---
    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.text('EMPLOYMENT & FINANCIALS', margin, y);
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, y + 2, pageWidth - margin, y + 2);

    y += 10;
    y = drawRow('Registered Employer', company, y);
    y = drawRow('Job Title', jobTitle, y);
    y = drawRow('Net Monthly Salary', `R ${salary.toLocaleString()}`, y);
    y = drawRow('Principal Requested', `R ${amount.toLocaleString()}`, y);
    
    const interest = amount * 0.09;
    const fee = amount * 0.03;
    const total = amount + interest + fee;
    
    y = drawRow('Estimated Total Repayable', `R ${total.toLocaleString()}`, y);

    // --- Compliance Footer ---
    const footerY = 280;
    pdf.setDrawColor(230, 230, 230);
    pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('COMPLIANCE VERIFIED • LENNI FINANCIAL SERVICES', pageWidth / 2, footerY, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150, 150, 150);
    pdf.text('This is an official computer-generated application report. Digital signatures are binding.', pageWidth / 2, footerY + 4, { align: 'center' });

    pdf.save(`Application-${id}.pdf`);
};


// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Configure jsPDF for Urdu support
const configurePDF = (pdf, isUrdu = false) => {
  // Set font for Urdu text support
  if (isUrdu) {
    // Note: You'll need to add Urdu font file to the project
    // pdf.addFont('NotoNastaliqUrdu-Regular.ttf', 'NotoNastaliqUrdu', 'normal');
    // pdf.setFont('NotoNastaliqUrdu');
  }
  
  pdf.setFontSize(12);
  return pdf;
};

// Generate receipt PDF
export const generateReceiptPDF = async (receiptData, isUrdu = false) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  configurePDF(pdf, isUrdu);
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;
  
  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(22, 163, 74); // Primary green
  const title = isUrdu ? 'رسید' : 'Receipt';
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 15;
  
  // Organization name
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  const orgName = receiptData.organizationName || (isUrdu ? 'آپ کا مدرسہ' : 'Your Madrasa');
  const orgWidth = pdf.getTextWidth(orgName);
  pdf.text(orgName, (pageWidth - orgWidth) / 2, yPosition);
  yPosition += 20;
  
  // Divider line
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;
  
  // Receipt details
  pdf.setFontSize(12);
  
  const details = [
    { label: isUrdu ? 'رسید نمبر:' : 'Receipt No:', value: receiptData.receiptNumber },
    { label: isUrdu ? 'تاریخ:' : 'Date:', value: receiptData.date },
    { label: isUrdu ? 'عطیہ دہندہ:' : 'Donor Name:', value: receiptData.donorName },
    { label: isUrdu ? 'فون نمبر:' : 'Phone:', value: receiptData.donorPhone },
    { label: isUrdu ? 'ادائیگی کا طریقہ:' : 'Payment Method:', value: receiptData.paymentMethod },
    { label: isUrdu ? 'قسم:' : 'Category:', value: receiptData.category },
    { label: isUrdu ? 'تفصیل:' : 'Description:', value: receiptData.description }
  ];
  
  details.forEach(detail => {
    if (detail.value) {
      pdf.setFont(undefined, 'bold');
      pdf.text(detail.label, margin, yPosition);
      pdf.setFont(undefined, 'normal');
      pdf.text(detail.value, margin + 40, yPosition);
      yPosition += 8;
    }
  });
  
  yPosition += 10;
  
  // Amount box
  pdf.setFillColor(22, 163, 74, 0.1);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  const amountLabel = isUrdu ? 'کل رقم:' : 'Total Amount:';
  pdf.text(amountLabel, margin + 5, yPosition + 12);
  const amountText = `${receiptData.currency || 'Rs'} ${receiptData.amount.toLocaleString()}`;
  const amountWidth = pdf.getTextWidth(amountText);
  pdf.text(amountText, pageWidth - margin - amountWidth - 5, yPosition + 12);
  
  yPosition += 40;
  
  // Footer
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(100, 100, 100);
  const footerText = isUrdu ? 
    'یہ کمپیوٹر سے تیار کردہ رسید ہے۔ شکریہ!' : 
    'This is a computer generated receipt. Thank you!';
  const footerWidth = pdf.getTextWidth(footerText);
  pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 20);
  
  return pdf;
};

// Generate report PDF
export const generateReportPDF = async (reportData, isUrdu = false) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  configurePDF(pdf, isUrdu);
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;
  
  // Header
  pdf.setFontSize(18);
  pdf.setTextColor(22, 163, 74);
  const title = reportData.title || (isUrdu ? 'مالی رپورٹ' : 'Financial Report');
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, yPosition);
  yPosition += 20;
  
  // Report period
  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  const period = `${isUrdu ? 'مدت:' : 'Period:'} ${reportData.startDate} - ${reportData.endDate}`;
  pdf.text(period, margin, yPosition);
  yPosition += 15;
  
  // Summary section
  if (reportData.summary) {
    pdf.setFont(undefined, 'bold');
    pdf.text(isUrdu ? 'خلاصہ:' : 'Summary:', margin, yPosition);
    yPosition += 10;
    
    pdf.setFont(undefined, 'normal');
    Object.entries(reportData.summary).forEach(([key, value]) => {
      pdf.text(`${key}: ${value}`, margin + 10, yPosition);
      yPosition += 8;
    });
  }
  
  // Add table data if present
  if (reportData.tableData && reportData.tableData.length > 0) {
    yPosition += 10;
    pdf.setFont(undefined, 'bold');
    pdf.text(isUrdu ? 'تفصیلات:' : 'Details:', margin, yPosition);
    yPosition += 10;
    
    // Simple table implementation
    const headers = reportData.headers || [];
    const startX = margin;
    const cellWidth = (pageWidth - 2 * margin) / headers.length;
    
    // Table headers
    pdf.setFillColor(240, 240, 240);
    pdf.rect(startX, yPosition, pageWidth - 2 * margin, 8, 'F');
    headers.forEach((header, index) => {
      pdf.text(header, startX + index * cellWidth + 2, yPosition + 6);
    });
    yPosition += 8;
    
    // Table rows
    pdf.setFont(undefined, 'normal');
    reportData.tableData.forEach(row => {
      if (yPosition > 250) { // New page if needed
        pdf.addPage();
        yPosition = margin;
      }
      
      Object.values(row).forEach((cell, index) => {
        pdf.text(String(cell), startX + index * cellWidth + 2, yPosition + 6);
      });
      yPosition += 8;
    });
  }
  
  return pdf;
};

// Export PDF to file
export const downloadPDF = (pdf, filename) => {
  pdf.save(filename);
};

// Convert HTML element to PDF
export const htmlToPDF = async (elementId, filename, isUrdu = false) => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }
  
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
};

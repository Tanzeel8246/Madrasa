// utils/whatsappIntegration.js
import { WHATSAPP_CONFIG } from './constants';

// Send WhatsApp message using WhatsApp Business API
export const sendWhatsAppMessage = async (phoneNumber, message, mediaUrl = null) => {
  try {
    const url = `${WHATSAPP_CONFIG.API_URL}/${WHATSAPP_CONFIG.PHONE_NUMBER_ID}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: mediaUrl ? 'document' : 'text'
    };
    
    if (mediaUrl) {
      payload.document = {
        link: mediaUrl,
        caption: message
      };
    } else {
      payload.text = {
        body: message
      };
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_CONFIG.ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('WhatsApp send error:', error);
    throw error;
  }
};

// Send receipt via WhatsApp
export const sendReceiptViaWhatsApp = async (phoneNumber, receiptData, pdfBlob) => {
  try {
    // Upload PDF to a temporary URL (you'll need to implement this)
    // For demo purposes, we'll just send a text message
    const message = `Receipt from ${receiptData.organizationName}\n\n` +
                   `Receipt No: ${receiptData.receiptNumber}\n` +
                   `Date: ${receiptData.date}\n` +
                   `Amount: ${receiptData.currency} ${receiptData.amount.toLocaleString()}\n` +
                   `Category: ${receiptData.category}\n\n` +
                   `Thank you for your donation!`;
    
    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error('Error sending receipt via WhatsApp:', error);
    throw error;
  }
};

// Send report via WhatsApp
export const sendReportViaWhatsApp = async (phoneNumber, reportData, pdfBlob) => {
  try {
    const message = `Financial Report from ${reportData.organizationName}\n\n` +
                   `Period: ${reportData.startDate} - ${reportData.endDate}\n` +
                   `Total Income: ${reportData.summary?.totalIncome || 'N/A'}\n` +
                   `Total Expenses: ${reportData.summary?.totalExpenses || 'N/A'}\n` +
                   `Balance: ${reportData.summary?.balance || 'N/A'}\n\n` +
                   `Please find attached the detailed report.`;
    
    return await sendWhatsAppMessage(phoneNumber, message);
  } catch (error) {
    console.error('Error sending report via WhatsApp:', error);
    throw error;
  }
};

// Format phone number for WhatsApp (remove + and spaces)
export const formatPhoneNumber = (phoneNumber) => {
  return phoneNumber.replace(/[^0-9]/g, '');
};

// Create WhatsApp share link (fallback method)
export const createWhatsAppShareLink = (phoneNumber, message) => {
  const formattedNumber = formatPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};

// Share receipt link via WhatsApp Web
export const shareReceiptLink = (phoneNumber, receiptData) => {
  const message = `Receipt from ${receiptData.organizationName}\n` +
                 `Amount: ${receiptData.currency} ${receiptData.amount.toLocaleString()}\n` +
                 `Date: ${receiptData.date}\n` +
                 `Thank you for your donation!`;
  
  const shareLink = createWhatsAppShareLink(phoneNumber, message);
  window.open(shareLink, '_blank');
};

// Share report link via WhatsApp Web
export const shareReportLink = (phoneNumber, reportData) => {
  const message = `Financial Report\n` +
                 `Period: ${reportData.startDate} - ${reportData.endDate}\n` +
                 `For more details, please contact the administration.`;
  
  const shareLink = createWhatsAppShareLink(phoneNumber, message);
  window.open(shareLink, '_blank');
};

// Buupass M-Pesa Payment Service
// Handles all payment processing via Buupass API

import PAYMENT_CONFIG from '../config/payment-config.js';

class BuupassPaymentService {
  constructor() {
    this.apiKey = PAYMENT_CONFIG.buupass.apiKey;
    this.merchantId = PAYMENT_CONFIG.buupass.merchantId;
    this.apiUrl = PAYMENT_CONFIG.buupass.apiUrl;
    this.callbackUrl = PAYMENT_CONFIG.buupass.callbackUrl;
  }

  /**
   * Initiate M-Pesa payment via Buupass
   * @param {Object} paymentDetails - Payment details
   * @param {string} paymentDetails.phoneNumber - Customer phone number (254XXXXXXXXX format)
   * @param {number} paymentDetails.amount - Amount in KES
   * @param {string} paymentDetails.serviceType - Type of service being paid for
   * @param {string} paymentDetails.customerName - Customer name
   * @param {string} paymentDetails.customerEmail - Customer email
   * @returns {Promise<Object>} Payment response
   */
  async initiatePayment(paymentDetails) {
    try {
      // Validate phone number format
      const normalizedPhone = this.normalizePhoneNumber(paymentDetails.phoneNumber);
      
      if (!normalizedPhone) {
        throw new Error('Invalid phone number format. Please use format: 254XXXXXXXXX or 0XXXXXXXXX');
      }

      // Prepare payment payload
      const payload = {
        amount: paymentDetails.amount,
        phone: normalizedPhone,
        reference: `PT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: `Pascal Travels - ${paymentDetails.serviceType}`,
        customerName: paymentDetails.customerName,
        customerEmail: paymentDetails.customerEmail,
        callbackUrl: this.callbackUrl,
        metadata: {
          serviceType: paymentDetails.serviceType,
          bookingType: paymentDetails.bookingType || 'standard',
          timestamp: new Date().toISOString(),
        },
      };

      // Make API request to Buupass
      const response = await fetch(`${this.apiUrl}/payment/prompt`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-Merchant-Id': this.merchantId,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Payment initiation failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Store payment reference for tracking
      this.storePaymentReference(payload.reference, paymentDetails);
      
      return {
        success: true,
        transactionId: result.transactionId,
        reference: payload.reference,
        amount: paymentDetails.amount,
        status: 'pending',
        message: 'Payment prompt sent to M-Pesa',
      };
    } catch (error) {
      console.error('Payment initiation error:', error);
      return {
        success: false,
        error: error.message,
        status: 'failed',
      };
    }
  }

  /**
   * Check payment status
   * @param {string} transactionId - Transaction ID from Buupass
   * @returns {Promise<Object>} Payment status
   */
  async checkPaymentStatus(transactionId) {
    try {
      const response = await fetch(`${this.apiUrl}/payment/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Merchant-Id': this.merchantId,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        status: result.status, // 'completed', 'pending', 'failed'
        amount: result.amount,
        phone: result.phone,
        timestamp: result.timestamp,
      };
    } catch (error) {
      console.error('Status check error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Normalize phone number to Kenyan format
   * @param {string} phone - Phone number in any format
   * @returns {string|null} Normalized phone or null if invalid
   */
  normalizePhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Handle various formats
    if (cleaned.startsWith('254') && cleaned.length === 12) {
      return cleaned; // Already in correct format
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      return '254' + cleaned.substring(1); // Convert 0XXXXXXXXX to 254XXXXXXXXX
    } else if (cleaned.length === 9) {
      return '254' + cleaned; // Assume it's just the 9 digits
    }
    
    return null; // Invalid format
  }

  /**
   * Store payment reference locally for tracking
   * @param {string} reference - Payment reference
   * @param {Object} details - Payment details
   */
  storePaymentReference(reference, details) {
    const payments = JSON.parse(localStorage.getItem('pascal_payments') || '[]');
    payments.push({
      reference,
      ...details,
      timestamp: new Date().toISOString(),
      status: 'pending',
    });
    localStorage.setItem('pascal_payments', JSON.stringify(payments));
  }

  /**
   * Handle payment callback from Buupass
   * @param {Object} callbackData - Data from Buupass callback
   */
  async handlePaymentCallback(callbackData) {
    try {
      // Update payment status in localStorage
      const payments = JSON.parse(localStorage.getItem('pascal_payments') || '[]');
      const paymentIndex = payments.findIndex(p => p.reference === callbackData.reference);
      
      if (paymentIndex !== -1) {
        payments[paymentIndex].status = callbackData.status;
        payments[paymentIndex].resultCode = callbackData.resultCode;
        payments[paymentIndex].transactionId = callbackData.transactionId;
        localStorage.setItem('pascal_payments', JSON.stringify(payments));
      }

      // Trigger success notification if payment completed
      if (callbackData.status === 'completed' || callbackData.resultCode === '0') {
        this.triggerPaymentSuccess(callbackData);
      } else {
        this.triggerPaymentFailure(callbackData);
      }

      return { success: true };
    } catch (error) {
      console.error('Callback handling error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Trigger success notification
   * @param {Object} data - Payment data
   */
  triggerPaymentSuccess(data) {
    const event = new CustomEvent('paymentSuccess', { detail: data });
    window.dispatchEvent(event);
    
    // Show success message
    alert(`✅ Payment successful! Transaction ID: ${data.transactionId}`);
  }

  /**
   * Trigger failure notification
   * @param {Object} data - Payment data
   */
  triggerPaymentFailure(data) {
    const event = new CustomEvent('paymentFailure', { detail: data });
    window.dispatchEvent(event);
    
    // Show error message
    alert(`❌ Payment failed. Please try again or contact support.`);
  }

  /**
   * Get all payment history
   * @returns {Array} Array of payment records
   */
  getPaymentHistory() {
    return JSON.parse(localStorage.getItem('pascal_payments') || '[]');
  }

  /**
   * Clear payment history
   */
  clearPaymentHistory() {
    localStorage.removeItem('pascal_payments');
  }
}

// Export as singleton
export default new BuupassPaymentService();

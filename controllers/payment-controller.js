// Payment Modal Controller
// Handles UI interactions and payment flow

import paymentService from '../services/payment-service.js';
import PAYMENT_CONFIG from '../config/payment-config.js';

class PaymentController {
  constructor() {
    this.modal = null;
    this.paymentForm = null;
    this.currentPaymentData = null;
    this.init();
  }

  /**
   * Initialize payment controller
   */
  init() {
    this.setupDOM();
    this.attachEventListeners();
  }

  /**
   * Setup DOM elements
   */
  setupDOM() {
    this.modal = document.getElementById('payment-modal');
    this.paymentForm = document.getElementById('payment-form');
    this.overlay = document.getElementById('modal-overlay');
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Modal close buttons
    document.getElementById('payment-modal-close')?.addEventListener('click', () => this.closeModal());
    this.overlay?.addEventListener('click', () => this.closeModal());

    // Form submission
    this.paymentForm?.addEventListener('submit', (e) => this.handlePaymentSubmit(e));

    // Service type change - update summary
    document.getElementById('service-type')?.addEventListener('change', (e) => this.updatePaymentSummary(e.target.value));

    // Success/Error button listeners
    document.getElementById('close-success-btn')?.addEventListener('click', () => this.closeModal());
    document.getElementById('retry-payment-btn')?.addEventListener('click', () => this.resetForm());
    document.getElementById('cancel-payment-btn')?.addEventListener('click', () => this.closeModal());

    // Listen for payment events from service
    window.addEventListener('paymentSuccess', (e) => this.handlePaymentSuccess(e.detail));
    window.addEventListener('paymentFailure', (e) => this.handlePaymentFailure(e.detail));
  }

  /**
   * Open payment modal
   * @param {string} serviceType - Type of service to pre-select
   */
  openModal(serviceType = null) {
    if (this.modal) {
      this.modal.classList.remove('modal-hidden');
      if (serviceType) {
        document.getElementById('service-type').value = serviceType;
        this.updatePaymentSummary(serviceType);
      }
    }
  }

  /**
   * Close payment modal
   */
  closeModal() {
    if (this.modal) {
      this.modal.classList.add('modal-hidden');
      this.resetForm();
    }
  }

  /**
   * Update payment summary when service type changes
   */
  updatePaymentSummary(serviceType) {
    const service = PAYMENT_CONFIG.services[serviceType];
    if (service) {
      document.getElementById('summary-service').textContent = service.name;
      const amountText = service.amount === 0 
        ? 'FREE' 
        : `${PAYMENT_CONFIG.currencySymbol} ${service.amount.toLocaleString()}`;
      document.getElementById('summary-amount').textContent = amountText;
    }
  }

  /**
   * Handle payment form submission
   */
  async handlePaymentSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this.paymentForm);
    const serviceType = formData.get('serviceType');
    const service = PAYMENT_CONFIG.services[serviceType];

    if (!service) {
      this.showError('Please select a valid service');
      return;
    }

    // If consultation is free, just book without payment
    if (service.amount === 0) {
      this.handleFreeService(formData);
      return;
    }

    // Store payment data
    this.currentPaymentData = {
      serviceType,
      phoneNumber: formData.get('phoneNumber'),
      customerName: formData.get('customerName'),
      customerEmail: formData.get('customerEmail'),
      amount: service.amount,
      bookingType: 'standard',
    };

    // Disable submit button
    const submitBtn = document.getElementById('payment-submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoader = document.getElementById('submit-loader');
    
    submitBtn.disabled = true;
    submitText.classList.add('hidden');
    submitLoader.classList.remove('hidden');

    try {
      // Call payment service
      const result = await paymentService.initiatePayment(this.currentPaymentData);

      if (result.success) {
        this.showPaymentSuccess(result);
      } else {
        this.showPaymentError(result.error || 'Payment initiation failed');
      }
    } catch (error) {
      this.showPaymentError(error.message);
    } finally {
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      submitLoader.classList.add('hidden');
    }
  }

  /**
   * Handle free services (like consultation)
   */
  handleFreeService(formData) {
    const customerName = formData.get('customerName');
    const customerEmail = formData.get('customerEmail');
    
    // Show success message
    alert(`✅ Consultation booking confirmed!\n\nName: ${customerName}\nEmail: ${customerEmail}\n\nWe'll contact you shortly!`);
    
    // Send confirmation email (in real implementation)
    console.log('Free service booked:', {
      name: customerName,
      email: customerEmail,
      service: formData.get('serviceType'),
    });

    this.closeModal();
  }

  /**
   * Show payment success state
   */
  showPaymentSuccess(result) {
    // Hide form, show success
    document.getElementById('payment-form').classList.add('hidden');
    document.getElementById('payment-error').classList.add('hidden');
    const successDiv = document.getElementById('payment-success');
    successDiv.classList.remove('hidden');

    // Populate success details
    document.getElementById('success-transaction-id').textContent = result.transactionId || '-';
    document.getElementById('success-reference').textContent = result.reference || '-';
    document.getElementById('success-amount').textContent = 
      `${PAYMENT_CONFIG.currencySymbol} ${result.amount.toLocaleString()}`;

    // Auto-close after 10 seconds
    setTimeout(() => {
      this.closeModal();
    }, 10000);
  }

  /**
   * Show payment error state
   */
  showPaymentError(error) {
    document.getElementById('payment-form').classList.remove('hidden');
    document.getElementById('payment-success').classList.add('hidden');
    const errorDiv = document.getElementById('payment-error');
    errorDiv.classList.remove('hidden');
    document.getElementById('error-message').textContent = error;
  }

  /**
   * Handle payment success event from service
   */
  handlePaymentSuccess(data) {
    console.log('Payment success:', data);
    // Update UI if needed
    const statusElement = document.getElementById('payment-status');
    if (statusElement) {
      statusElement.textContent = 'Completed';
      statusElement.classList.add('completed');
    }
  }

  /**
   * Handle payment failure event from service
   */
  handlePaymentFailure(data) {
    console.log('Payment failed:', data);
    this.showPaymentError('Payment could not be completed. Please try again.');
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    this.paymentForm?.reset();
    document.getElementById('payment-form').classList.remove('hidden');
    document.getElementById('payment-success').classList.add('hidden');
    document.getElementById('payment-error').classList.add('hidden');
    document.getElementById('summary-service').textContent = '-';
    document.getElementById('summary-amount').textContent = '-';
    this.currentPaymentData = null;
  }

  /**
   * Show error message
   */
  showError(message) {
    alert('❌ ' + message);
  }

  /**
   * Get payment history
   */
  getPaymentHistory() {
    return paymentService.getPaymentHistory();
  }
}

// Export as singleton
export default new PaymentController();

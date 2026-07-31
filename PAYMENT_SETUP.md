# M-Pesa Payment Integration with Buupass

This payment module integrates M-Pesa payments via the Buupass API into the Pascal Travels website.

## 📋 Overview

- **Payment Gateway**: Buupass API
- **Payment Method**: M-Pesa (Kenyan mobile money)
- **Currency**: KES (Kenyan Shilling)
- **Services**: Visa applications, tours, consultations, and more

## 🚀 Getting Started

### 1. Install Dependencies

The payment system uses vanilla JavaScript with no external dependencies. Just ensure you have:
- Modern browser with ES6+ support
- Internet connection for API calls

### 2. Configure Buupass API

Edit `/config/payment-config.js` and replace placeholder values:

```javascript
buupass: {
  apiKey: 'YOUR_BUUPASS_API_KEY',           // Get from Buupass dashboard
  merchantId: 'YOUR_MERCHANT_ID',           // Your merchant account ID
  apiUrl: 'https://api.buupass.com/v1',     // Buupass API endpoint
  callbackUrl: 'https://pascaltravels.com/api/payment-callback', // Your callback URL
}
```

**How to get credentials:**
1. Sign up at [Buupass](https://buupass.com)
2. Complete merchant verification
3. Generate API key from your Buupass dashboard
4. Copy your Merchant ID
5. Update these values in `config/payment-config.js`

### 3. Add to HTML

Include the payment modal and styling in your main HTML file:

```html
<!-- In <head> -->
<link rel="stylesheet" href="styles/payment.css" />

<!-- Before closing </body> -->
<!-- Payment Modal Component -->
<div id="payment-modal" class="modal modal-hidden">
  <!-- Modal content from components/payment-modal.html -->
</div>

<!-- Import payment controller -->
<script type="module" src="controllers/payment-controller.js"></script>
```

### 4. Trigger Payments

Open the payment modal from any button or link:

```javascript
import paymentController from './controllers/payment-controller.js';

// Open modal with a specific service
paymentController.openModal('visa_application');

// Or without pre-selection
paymentController.openModal();
```

## 📱 Usage Examples

### Example 1: Payment Button in HTML

```html
<button class="btn btn-gold" onclick="openPayment('work_visa')">
  💳 Pay for Work Visa
</button>

<script type="module">
  import paymentController from './controllers/payment-controller.js';
  window.openPayment = (serviceType) => {
    paymentController.openModal(serviceType);
  };
</script>
```

### Example 2: JavaScript Integration

```javascript
import paymentController from './controllers/payment-controller.js';

// When user clicks "Apply Now" button
document.getElementById('apply-btn').addEventListener('click', () => {
  paymentController.openModal('study_visa');
});
```

## 💾 Payment Data Structure

### Payment Request
```javascript
{
  phoneNumber: '254712345678',        // Kenyan phone number
  amount: 5000,                        // Amount in KES
  serviceType: 'visa_application',     // Type of service
  customerName: 'John Doe',            // Customer name
  customerEmail: 'john@example.com',   // Customer email
}
```

### Payment Response
```javascript
{
  success: true,
  transactionId: 'BUU-123456789',      // Buupass transaction ID
  reference: 'PT-1234567890-abc123',   // Your payment reference
  amount: 5000,
  status: 'pending'                    // pending, completed, failed
}
```

## 🔔 Payment Events

The system dispatches custom events for payment status:

```javascript
// Listen for payment success
window.addEventListener('paymentSuccess', (e) => {
  console.log('Payment successful:', e.detail);
  // Update UI, send confirmation email, etc.
});

// Listen for payment failure
window.addEventListener('paymentFailure', (e) => {
  console.log('Payment failed:', e.detail);
  // Show error message, retry option, etc.
});
```

## 💳 Supported Services

Edit `config/payment-config.js` to add/modify services:

```javascript
services: {
  consultation: {
    name: 'Free Consultation',
    amount: 0,
    description: 'Book a free consultation',
  },
  visa_application: {
    name: 'Visa Application Service',
    amount: 5000,
    description: 'Complete visa application',
  },
  // Add more services...
}
```

## 🔒 Security

- ✅ HTTPS required for all API calls
- ✅ API key stored securely (consider using environment variables in production)
- ✅ Phone numbers validated before sending to Buupass
- ✅ Payment references generated with timestamps and random tokens
- ✅ All data encrypted in transit

### Production Security Tips

1. **Never commit API keys** - Use environment variables:
```javascript
const API_KEY = process.env.BUUPASS_API_KEY;
```

2. **Use backend proxy** - Don't call Buupass from frontend in production
3. **Validate on backend** - Verify payments server-side
4. **HTTPS only** - Always use HTTPS in production
5. **Rate limiting** - Implement on your backend to prevent abuse

## 📊 Payment History

Access stored payment records:

```javascript
import paymentService from './services/payment-service.js';

// Get all payments
const history = paymentService.getPaymentHistory();
console.log(history);

// Clear payment history
paymentService.clearPaymentHistory();
```

## 🐛 Troubleshooting

### Payment not initiating?
- ✅ Check API credentials in `config/payment-config.js`
- ✅ Verify phone number format (254XXXXXXXXX)
- ✅ Check browser console for error messages
- ✅ Ensure Buupass account is active

### M-Pesa prompt not appearing?
- ✅ Verify phone number is correct
- ✅ Check if Buupass API is reachable
- ✅ Confirm Buupass account has sufficient balance
- ✅ Check payment status: `paymentService.checkPaymentStatus(transactionId)`

### Callback not received?
- ✅ Verify callback URL in `config/payment-config.js` matches Buupass settings
- ✅ Ensure server endpoint is accessible from internet
- ✅ Check server logs for callback requests
- ✅ Verify firewall/security group rules

## 📞 Support

For Buupass support:
- Website: https://buupass.com
- Email: support@buupass.com
- Documentation: https://docs.buupass.com

## 📝 File Structure

```
www/
├── config/
│   └── payment-config.js          # API configuration
├── services/
│   └── payment-service.js         # Buupass API integration
├── controllers/
│   └── payment-controller.js      # UI controller
├── components/
│   └── payment-modal.html         # Modal HTML
├── styles/
│   └── payment.css                # Modal styling
└── index.html                     # Include payment modal here
```

## 🎯 Next Steps

1. ✅ Sign up with Buupass
2. ✅ Get API credentials
3. ✅ Update `config/payment-config.js`
4. ✅ Include payment modal in `index.html`
5. ✅ Add payment buttons to your site
6. ✅ Test with a small amount
7. ✅ Go live!

## 📄 License

This payment module is part of the Pascal Travels & Tour website.

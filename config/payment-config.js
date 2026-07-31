// Buupass M-Pesa Payment Configuration
const PAYMENT_CONFIG = {
  // Buupass API Configuration
  buupass: {
    apiKey: 'YOUR_BUUPASS_API_KEY', // Replace with your API key
    merchantId: 'YOUR_MERCHANT_ID',   // Replace with your merchant ID
    apiUrl: 'https://api.buupass.com/v1',
    callbackUrl: 'https://pascaltravels.com/api/payment-callback', // Update to your domain
  },
  
  // Currency and formatting
  currency: 'KES',
  currencySymbol: 'KSh',
  
  // Service packages for payment
  services: {
    consultation: {
      name: 'Free Consultation',
      amount: 0,
      description: 'Book a free consultation with our travel experts',
    },
    visa_application: {
      name: 'Visa Application Service',
      amount: 5000,
      description: 'Complete visa application processing',
    },
    work_visa: {
      name: 'Work Visa Processing',
      amount: 8000,
      description: 'End-to-end work visa assistance',
    },
    study_visa: {
      name: 'Study Visa Processing',
      amount: 6000,
      description: 'Study abroad visa and admissions support',
    },
    canada_pr: {
      name: 'Canada PR Consultation',
      amount: 15000,
      description: 'Express Entry and PR pathway planning',
    },
    tour_deposit: {
      name: 'Tour Package Deposit',
      amount: 10000,
      description: '50% deposit for tour bookings',
    },
  },
};

export default PAYMENT_CONFIG;

window.PACKAGES_DATA = {
  services: [
    {
      id: 'jobs',
      name: 'Overseas Jobs',
      shortName: 'Jobs',
      icon: '💼',
      tagline: 'Skilled & unskilled employment abroad',
      description: 'Expert assistance in securing skilled & unskilled jobs abroad — from application to travel preparation. Verified employers across UAE, Qatar, Europe and more.',
      features: ['Verified employer network', 'Skilled & unskilled placement', 'Contract negotiation', 'Pre-departure orientation']
    },
    {
      id: 'work-visa',
      name: 'Work Visas',
      shortName: 'Work Visas',
      icon: '🛠️',
      tagline: 'Legal employment visas worldwide',
      description: 'End-to-end work visa processing with employer documentation, permits, work contracts, and consulate appointment booking.',
      features: ['🇦🇪 UAE (Dubai)', '🇶🇦 Qatar', '🇨🇿 Czech Republic', '🇩🇪 Germany', '🇱🇻 Latvia', '🇷🇸 Serbia', '🇲🇪 Montenegro', '🇸🇰 Slovakia', '🇵🇱 Poland', '🇵🇹 Portugal', '🇪🇪 Estonia & many more']
    },
    {
      id: 'schengen-visa',
      name: 'Schengen Visas',
      shortName: 'Schengen',
      icon: '🇪🇺',
      tagline: '27 European countries — one visa',
      description: 'Specialized help with accurate, complete, and compliant Schengen visa applications covering 27 European nations.',
      features: ['27 country access', 'Single/multiple entry', 'Insurance & itinerary support', 'Fast processing (3-15 days)']
    },
    {
      id: 'study-visa',
      name: 'Study Abroad',
      shortName: 'Study Visas',
      icon: '🎓',
      tagline: 'Admissions + visas + travel prep',
      description: 'Guidance on university admissions, study visas, and seamless travel preparation for students heading to Europe, UK, Canada, USA, Australia.',
      features: ['🇨🇿 Czech Republic', '🇩🇪 Germany', '🇱🇻 Latvia', '🇷🇸 Serbia', '🇲🇪 Montenegro', '🇸🇰 Slovakia', '🇵🇱 Poland', '🇵🇹 Portugal', '🇪🇪 Estonia & many more']
    },
    {
      id: 'canada-pr',
      name: 'Canada PR & Visas',
      shortName: 'Canada / UK / USA / Europe',
      icon: '🍁',
      tagline: 'Permanent Residency & destination visas',
      description: 'Express Entry, PNP nominations, Family Sponsorship. Also destination visas to United Kingdom, Canada, United States, and all of Europe.',
      features: ['🇬🇧 United Kingdom', '🇨🇦 Canada (Express Entry / PNP)', '🇺🇸 United States', '🇪🇺 Europe (Schengen & national)', 'CRS score booster', 'Post-landing settlement']
    },
    {
      id: 'east-africa',
      name: 'East Africa Tours',
      shortName: 'East Africa',
      icon: '🦁',
      tagline: 'Safari, beaches & gorilla treks',
      description: 'Curated local tours and safaris across Kenya, Tanzania, Uganda, Rwanda — wildlife encounters, beach getaways, cultural immersion, all expertly planned.',
      features: ['Masai Mara Great Migration', 'Serengeti & Ngorongoro', 'Bwindi Gorilla Trek (Uganda)', 'Rwanda Volcanoes Gorillas', 'Zanzibar beach holidays', 'Mombasa & Diani coast']
    }
  ],

  travelVisas: [
    { id: 'uae-tv', category: 'travel-visa', country: 'United Arab Emirates', countryCode: 'AE', flag: '🇦🇪', city: 'Dubai / Abu Dhabi', priceProcessing: 189, priceTicket: 620, estimatedDays: '5-7', description: 'Visit the futuristic skylines, luxury malls, and desert adventures of the UAE.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'travelInsurance'], visaTypes: ['Tourist (30 days)', 'Visit (90 days)', 'Transit (96 hrs)'], popularTags: ['Burj Khalifa', 'Desert Safari', 'Luxury Shopping'] },
    { id: 'kazakhstan-tv', category: 'travel-visa', country: 'Kazakhstan', countryCode: 'KZ', flag: '🇰🇿', city: 'Almaty / Astana', priceProcessing: 149, priceTicket: 780, estimatedDays: '7-10', description: 'Explore the vast steppes, modern architecture, and mountain landscapes of Central Asia.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'invitationLetter'], visaTypes: ['Tourist (30 days)', 'Business'], popularTags: ['Mountain Lakes', 'Silk Road', 'Astana City'] },
    { id: 'india-tv', category: 'travel-visa', country: 'India', countryCode: 'IN', flag: '🇮🇳', city: 'Mumbai / Delhi', priceProcessing: 129, priceTicket: 550, estimatedDays: '3-5', description: 'Discover ancient palaces, vibrant festivals, and diverse cultures across incredible India.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'itineraryDetails'], visaTypes: ['e-Tourist (30 days)', 'e-Tourist (1 year)'], popularTags: ['Taj Mahal', 'Bollywood', 'Spiritual'] },
    { id: 'oman-tv', category: 'travel-visa', country: 'Oman', countryCode: 'OM', flag: '🇴🇲', city: 'Muscat', priceProcessing: 159, priceTicket: 580, estimatedDays: '5-7', description: 'Experience authentic Arabian hospitality, stunning fjords, desert camps, and historic forts.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'travelInsurance'], visaTypes: ['e-Visa (30 days)', 'Express (24 hrs)'], popularTags: ['Desert Camps', 'Historic Forts', 'Dolphin Watching'] },
    { id: 'saudi-tv', category: 'travel-visa', country: 'Saudi Arabia', countryCode: 'SA', flag: '🇸🇦', city: 'Riyadh / Jeddah', priceProcessing: 179, priceTicket: 600, estimatedDays: '5-8', description: 'Discover NEOM, Red Sea projects, historical Diriyah, and modern Saudi Arabia.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking'], visaTypes: ['Tourist eVisa (90 days)', 'Umrah + Tourist'], popularTags: ['Al-Ula Heritage', 'Red Sea', 'NEOM'] },
    { id: 'qatar-tv', category: 'travel-visa', country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', city: 'Doha', priceProcessing: 139, priceTicket: 590, estimatedDays: '4-6', description: 'World-class museums, futuristic stadiums, luxury hotels, and genuine Arabian hospitality.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'travelInsurance'], visaTypes: ['Hayya Card (90 days)', 'Tourist eVisa'], popularTags: ['Museums', 'Lusail City', 'Doha Corniche'] },
    { id: 'bahrain-tv', category: 'travel-visa', country: 'Bahrain', countryCode: 'BH', flag: '🇧🇭', city: 'Manama', priceProcessing: 149, priceTicket: 560, estimatedDays: '5-7', description: 'Island kingdom with ancient history, modern souqs, pearl diving, and F1 circuit.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking'], visaTypes: ['eVisa (14/30 days)', 'Multi-entry'], popularTags: ['Pearl Diving', 'F1 Circuit', 'Ancient Sites'] },
    { id: 'georgia-tv', category: 'travel-visa', country: 'Georgia', countryCode: 'GE', flag: '🇬🇪', city: 'Tbilisi', priceProcessing: 119, priceTicket: 680, estimatedDays: '7-10', description: 'Caucasus gem with ancient wine culture, mountain monasteries, and charming old towns.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'travelInsurance'], visaTypes: ['eVisa (30/90 days)'], popularTags: ['Wine Tours', 'Caucasus Mountains', 'Old Tbilisi'] },
    { id: 'uk-tv', category: 'travel-visa', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London / Manchester', priceProcessing: 229, priceTicket: 890, estimatedDays: '15-21', description: 'Standard Visitor visa for tourism, family visits, or short business trips across England, Scotland, Wales, NI.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'hotelBooking', 'invitationLetter', 'travelInsurance'], visaTypes: ['Standard Visitor (6 months)', 'Long-term 2/5/10 yr'], popularTags: ['Big Ben', 'Royal Palaces', 'Scottish Highlands'] },
    { id: 'usa-tv', category: 'travel-visa', country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'Nationwide', priceProcessing: 279, priceTicket: 1150, estimatedDays: '21-45', description: 'B1/B2 visitor visa application with DS-160 filing, interview prep, and consulate appointment booking.', requirements: ['passport', 'photos', 'bankStatement', 'flightItinerary', 'itineraryDetails'], visaTypes: ['B1 Business', 'B2 Tourism', 'B1/B2 Combined'], popularTags: ['New York', 'California', 'National Parks'] }
  ],

  workVisas: [
    { id: 'dubai-wv', category: 'work-visa', country: 'United Arab Emirates (Dubai)', countryCode: 'AE', flag: '🇦🇪', city: 'Dubai', priceProcessing: 250000, priceTicket: 0, processingCurrency: 'KES', estimatedDays: '~2 months', ageLimit: 'All nationalities (excl. sanctioned countries)', description: 'DUBAI — Employment Visa & Legal Work Placement. Full employer-sponsored work permit, employment contract, and legal placement with UAE-registered companies.', requirements: ['passport', 'cv', 'diploma', 'policeClearance'], visaTypes: ['Work Permit (Employment Visa)'], industries: ['Hospitality', 'Construction', 'Retail', 'Logistics', 'Healthcare', 'Domestic'], salaryRange: 'AED 2,000 – AED 6,000/month',
      pricingBreakdown: { currency: 'KES', totalServiceFee: 250000, installments: [{ label: 'Initial payment', amount: 100000 }, { label: 'Final payment (upon document readiness)', amount: 150000 }],
        visitOption: { label: 'Visit Visa + Ticket + Airport Pickup + Accommodation + Job', total: 230000, installments: [{ label: '1st installment', amount: 80000 }, { label: '2nd installment', amount: 100000 }, { label: '3rd installment', amount: 50000 }] } },
      employerDocs: ['Official Work Permit', 'Employment Contract', 'Proof of Accommodation (optional)'],
      procedureSteps: [
        'Candidate submits all required documents (passport 6+ months valid, CV, address, education docs, police clearance) and pays initial KES 100,000.',
        'Pascal forwards the profile to the UAE employer who initiates work permit & MOHRE application.',
        'Once the document package is ready the candidate receives certified confirmation of readiness and pays the final KES 150,000.',
        'The complete work visa file (Work Permit + contract + accommodation support) is released to the candidate for entry.'
      ],
      additionalInfo: ['Target audience: Candidates of all nationalities except sanctioned/restricted-travel countries.', 'Processing time: approximately 2 months from document submission.', 'Work visa is issued for 2 years (standard UAE employment visa), renewable.', 'Medical fitness test conducted on arrival in the UAE.'] },

    { id: 'qatar-wv', category: 'work-visa', country: 'Qatar', countryCode: 'QA', flag: '🇶🇦', city: 'Doha', priceProcessing: 270000, priceTicket: 0, processingCurrency: 'KES', estimatedDays: '~2 months', ageLimit: 'All nationalities (excl. sanctioned countries)', description: 'QATAR — Employment Visa & Legal Work Placement. Employer-sponsored work permit and employment contract with Qatari-registered companies across hospitality, construction, healthcare, and oil & gas support.', requirements: ['passport', 'cv', 'diploma', 'policeClearance'], visaTypes: ['Work Permit (Qatar Employment Visa)'], industries: ['Hospitality', 'Construction', 'Healthcare', 'Oil & Gas Support', 'Retail'], salaryRange: 'QAR 2,000 – QAR 7,000/month',
      pricingBreakdown: { currency: 'KES', totalServiceFee: 270000, installments: [{ label: 'Initial payment', amount: 120000 }, { label: 'Final payment (upon document readiness)', amount: 150000 }],
        visitOption: { label: 'Visit Visa + Ticket + Airport Pickup + Accommodation + Job', total: 250000, installments: [{ label: '1st installment', amount: 100000 }, { label: '2nd installment', amount: 100000 }, { label: '3rd installment', amount: 50000 }] } },
      employerDocs: ['Official Work Permit', 'Employment Contract', 'Proof of Accommodation (optional)'],
      procedureSteps: [
        'Candidate submits all required documents (passport 6+ months valid, CV, address, education docs, police clearance) and pays initial KES 120,000.',
        'Pascal forwards the candidate profile to the Qatari employer to begin Ministry of Labour work permit processing.',
        'Once documents are ready the candidate receives sworn confirmation of readiness and pays the final KES 150,000.',
        'Work visa documents are dispatched to the candidate for visa stamping and travel to Doha.'
      ],
      additionalInfo: ['Target audience: Candidates of all nationalities except sanctioned/restricted-travel countries.', 'Processing time: approximately 2 months.', 'Qatar work residence visa is valid for 2 years, renewable through employer.', 'Qatar ID (QID) is processed after arrival by the employer.'] },

    { id: 'czech-wv', category: 'work-visa', country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', city: 'Prague', priceProcessing: 4000, priceTicket: 0, processingCurrency: 'EUR', estimatedDays: 'Document preparation 5–10 business days · DHL delivery up to 10 days', ageLimit: 'All nationalities (excl. restricted/high-risk countries)', description: 'CZECH REPUBLIC — 2-Year Work Card. Central EU single-market access. Full employment contract, accommodation confirmation, and business-entity acceptance letter for Employee Card.', requirements: ['passport', 'cv', 'sponsorshipLetter', 'accommodationProof'], visaTypes: ['Employee / Work Card (2 years)'], industries: ['IT & Software', 'Automotive', 'Manufacturing', 'Tourism & Hospitality'], salaryRange: '€1,200 – €3,500/month',
      pricingBreakdown: { currency: 'EUR', totalServiceFee: 4000, installments: [{ label: 'First payment (advance)', amount: 1500 }, { label: 'Second payment (upon document readiness)', amount: 2500 }] },
      visaSupportPackage: ['Employment contract', 'Proof of accommodation', 'Confirmation from a Czech business entity accepting a third-country national for employment purposes'],
      candidateRequiredToProvide: ['A scanned copy of your valid international passport (first page and any visa/stamp pages)', 'Completed job application form (we will provide a template)', 'Updated CV', 'Full residential address', 'Preferred activation date of the invitation (considering time for document preparation is required)', 'Payment confirmation'],
      procedureSteps: [
        'Step 1: Candidate submits passport scan, completed job application template, CV, full residential address, preferred invitation activation date, and payment confirmation. Pays first advance of €1,500.',
        'Step 2: Pascal forwards all data to the Czech business partner; document preparation takes 5–10 business days.',
        'Step 3: Upon certified document readiness the candidate pays the remaining €2,500 final balance.',
        'Step 4: Full visa support package (employment contract + accommodation + entity confirmation letter) is dispatched via DHL (up to 10 days) for consulate submission.'
      ],
      additionalInfo: ['Work / Employee Card is issued for 2 years by the Czech consulate.', 'After 4 years of continuous legal stay, long-term residency is available (per Czech legislation).', 'EU Blue Card upgrade option is available for highly-qualified candidates meeting salary thresholds.'] },

    { id: 'germany-wv', category: 'work-visa', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Berlin / Munich', priceProcessing: 3500, priceTicket: 750, processingCurrency: 'EUR', estimatedDays: 'Up to 20 weeks (document processing) + up to 10 business days delivery', ageLimit: 'Applicants must be 45 years old or younger. All nationalities except international terrorism sanctions.', description: 'GERMANY — Employment Documents for Skilled Workers. EU powerhouse with IHK recognition of qualifications, German Employment Agency (ZAV) approval, and full employer sponsorship.', requirements: ['passport', 'photos', 'employmentContract', 'diploma', 'cv', 'workExperience', 'languageTest'], visaTypes: ['EU Blue Card', 'Work Visa (Skilled)'], industries: ['Engineering', 'IT', 'Healthcare', 'Automotive', 'Construction'], salaryRange: '€3,500 – €7,000/month',
      pricingBreakdown: { currency: 'EUR', totalServiceFee: 3500, installments: [{ label: 'Initial payment (post-verification)', amount: 2000 }, { label: 'Final payment (upon document readiness)', amount: 1500 }] },
      employerDocs: ['Official Work Permit', 'Employment Contract', 'Invitation Letter for residence application', 'Access to German Language Courses'],
      procedureSteps: [
        'Step 1 – Pre-Assessment & Verification: A manager conducts a preliminary verification interview (screen-recorded) to confirm work history and qualifications. Candidate then pays initial €2,000 to start processing.',
        'Step 2 – Document Preparation: Qualifications recognition by IHK (Chamber of Industry and Commerce), employment contract drafting, submission to German Employment Agency (ZAV), preparation of all embassy-level visa documents.',
        'Step 3 – Arrival & Employment: Candidate welcomed with temporary accommodation, official work registration, probationary employment begins as per contract. Final €1,500 balance is paid on certified digital confirmation of document readiness.'
      ],
      additionalInfo: ['Documents are issued for 1 year.', 'Visa is issued for a 12-month period with an initial 90-day stay allowance.', 'Candidate applies for the visa at the German consulate; consular fees paid by candidate (vary by country).', 'Upon arrival the employer provides assistance with the residence permit (TRC) process.'] },

    { id: 'latvia-wv', category: 'work-visa', country: 'Latvia', countryCode: 'LV', flag: '🇱🇻', city: 'Riga', priceProcessing: 5000, priceTicket: 0, processingCurrency: 'EUR', estimatedDays: 'Doc prep 2–6 weeks · DHL delivery up to 20 days', ageLimit: '18 – 55 years · All nationalities except sanctioned/travel-restricted countries', description: 'LATVIA — Seasonal work with official documents. Baltic seasonal and full-time work programs with employer permits, contracts, and invitation letters for visa submission.', requirements: ['passport', 'cv', 'diploma', 'policeClearance'], visaTypes: ['Seasonal Work Visa (3 months) → TRC after 2 months'], industries: ['Agriculture / Seasonal', 'Logistics', 'Wood Processing', 'Hospitality'], salaryRange: '€1,200 – €3,000/month',
      pricingBreakdown: { currency: 'EUR', totalCostOfService: 5000, installments: [{ label: 'Initial payment', amount: 2000 }, { label: 'Final payment (upon document readiness)', amount: 3000 }] },
      requiredFromCandidate: ['High-quality scanned copy of the passport (1st page + all stamps)', 'Completed job application brief (template provided)', 'CV (résumé)', 'Full residential address', 'Police clearance certificate', 'Educational diploma (if available)', 'Additional education info (if available)', 'Payment confirmation for service'],
      employerDocs: ['Official work permit', 'Employment contract', 'Invitation letter for visa submission'],
      procedureSteps: [
        'Step 1: Candidate submits all required documents (as per Required From Candidate list) and pays the initial amount of €2,000. Pascal forwards the candidate profile to the employer and initiates document preparation.',
        'Step 2: Once official documents are ready the candidate receives sworn confirmation of readiness and proceeds with the final payment of €1,900.',
        'Step 3: The complete document package is then handed over / dispatched via DHL (up to 20 days) for visa application.'
      ],
      additionalInfo: ['The employer fully supports the candidate throughout the visa process, including consulate appointment registration.', 'After 2 months of employment assistance is provided to apply for a Temporary Residence Permit (TRC) — additional cost €950.', 'Candidates first apply for a seasonal work visa valid for 3 months.', 'Estimated consular/service fees: €60–90 (paid by the candidate directly at the consulate or VFS).', 'Applicants from India, Nepal, and Sri Lanka must undergo document verification through Hello Verify India Private Limited PRIOR to submitting a visa application via VFS Global Latvia — verification must be completed before submitting the visa request.'] },

    { id: 'serbia-wv', category: 'work-visa', country: 'Serbia', countryCode: 'RS', flag: '🇷🇸', city: 'Belgrade', priceProcessing: 3500, priceTicket: 0, processingCurrency: 'EUR', estimatedDays: 'Document preparation: up to 3 weeks · Visa issuance approx. 60 working days from submission to consulate', ageLimit: '18 – 55 years · All nationalities except restricted/high-risk nations', description: 'SERBIA — Full work document package. Employer-issued Work Permit, Employment Contract, Official Job Offer, and PPZ document for consulate submission.', requirements: ['passport', 'cv', 'diploma'], visaTypes: ['Temporary Residence Visa (Work, Type D)'], industries: ['IT Outsourcing', 'Manufacturing', 'Agriculture', 'Construction'], salaryRange: '€800 – €2,200/month',
      pricingBreakdown: { currency: 'EUR', totalCost: 3500, installments: [{ label: 'Advance payment', amount: 2000 }, { label: 'Final payment (once documents are ready)', amount: 1500 }] },
      requiredFromCandidate: ['Scanned copy of international passport (main page + any stamps)', 'CV (résumé)', 'Full residential address', 'Diploma (if available)'],
      employerDocs: ['Work permit', 'Employment contract', 'Official job offer', 'PPZ document'],
      procedureSteps: [
        'Step 1: The candidate makes an initial payment of €1,800. Pascal forwards the candidate data to the employer and document processing begins.',
        'Step 2: Once the documents are ready, the candidate pays the remaining €1,500 and receives the full electronic document package.'
      ],
      additionalInfo: ['Government service fees (consular and notarial): approx. €65–110 — paid separately by the candidate at the consulate/notary.', 'The electronic documents are valid for 6 months from the date of issue.'] },

    { id: 'montenegro-wv', category: 'work-visa', country: 'Montenegro', countryCode: 'ME', flag: '🇲🇪', city: 'Podgorica', priceProcessing: 3900, priceTicket: 700, processingCurrency: 'EUR', estimatedDays: 'Doc prep 7–14 working days · Visa processing 25–40 working days', ageLimit: '18 – 55 years', description: 'MONTENEGRO — Work Visa & Employment Opportunity. Adriatic gem with booming tourism, real estate, construction, and renewable energy projects. Full company invitation + contract + CRPS certificate.', requirements: ['passport', 'cv', 'diploma', 'policeClearance', 'workExperience'], visaTypes: ['Type D Visa (180 days) → 1-year Work Permit → TRC'], industries: ['Tourism', 'Construction', 'Renewable Energy', 'Hospitality'], salaryRange: '€700 – €1,800/month',
      pricingBreakdown: { currency: 'EUR', totalCostOfService: 3900, installments: [{ label: 'Initial payment (€2,000 advance)', amount: 2000 }, { label: 'Final payment (upon receipt of documents)', amount: 1900 }] },
      employerDocs: ['Invitation letter from the company', 'Official employment contract', 'Certificate of company registration (CRPS)'],
      visaSubmissionDocs: ['Employer invitation letter', 'Signed work contract', 'Company registration (CRPS)', 'Visa application form', 'Two recent passport-size photos', 'Bank statement with stamp (recommended)', 'Police clearance certificate in English', 'Medical insurance valid 180 days (tourist coverage)', 'Proof of employment history (diplomas / certificates / work book)', 'Round-trip flight reservation to Podgorica or Tivat', 'Visa fee payment (instructions via embassy email)'],
      procedureSteps: [
        'Step 1: Candidate pays an advance of €2,000. Pascal initiates document processing and submits the data to the employer.',
        'Step 2: Once documents are ready the candidate receives certified scans. After confirming readiness, candidate pays the remaining €1,900 to receive the full document package.',
        'Step 3: Candidate attends in-person visa appointment at the relevant consulate (see Visa Submission Locations below) with all listed documentation.'
      ],
      visaSubmissionLocations: [
        'India, Nepal, Bangladesh → Embassy of Serbia in New Delhi',
        'Pakistan → Embassy of Serbia in Tehran'
      ],
      additionalInfo: ['Passport must be valid for at least 18 months.', 'Police clearance must be in English; notarization not required.', 'Proof of work experience (licenses, recommendations, experience certificates) especially valued for construction roles.', 'Basic English communication skills required.', 'Type D visa issued for 180 days; documents are issued for a 1-year work permit.', 'After arrival the employer assists with the Temporary Residence Card (TRC).', 'Approximate visa application fee: ~€100 (may vary by country of submission).'] },

    { id: 'slovakia-wv', category: 'work-visa', country: 'Slovakia', countryCode: 'SK', flag: '🇸🇰', city: 'Bratislava', priceProcessing: 3500, priceTicket: 690, processingCurrency: 'EUR', estimatedDays: 'Doc prep 21–28 business days · Add. labor office 28 bd · DHL up to 10 days · Visa issuance 30–35 bd', ageLimit: '18 – 55 years', description: 'SLOVAKIA — Complete work documentation package. Central European manufacturing & IT hub integrated into the EU single market. Full work permit, employment contract, job offer, guarantee letter & accommodation proof.', requirements: ['passport', 'cv', 'diploma'], visaTypes: ['Single Permit (Work + Residence)', 'EU Blue Card'], industries: ['Automotive', 'IT', 'Electronics', 'Manufacturing', 'Welding / Electrical / Driver (qualified)'], salaryRange: '€1,000 – €2,800/month',
      pricingBreakdown: { currency: 'EUR', totalCostOfService: 3500, installments: [{ label: 'Initial payment', amount: 2000 }, { label: 'Final payment (upon receipt of documents)', amount: 1500 }] },
      employerDocs: ['Work permit', 'Employment contract / Job offer letter', 'Letter of guarantee', 'Proof of accommodation'],
      procedureSteps: [
        'Step 1: Candidate submits all required documents (scanned passport main page + stamps, CV, full residential address, diploma if applicable, educational background, skill certificates if qualified role — welders, electricians, drivers, basic English A2–B1) and pays initial €2,000.',
        'Step 2: Pascal forwards the candidate profile to the employer and initiates document preparation including any additional labor-office confirmation (28 business days for select countries).',
        'Step 3: Once official documents are ready the candidate receives sworn confirmation of readiness and pays the final €1,500. Complete document package is dispatched via DHL (up to 10 days).',
        'Step 4: Visa is affixed at the consulate after documents approval (30–35 business days).'
      ],
      additionalInfo: ['Passport must be valid for at least 12 months from date of submission.', 'Basic English knowledge A2–B1 level is required.', 'Type D national visa is issued for 6 to 12 months.', 'Approximate consular and service fees: €60–100 (paid directly by candidate).', 'All documents valid for 1 year.', 'Upon arrival employer assists with Temporary Residence Card (TRC).'] },

    { id: 'poland-wv', category: 'work-visa', country: 'Poland', countryCode: 'PL', flag: '🇵🇱', city: 'Warsaw / Krakow', priceProcessing: 849, priceTicket: 680, processingCurrency: 'EUR', estimatedDays: '30-45 days', description: 'One of Europe\'s fastest-growing economies. Strong demand in IT, manufacturing, and BPO shared services.', requirements: ['passport', 'photos', 'employmentContract', 'diploma', 'policeClearance', 'medical', 'proofOfFunds'], visaTypes: ['Work Permit + Residence', 'EU Blue Card'], industries: ['IT', 'Manufacturing', 'BPO / Shared Services'], salaryRange: '€1,100 – €3,200/month' },

    { id: 'portugal-wv', category: 'work-visa', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', city: 'Lisbon / Porto', priceProcessing: 6000, priceTicket: 780, processingCurrency: 'EUR', estimatedDays: 'Up to 60 working days from start of application', ageLimit: 'All nationalities except those under international sanctions/travel restrictions', description: 'PORTUGAL — Employment Visa & Legal Job Placement. Atlantic coast lifestyle, booming tech scene, renewable energy and tourism. Full employer work permit, contract, accommodation, and business entity hosting confirmation.', requirements: ['passport', 'cv', 'diploma', 'policeClearance'], visaTypes: ['Residence Visa Type D (Work, 365 days) → TRC 1–2 yrs'], industries: ['Tech & Startups', 'Tourism', 'Renewables', 'Construction'], salaryRange: '€1,200 – €3,500/month',
      pricingBreakdown: { currency: 'EUR', serviceFee: 6000, installments: [{ label: 'Initial payment', amount: 3000 }, { label: 'Final payment (upon document readiness)', amount: 3000 }] },
      employerDocs: ['Official Work Permit', 'Signed Employment Contract', 'Proof of Accommodation in Portugal', 'Official confirmation that a Portuguese business entity is hosting a third-country national for employment purposes'],
      procedureSteps: [
        'Step 1: Candidate submits all required documents (high-quality passport bio-page + all stamped pages, completed order brief, updated CV, residential address, education certificates, police clearance, proof of initial installment) and pays initial €3,000.',
        'Step 2: Pascal forwards the candidate profile to the Portuguese employer and initiates document preparation.',
        'Step 3: Once official documents are ready the candidate receives sworn confirmation of readiness and proceeds with the final payment of €2,500.',
        'Step 4: The complete document package is handed over for visa application submission at the nearest Portuguese Embassy or Visa Center.'
      ],
      additionalInfo: ['The Type D visa is issued for 365 days.', 'Visa and consular fees are to be covered by the candidate directly at the Embassy or Visa Center.', 'Upon arrival in Portugal, the employer assists in obtaining a Temporary Residence Card (TRC) valid for 1 to 2 years.'] },

    { id: 'estonia-wv', category: 'work-visa', country: 'Estonia', countryCode: 'EE', flag: '🇪🇪', city: 'Tallinn', priceProcessing: 5000, priceTicket: 710, processingCurrency: 'EUR', estimatedDays: 'Up to 60 working days from the start of the procedure', ageLimit: 'All nationalities except those under international sanctions/travel restrictions', description: 'ESTONIA — Employment Visa & Legal Work Placement. Digital society pioneer with e-Residency program and vibrant startup ecosystem. Full employer work permit, contract, accommodation, and Estonian business entity confirmation letter.', requirements: ['passport', 'cv', 'diploma', 'policeClearance'], visaTypes: ['Type D National Visa (6-12 months) → Temporary Residence Card (1–2 years)'], industries: ['Fintech & IT', 'Startups', 'Cybersecurity'], salaryRange: '€1,500 – €3,800/month',
      pricingBreakdown: { currency: 'EUR', totalServiceFee: 5000, installments: [{ label: 'Initial payment (€2,500)', amount: 2500 }, { label: 'Final payment (upon document readiness, €2,500)', amount: 2500 }] },
      employerDocs: ['Official Work Permit', 'Employment Contract', 'Proof of Accommodation in Estonia', 'Confirmation letter from the Estonian business entity stating acceptance of a third-country national for the purpose of employment'],
      procedureSteps: [
        'Step 1: The candidate submits all required documents (high-quality passport scan main page + entry/exit stamps, completed order brief, CV, full residential address, education documents, police clearance, proof of initial installment payment) and makes the initial payment of €2,500. Pascal forwards candidate information to the employer to begin processing.',
        'Step 2: Once the document package is ready, the candidate receives certified confirmation of readiness and pays the remaining €2,000. The final package is then sent to the candidate for visa application.'
      ],
      additionalInfo: ['A Type D national visa is issued for 6 to 12 months.', 'Visa and consular service fees are paid directly by the candidate to the consulate — not included in the service offer.', 'Employment documents are issued for a 1-year period and provided in electronic format.', 'After arrival and 3 months of employment the employer provides support in applying for a Temporary Residence Card (TRC) valid for 1 to 2 years.', 'The employer pre-registers the candidate for their visa appointment at the Estonian consulate.'] }
  ],

  studyVisas: [
    { id: 'usa-sv', category: 'study-visa', country: 'United States', countryCode: 'US', flag: '🇺🇸', city: 'Nationwide', priceProcessing: 699, priceTicket: 950, estimatedDays: '45-60', description: 'World\'s top-ranked universities, diverse campuses, and Optional Practical Training (OPT) post-graduation.', requirements: ['passport', 'photos', 'admissionLetter', 'tuitionReceipt', 'diploma', 'languageTest', 'proofOfFunds', 'bankStatement'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Community College'], avgTuition: '$20,000 - $60,000/year' },
    { id: 'uk-sv', category: 'study-visa', country: 'United Kingdom', countryCode: 'GB', flag: '🇬🇧', city: 'London / Manchester', priceProcessing: 599, priceTicket: 820, estimatedDays: '30-45', description: 'Prestigious Russell Group universities, 2-year Graduate Route post-study work visa.', requirements: ['passport', 'photos', 'admissionLetter', 'tuitionReceipt', 'diploma', 'languageTest', 'bankStatement'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Foundation'], avgTuition: '£15,000 - £38,000/year' },
    { id: 'canada-sv', category: 'study-visa', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', city: 'Toronto / Vancouver', priceProcessing: 549, priceTicket: 890, estimatedDays: '30-45', description: 'PGWP pathway to PR. High-quality education, multicultural cities, and safe environment.', requirements: ['passport', 'photos', 'admissionLetter', 'tuitionReceipt', 'diploma', 'languageTest', 'proofOfFunds'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Diploma'], avgTuition: 'C$20,000 - C$45,000/year' },
    { id: 'australia-sv', category: 'study-visa', country: 'Australia', countryCode: 'AU', flag: '🇦🇺', city: 'Sydney / Melbourne', priceProcessing: 579, priceTicket: 1050, estimatedDays: '30-45', description: 'Group of 8 universities, 2-4 year post-study work rights, excellent quality of life.', requirements: ['passport', 'photos', 'admissionLetter', 'tuitionReceipt', 'diploma', 'languageTest', 'proofOfFunds', 'medical'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Vocational'], avgTuition: 'A$25,000 - A$55,000/year' },
    { id: 'czech-sv', category: 'study-visa', country: 'Czech Republic', countryCode: 'CZ', flag: '🇨🇿', city: 'Prague', priceProcessing: 449, priceTicket: 720, estimatedDays: '30-60', description: 'Affordable tuition, centuries-old universities, and EU student mobility via Erasmus+.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'languageTest', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Medical / Engineering'], avgTuition: '€0 (public Czech-taught) – €12,000/year (English)' },
    { id: 'germany-sv', category: 'study-visa', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', city: 'Berlin / Munich', priceProcessing: 499, priceTicket: 750, estimatedDays: '45-60', description: 'Tuition-free public universities, 18-month job seeker visa post-graduation.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'languageTest', 'blockedAccount', 'healthInsurance' ], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€0 (public) – €20,000 (private)' , _blockedAccountNote: true },
    { id: 'latvia-sv', category: 'study-visa', country: 'Latvia', countryCode: 'LV', flag: '🇱🇻', city: 'Riga', priceProcessing: 399, priceTicket: 680, estimatedDays: '30-45', description: 'Baltic EU member with strong technical universities, affordable tuition, and post-study work opportunities.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€2,500 – €7,000/year' },
    { id: 'serbia-sv', category: 'study-visa', country: 'Serbia', countryCode: 'RS', flag: '🇷🇸', city: 'Belgrade / Novi Sad', priceProcessing: 379, priceTicket: 620, estimatedDays: '25-40', description: 'Affordable EU-candidate country universities, English-taught medical programs, and low cost of living.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD', 'Medicine'], avgTuition: '€1,500 – €6,000/year' },
    { id: 'montenegro-sv', category: 'study-visa', country: 'Montenegro', countryCode: 'ME', flag: '🇲🇪', city: 'Podgorica', priceProcessing: 369, priceTicket: 700, estimatedDays: '25-40', description: 'Small Adriatic nation with accredited medical schools, tourism & business faculties, and warm climate.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'Medicine / Dentistry'], avgTuition: '€2,000 – €7,500/year' },
    { id: 'slovakia-sv', category: 'study-visa', country: 'Slovakia', countryCode: 'SK', flag: '🇸🇰', city: 'Bratislava', priceProcessing: 399, priceTicket: 690, estimatedDays: '30-45', description: 'Central EU country with affordable technical universities, medical programs, and automotive-engineering pathways.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€0 (Slovak-taught) – €5,500/year (English)' },
    { id: 'poland-sv', category: 'study-visa', country: 'Poland', countryCode: 'PL', flag: '🇵🇱', city: 'Warsaw / Krakow', priceProcessing: 429, priceTicket: 680, estimatedDays: '30-45', description: 'Fast-growing EU economy, excellent technical universities, and 9-month post-study job seeker visa.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€1,800 – €8,000/year' },
    { id: 'portugal-sv', category: 'study-visa', country: 'Portugal', countryCode: 'PT', flag: '🇵🇹', city: 'Lisbon / Porto', priceProcessing: 479, priceTicket: 780, estimatedDays: '35-50', description: 'Sunny coastal EU country with ranked universities in Lisbon, Porto, and Coimbra. Golden Visa pathway via investments after graduation.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€600 (public) – €9,500 (private)' },
    { id: 'estonia-sv', category: 'study-visa', country: 'Estonia', countryCode: 'EE', flag: '🇪🇪', city: 'Tallinn', priceProcessing: 419, priceTicket: 710, estimatedDays: '30-45', description: 'Digital-society pioneer with tuition-free Estonian-taught programs and strong IT/fintech programs in English. Post-graduation 12-month job seeker visa.', requirements: ['passport', 'photos', 'admissionLetter', 'diploma', 'proofOfFunds', 'accommodationProof'], degreeLevels: ['Bachelor\'s', 'Master\'s', 'PhD'], avgTuition: '€0 (ET-taught) – €7,000/year (English)' }
  ],

  canadaPR: [
    { id: 'ca-expressentry', category: 'canada-pr', country: 'Canada', countryCode: 'CA', flag: '🍁', stream: 'Express Entry', priceProcessing: 2499, estimatedDays: '6-9 months', description: 'Federal Skilled Worker, Federal Skilled Trades, and Canadian Experience Class. Points-based system for skilled workers.', requirements: ['passport', 'languageTest', 'workExperience', 'diploma', 'policeClearance', 'medical', 'proofOfFunds'], minCRS: '~500 (varies)', settlementFunds: '$13,757 single / $21,552 couple', inclusions: ['Profile creation & CRS optimization', 'Document collection & review', 'ITA application filing', 'PR card tracking'] },
    { id: 'ca-pnp', category: 'canada-pr', country: 'Canada', countryCode: 'CA', flag: '🍁', stream: 'Provincial Nominee Program (PNP)', priceProcessing: 2999, estimatedDays: '9-15 months', description: 'Nomination by a Canadian province (Ontario, BC, Alberta, Manitoba etc.) gives 600 extra CRS points — near-guaranteed ITA.', requirements: ['passport', 'languageTest', 'workExperience', 'diploma', 'policeClearance', 'medical'], popularPNPs: ['Ontario OINP', 'BC PNP', 'Alberta AINP', 'Manitoba MPNP'], inclusions: ['Province eligibility assessment', 'Nomination application', 'Federal PR stage', 'Settlement guidance'] },
    { id: 'ca-family-sponsorship', category: 'canada-pr', country: 'Canada', countryCode: 'CA', flag: '🍁', stream: 'Family Sponsorship', priceProcessing: 1899, estimatedDays: '12-18 months', description: 'Canadian citizens or PRs can sponsor spouse, common-law partner, dependent children, or parents/grandparents.', requirements: ['passport', 'marriage/relationship proof', 'sponsor financial docs', 'policeClearance', 'medical'], inclusions: ['Relationship documentation', 'Sponsor eligibility check', 'Spousal PR application', 'Interview prep (if needed)'] }
  ],

  eastAfricaTours: [
    { id: 'ea-kenya-safari', category: 'east-africa', country: 'Kenya', countryCode: 'KE', flag: '🇰🇪', destination: 'Masai Mara Safari', days: 5, pricePerPerson: 1299, description: 'Witness the Great Migration, big five game drives, and cultural Masai village visits.', inclusions: ['4x4 Land Cruiser safari vehicle', 'Professional English guide', 'Luxury tented camp (FB)', 'Park entry fees', 'All game drives', 'Masai village visit'], highlights: ['Big Five spotting', 'Hot air balloon option', 'Masai cultural experience', 'River crossings (seasonal)'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance'], packageImage: 'photorealistic Masai Mara savanna landscape at golden hour with acacia trees and safari jeep, wildlife in distance, Kenya flag subtle, high quality professional travel photography' },
    { id: 'ea-tanzania-sereng', category: 'east-africa', country: 'Tanzania', countryCode: 'TZ', flag: '🇹🇿', destination: 'Serengeti & Ngorongoro', days: 7, pricePerPerson: 1799, description: 'Endless plains of Serengeti, the world\'s largest intact caldera, and great migration spectacle.', inclusions: ['Safari vehicle & driver-guide', 'Luxury lodge accommodation', 'All meals & bottled water', 'Conservation & park fees', 'Ngorongoro crater tour', 'Tarangire day visit'], highlights: ['Serengeti wildebeest migration', 'Ngorongoro Crater game drive', 'Maasai markets', 'Luxury rim lodges'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance'], packageImage: 'photorealistic Serengeti plains with vast herds of wildebeest during migration, acacia tree silhouettes against sunset, luxury safari jeep, high resolution' },
    { id: 'ea-uganda-gorilla', category: 'east-africa', country: 'Uganda', countryCode: 'UG', flag: '🇺🇬', destination: 'Bwindi Gorilla Trek', days: 6, pricePerPerson: 2199, description: 'Life-changing 1-hour encounter with wild mountain gorillas in lush Bwindi Impenetrable Forest.', inclusions: ['Gorilla trekking permit ($700 value)', 'Experienced gorilla tracker', 'Rainforest lodge (FB)', 'Transfer from Kampala', 'Forest hikes', 'Batwa pygmy cultural tour'], highlights: ['Mountain gorilla family encounter', 'Bwindi rainforest hikes', 'Batwa community visit', 'Tea plantation tours'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance', 'medical'], packageImage: 'photorealistic lush green Bwindi Impenetrable Forest in Uganda, mountain gorilla family in natural habitat, misty jungle canopy, cinematic lighting' },
    { id: 'ea-rwanda-gorilla', category: 'east-africa', country: 'Rwanda', countryCode: 'RW', flag: '🇷🇼', destination: 'Volcanoes Gorilla Trek', days: 5, pricePerPerson: 2499, description: 'Luxury gorilla trekking in the land of a thousand hills, with premium eco-lodges and cultural immersion.', inclusions: ['Gorilla permit ($1500 value)', 'Luxury eco-lodge stay', 'Private guide & vehicle', 'Genocide memorial tour', 'Kigali city tour', 'Iby\'iwacu cultural village'], highlights: ['Dian Fossey legacy', 'Golden monkey trek optional', 'Kigali culture & food', 'Nyungwe forest canopy walk'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance', 'medical'], packageImage: 'photorealistic volcanic mountains of Rwanda, misty terraced hills, luxury eco-lodge, mountain gorilla close-up, thousand hills panoramic view' },
    { id: 'ea-zanzibar-beach', category: 'east-africa', country: 'Tanzania', countryCode: 'TZ', flag: '🏝️', destination: 'Zanzibar Beach Holiday', days: 7, pricePerPerson: 1399, description: 'Powder-white beaches, turquoise Indian Ocean, Stone Town UNESCO site, and spice farm tours.', inclusions: ['Beach resort bungalow (HB)', 'Stone Town walking tour', 'Spice farm visit', 'Prison Island day trip', 'Snorkeling & dhow cruise', 'Private transfers'], highlights: ['Nungwi & Kendwa beaches', 'UNESCO Stone Town', 'Dolphin watching', 'Traditional dhow sunset cruise'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance'], packageImage: 'photorealistic Zanzibar beach paradise scene, turquoise clear water, white sand beach, thatched roof beach bungalows, palm trees, sunset, dhows sailing in distance' },
    { id: 'ea-mombasa-coast', category: 'east-africa', country: 'Kenya', countryCode: 'KE', flag: '🌴', destination: 'Mombasa Coastal Getaway', days: 5, pricePerPerson: 899, description: 'Diani beach bliss, ancient Mombasa Old Town, snorkeling in Wasini Island marine reserves.', inclusions: ['Beach resort (HB)', 'Mombasa Old Town tour', 'Wasini Island snorkeling', 'Fort Jesus visit', 'Swahili dinner show', 'Airport transfers'], highlights: ['Diani Beach watersports', 'Haller Park wildlife', 'Swahili & Arab heritage', 'Coral reef snorkeling'], requirements: ['passport', 'photos', 'itineraryDetails', 'travelInsurance'], packageImage: 'photorealistic Diani Beach Mombasa Kenya, palm-fringed white sand beach, coral reef clear turquoise water, Swahili style thatched resort, sunset golden light' }
  ]
};

(function fillInferredRequirements() {
  const pkg = window.PACKAGES_DATA;
  pkg.workVisas.forEach(w => {
    if (!w.requirements.includes('sponsorshipLetter') && (w.countryCode === 'DE' || w.countryCode === 'CZ' || w.countryCode === 'PT' || w.countryCode === 'EE' || w.countryCode === 'SK' || w.countryCode === 'PL')) {
      w.requirements.push('sponsorshipLetter');
    }
  });
  pkg.studyVisas.forEach(s => {
    if (s._blockedAccountNote && !s.requirements.includes('proofOfFunds')) {
      s.requirements.push('proofOfFunds');
    }
  });
})();

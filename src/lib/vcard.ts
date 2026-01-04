// Milo's contact information - update these values
export const MILO_CONTACT = {
  firstName: 'Milo',
  lastName: '',
  fullName: 'Milo',
  phone: '+1234567890', // Update with real phone number
  email: 'milo@example.com', // Update with real email
  organization: '',
  title: '',
  note: 'Added via Milo\'s onboarding portal',
};

export const generateVCard = (): string => {
  const { firstName, lastName, fullName, phone, email, organization, title, note } = MILO_CONTACT;
  
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${fullName}`,
    `N:${lastName};${firstName};;;`,
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    email ? `EMAIL:${email}` : '',
    organization ? `ORG:${organization}` : '',
    title ? `TITLE:${title}` : '',
    note ? `NOTE:${note}` : '',
    'END:VCARD',
  ].filter(Boolean).join('\n');

  return vcard;
};

export const downloadVCard = (): void => {
  const vcard = generateVCard();
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${MILO_CONTACT.fullName.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// iMessage deep link - update with real phone number
export const IMESSAGE_LINK = `sms:${MILO_CONTACT.phone}`;

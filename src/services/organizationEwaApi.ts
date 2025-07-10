
export interface OrganizationEwaSettings {
  slabs: {
    fees: number;
    maxAmount: number;
    minAmount: number;
  }[];
  claimable_percentage: string;
  maximum_wage_limit: number;
  min_experience: number;
  ewa_enabled: boolean;
  withdraw_limit: number;
}

export const fetchOrganizationEwaSettings = async (
  phoneNumber: string,
  userAccessToken: string
): Promise<OrganizationEwaSettings> => {
  const apiUrl = 'https://asia-southeast1-shomvob-employer-web-cbbf3.cloudfunctions.net/employerAPIService/employer/api/v2/wagely/settings';
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q';

  // Ensure phone number format (keep leading 0 for local format)
  const formattedPhoneNumber = phoneNumber.startsWith('880') 
    ? '0' + phoneNumber.slice(3) 
    : phoneNumber;
  
  const url = `${apiUrl}?PhoneNumber=${formattedPhoneNumber}&user_access_token=${userAccessToken}`;

  console.log('Fetching organization EWA settings from:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });

    console.log('Organization EWA settings response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Organization EWA settings response:', responseData);

    // The API returns an object with error field and data nested inside
    if (responseData && responseData.error === 0 && responseData.data) {
      return responseData.data;
    }

    throw new Error('Invalid response format from server');
  } catch (error: any) {
    console.error('Error fetching organization EWA settings:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error('Failed to fetch organization EWA settings. Please try again.');
  }
};

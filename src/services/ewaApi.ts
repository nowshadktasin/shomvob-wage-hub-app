
export interface EwaRequestResponse {
  error: number;
  data?: {
    requested_amount: number;
    service_charge: number;
    total_amount: number;
    status: string;
    requested_month: number;
    requested_year: number;
    updated_at: string;
  };
  msg?: string;
}

export const submitEwaRequest = async (phoneNumber: string, userAccessToken: string, requestedAmount: number, rowId: string): Promise<EwaRequestResponse['data']> => {
  const apiUrl = 'https://asia-southeast1-shomvob-employer-web-cbbf3.cloudfunctions.net/employerAPIService/employer/api/v2/wagely/employees/ewa-request';
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q';

  // Ensure phone number has country code
  const formattedPhoneNumber = phoneNumber.startsWith('880') ? phoneNumber : `880${phoneNumber.replace(/^0/, '')}`;
  
  const url = `${apiUrl}?phoneNumber=${formattedPhoneNumber}&user_access_token=${userAccessToken}&rowId=${rowId}`;

  console.log('Submitting EWA request to:', url);
  console.log('Request payload:', { requestedAmount });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestedAmount: requestedAmount
      }),
    });

    console.log('Response status:', response.status);

    const responseData: EwaRequestResponse = await response.json();
    console.log('EWA request response:', responseData);

    // Handle different error scenarios based on API response
    if (responseData.error !== 0) {
      const errorMessage = responseData.msg || 'Unknown error occurred';
      
      // Check for specific error conditions and throw appropriate messages
      if (errorMessage.toLowerCase().includes('pending')) {
        throw new Error(errorMessage);
      } else if (errorMessage.toLowerCase().includes('limit') || errorMessage.toLowerCase().includes('exceed')) {
        throw new Error('You have exceeded your monthly withdrawal limit. Please try again next month.');
      } else if (errorMessage.toLowerCase().includes('function') && errorMessage.toLowerCase().includes('not found')) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      } else {
        throw new Error(errorMessage);
      }
    }

    if (!responseData.data) {
      throw new Error('Invalid response format from server');
    }

    return responseData.data;
  } catch (error: any) {
    console.error('Error submitting EWA request:', error);
    
    // If it's already our custom error, re-throw it
    if (error.message && (
      error.message.includes('pending') || 
      error.message.includes('limit') ||
      error.message.includes('Service temporarily')
    )) {
      throw error;
    }
    
    // For network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error('Failed to submit withdrawal request. Please try again.');
  }
};

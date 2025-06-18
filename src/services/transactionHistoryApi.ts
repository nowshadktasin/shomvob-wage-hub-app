
export interface TransactionHistoryResponse {
  error: number;
  data: Array<{
    total_amount: number;
    requested_amount: number;
    service_charge: number;
    status: string;
    requested_month: number;
    requested_year: number;
    updated_at: string;
  }>;
}

export const fetchTransactionHistory = async (phoneNumber: string, userAccessToken: string): Promise<TransactionHistoryResponse['data']> => {
  const apiUrl = 'https://asia-southeast1-shomvob-employer-web-cbbf3.cloudfunctions.net/employerAPIService/employer/api/v2/wagely/employees/user-ewa-request-history';
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q';

  // Ensure phone number has country code
  const formattedPhoneNumber = phoneNumber.startsWith('880') ? phoneNumber : `880${phoneNumber.replace(/^0/, '')}`;
  
  const url = `${apiUrl}?user_access_token=${userAccessToken}&phoneNumber=${formattedPhoneNumber}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: TransactionHistoryResponse = await response.json();
    console.log('Transaction history response:', responseData);

    if (responseData.error !== 0) {
      throw new Error('Invalid response format or error in API response');
    }

    return responseData.data;
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
};

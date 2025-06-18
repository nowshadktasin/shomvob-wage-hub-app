
export interface EarnedWagesResponse {
  error: number;
  data: {
    is_enabled: boolean;
    total_earnings_completed: number;
    earnings_completed_percentage: number;
    min_wages: number;
    service_charge_percentage: number;
    claimable_wages: number;
    claimable_wages_percentage: number;
    next_salary_date: string;
    failed_reason: string | null;
  };
}

export const fetchEarnedWages = async (phoneNumber: string, userAccessToken: string): Promise<EarnedWagesResponse['data']> => {
  const apiUrl = 'https://asia-southeast1-shomvob-employer-web-cbbf3.cloudfunctions.net/employerAPIService/employer/api/v2/wagely/employees/earned-wage';
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q';

  // Ensure phone number has country code
  const formattedPhoneNumber = phoneNumber.split("88")[1];
  
  const url = `${apiUrl}?phoneNumber=${formattedPhoneNumber}&user_access_token=${userAccessToken}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData: EarnedWagesResponse = await response.json();
    console.log('Earned wages data:', responseData);

    if (responseData.error !== 0) {
      throw new Error('Invalid response format or error in API response');
    }

    return responseData.data;
  } catch (error) {
    console.error('Error fetching earned wages:', error);
    throw error;
  }
};


export interface EmployeeProfileResponse {
  error: number;
  data: Array<{
    full_name: string;
    department: string;
    designation: string;
    contact_number: string;
    gross_salary: number;
    joining_date: string;
    company_name: string;
    email: string;
    present_address: string;
    permanent_address: string;
    gender: string;
  }>;
}

export const fetchEmployeeProfile = async (phoneNumber: string, userAccessToken: string): Promise<any> => {
  const apiUrl = 'https://asia-southeast1-shomvob-employer-web-cbbf3.cloudfunctions.net/employerAPIService/employer/api/v2/wagely/employee/details';

  // Format phone number - ensure it has the country code
  const formattedPhone = phoneNumber.startsWith('88') ? phoneNumber : `88${phoneNumber}`;
  
  const url = `${apiUrl}?phoneNumber=${formattedPhone}&user_access_token=${userAccessToken}`;

  console.log('Fetching employee profile with:', {
    phoneNumber: formattedPhone,
    tokenLength: userAccessToken?.length,
    url: url
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error - Status: ${response.status}, Response: ${errorText}`);
      
      if (response.status === 403) {
        throw new Error('Access denied - Please check your authentication credentials');
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const responseData: EmployeeProfileResponse = await response.json();
    console.log('Employee profile API response:', responseData);

    if (responseData.error !== 0 || !responseData.data || responseData.data.length === 0) {
      console.error('Invalid API response format:', responseData);
      throw new Error('Invalid response format or no data found');
    }

    const data = responseData.data[0]; // Get the first employee record

    // Map the API response to our UserData interface
    const mappedData = {
      id: `user-${formattedPhone}`,
      full_name: data.full_name || 'User',
      email: data.email || `${formattedPhone}@shomvob.com`,
      contact_number: data.contact_number || formattedPhone,
      designation: data.designation || 'Employee',
      department: data.department || 'General',
      joining_date: data.joining_date || new Date().toISOString().split('T')[0],
      company_name: data.company_name || 'Emission Softwares',
      gross_salary: data.gross_salary || 50000,
      present_address: data.present_address || '',
      permanent_address: data.permanent_address || '',
      gender: data.gender || 'Male',
      avatar: '',
      isProfileComplete: true,
      availableAdvancePercentage: 60,
      user_role: 'employee',
    };

    console.log('Mapped employee data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};


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
  const authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlNob212b2JUZWNoQVBJVXNlciIsImlhdCI6MTY1OTg5NTcwOH0.IOdKen62ye0N9WljM_cj3Xffmjs3dXUqoJRZ_1ezd4Q';

  const url = `${apiUrl}?phoneNumber=${phoneNumber}&user_access_token=${userAccessToken}`;

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

    const responseData: EmployeeProfileResponse = await response.json();
    console.log('Employee profile data:', responseData);

    if (responseData.error !== 0 || !responseData.data || responseData.data.length === 0) {
      throw new Error('Invalid response format or no data found');
    }

    const data = responseData.data[0]; // Get the first employee record

    // Map the API response to our UserData interface
    return {
      id: `user-${phoneNumber}`,
      full_name: data.full_name || 'User',
      email: data.email || `${phoneNumber}@shomvob.com`,
      contact_number: data.contact_number || phoneNumber,
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
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};

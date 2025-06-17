
export interface EmployeeProfileResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  joinDate: string;
  avatar?: string;
  isProfileComplete: boolean;
  monthlySalary: number;
  availableAdvancePercentage: number;
  user_role?: string;
}

export const fetchEmployeeProfile = async (phoneNumber: string, userAccessToken: string): Promise<EmployeeProfileResponse> => {
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

    const data = await response.json();
    console.log('Employee profile data:', data);

    // Map the API response to our UserData interface
    return {
      id: data.id || `user-${phoneNumber}`,
      name: data.name || data.fullName || 'User',
      email: data.email || `${phoneNumber}@shomvob.com`,
      phone: data.phone || phoneNumber,
      position: data.position || data.designation || 'Employee',
      department: data.department || 'General',
      joinDate: data.joinDate || data.joiningDate || new Date().toISOString().split('T')[0],
      avatar: data.avatar || data.profilePicture || '',
      isProfileComplete: data.isProfileComplete || false,
      monthlySalary: data.monthlySalary || data.salary || 50000,
      availableAdvancePercentage: data.availableAdvancePercentage || 60,
      user_role: data.user_role || data.role || 'employee',
    };
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    throw error;
  }
};

const API_BASE_URL = 'http://localhost:8087/api/v1';

const packageAgentApi = {
    getPackageIds: async (agentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/auth/package_agent/getPackageIds/${agentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch package IDs');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching package IDs:', error);
            throw error;
        }
    },

    viewPackage: async (packageId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/package/user/viewpackage?packageId=${packageId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch package details');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching package details:', error);
            throw error;
        }
    },

    viewPackageBookings: async (packageId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/hotel/package_agent/booking/byPackageId/${packageId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 404) {
                return [];
            }

            if (!response.ok) {
                throw new Error('Failed to fetch package bookings');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching package bookings:', error);
            throw error;
        }
    },

    addPackage: async (packageData) => {
        try {
            console.log('Adding package with data:', packageData); 
            const agentId = localStorage.getItem('userId');// Debugging line
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/package/travel_agent/addpackage/${agentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(packageData)
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData.message || 'Failed to add package');
            }

            return await response.text();
        } catch (error) {
            console.error('Error adding package:', error);
            throw error;
        }
    },

    getAgentSupportTickets: async (agentId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/support/agent/support-tickets/${agentId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch support tickets');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching support tickets:', error);
            throw error;
        }
    },
};

export default packageAgentApi;
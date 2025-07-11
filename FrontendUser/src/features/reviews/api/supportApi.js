const API_BASE_URL = 'http://localhost:8087/api/v1/support';
 
const supportApi = {
  submitSupportTicket: async (bookingId, issueText, userId) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Submitting support ticket with data:', {
        bookingId,
        issueText,
        userId 
      });
 
      const response = await fetch(`${API_BASE_URL}/user/support-tickets/${bookingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          issue: issueText,
        }),
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Support ticket submission failed:', errorText);
        throw new Error(`Failed to submit support ticket: ${errorText}`);
      }

      const result = await response.json();
      console.log('Support ticket submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting support ticket:', error.message);
      throw error;
    }
  },
 
  getMyTickets: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
 
      const response = await fetch(`${API_BASE_URL}/user/my-tickets/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch support tickets: ${errorText}`);
      }
 
      return await response.json();
    } catch (error) {
      console.error('Error fetching support tickets:', error.message);
      throw error;
    }
  },
 
  getTicketDetails: async (ticketId) => {
    try {
      const token = localStorage.getItem('authToken');
 
      const response = await fetch(`${API_BASE_URL}/both/support-tickets/${ticketId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        throw new Error('Failed to fetch ticket details');
      }
 
      return await response.json();
    } catch (error) {
      console.error('Error fetching ticket details:', error.message);
      throw error;
    }
  },
  
  updateTicketByAgent: async (ticketId, status, agentResponse) => {
    try {
      const token = localStorage.getItem('authToken');
 
      const response = await fetch(`${API_BASE_URL}/agent/support-tickets/${ticketId}?status=${status}&agentResponse=${encodeURIComponent(agentResponse)}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update support ticket: ${errorText}`);
      }
 
      return await response.json();
    } catch (error) {
      console.error('Error updating support ticket:', error.message);
      throw error;
    }
  }

};
 
export default supportApi;

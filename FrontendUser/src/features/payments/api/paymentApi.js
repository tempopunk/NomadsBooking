const API_BASE_URL = 'http://localhost:8087/api/v1/payments';
const API_BASE_URL1 = 'http://localhost:8087/api/v1/invoices';

const paymentApi = {
  getMyPayments: async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/mypayments/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 404) {
        return []; // Return empty array for no bookings
      }

      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  generateInvoice: async (paymentId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL1}/user/generate?paymentId=${paymentId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw error;
    }
  },

  downloadInvoice: async (invoiceNumber) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL1}/user/${invoiceNumber}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  },

  finalizeCardPayment: async (paymentId, cardDetails) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/${paymentId}/finalize/card`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardDetails)
      });

      if (!response.ok) {
        throw new Error('Card payment finalization failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error finalizing card payment:', error);
      throw error;
    }
  },

  finalizeUpiPayment: async (paymentId, upiDetails) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/${paymentId}/finalize/upi`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upiDetails)
      });

      if (!response.ok) {
        throw new Error('UPI payment finalization failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error finalizing UPI payment:', error);
      throw error;
    }
  },

  finalizeNetBankingPayment: async (paymentId, bankingDetails) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/user/${paymentId}/finalize/netbanking`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankingDetails)
      });

      if (!response.ok) {
        throw new Error('Net Banking payment finalization failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error finalizing Net Banking payment:', error);
      throw error;
    }
  }
};

export default paymentApi;
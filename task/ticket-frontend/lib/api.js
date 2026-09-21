import api from "./axios";

// ==================== AUTH APIs ====================

export const loginUser = (data) => {
  return api.post("/user/login", data);
};

export const signupUser = (data) => {
  return api.post("/user/signup", data);
};

export const googleLogin = (data) => {
  return api.post("/user/google", data);
};


// ==================== CUSTOMER TICKET APIs ====================

export const createTicket = (data) => {
  return api.post("/tickets", data);
};

export const getMyTickets = (
  page = 1,
  limit = 5,
  search = ""
) => {
  return api.get(
    `/tickets/my?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
};

export const getTicketById = (ticketId) => {
  return api.get(`/tickets/${ticketId}`);
};


// ==================== ADMIN TICKET APIs ====================

export const getAllTickets = (
  page = 1,
  limit = 5,
  search = ""
) => {
  return api.get(
    `/tickets?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
  );
};

export const updateTicketStatus = (ticketId, status) => {
  return api.patch(
    `/tickets/${ticketId}/status`,
    {
      status,
    }
  );
};



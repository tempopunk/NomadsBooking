package com.nomad.service.interfaces;

import java.util.List;

import com.nomad.dto.SupportTicketRequestDTO;
import com.nomad.dto.SupportTicketResponseDTO;
import com.nomad.enums.TicketStatus;

public interface SupportTicketService {
    SupportTicketResponseDTO submitSupportTicket(int bookingId,SupportTicketRequestDTO requestDTO); 
    SupportTicketResponseDTO trackSupportTicket(Long ticketId); 
    List<SupportTicketResponseDTO> getAllSupportTickets(); 
    SupportTicketResponseDTO updateTicketByAgent(Long ticketId, TicketStatus status, String agentResponse);
    List<SupportTicketResponseDTO> getAgentSupportTickets(Long assignedAgentId);
    public List<SupportTicketResponseDTO> getUserSupportTickets(Long userId);
    
    }


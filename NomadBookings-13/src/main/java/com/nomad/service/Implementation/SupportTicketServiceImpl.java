package com.nomad.service.Implementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.nomad.Repository.SupportTicketRepository;
import com.nomad.dto.BookingResourceDto;
import com.nomad.dto.SupportTicketRequestDTO;
import com.nomad.dto.SupportTicketResponseDTO;
import com.nomad.enums.TicketStatus;
import com.nomad.exception.SupportTicketNotFoundException;
import com.nomad.model.SupportTicket;
import com.nomad.service.interfaces.HotelFeignProxy;
import com.nomad.service.interfaces.SupportTicketService;
import com.nomad.service.interfaces.UserFeignProxy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SupportTicketServiceImpl implements SupportTicketService {

    private final SupportTicketRepository supportTicketRepository;
    private final UserFeignProxy template;
    private final HotelFeignProxy template1;

    @Override
    public SupportTicketResponseDTO submitSupportTicket(int bookingId,SupportTicketRequestDTO requestDTO) {
        SupportTicket ticket = new SupportTicket();
        ticket.setUserId(requestDTO.getUserId());
        ticket.setIssue(requestDTO.getIssue());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setBookingId(bookingId);
        // Default status on submission
        
        
        //template.getid()
        BookingResourceDto bookingResourceDto = template1.getentityId(bookingId);
        System.out.println(bookingId);
        System.out.println(bookingResourceDto.getType());
        System.out.println(bookingResourceDto.getId());
        
        int id;
        
        if(bookingResourceDto.getType().equals("HOTEL")) {
        	id =template.gethotelagent(bookingResourceDto.getId());
        }
        else if(bookingResourceDto.getType().equals("FLIGHT")) {
        	id =template.getflightagent(bookingResourceDto.getId());
        }
        else {
        	id =template.getpackageagent(bookingResourceDto.getId());
        }
        
        ticket.setAssignedAgentId(id);

        SupportTicket savedTicket = supportTicketRepository.save(ticket);
        log.info("Support ticket submitted successfully with ID: {}", savedTicket.getTicketId());

        return new SupportTicketResponseDTO(
                savedTicket.getTicketId(),
                savedTicket.getUserId(),
                savedTicket.getIssue(),
                savedTicket.getStatus(),
                savedTicket.getAssignedAgentId(),
                null  ,
                savedTicket.getBookingId(),
                savedTicket.getCreatedAt()
        );
    }

    @Override
    public SupportTicketResponseDTO trackSupportTicket(Long ticketId) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> {
                    log.error("Support ticket not found with ID: {}", ticketId);
                    return new SupportTicketNotFoundException("Support ticket not found with ID: " + ticketId);
                });

        return new SupportTicketResponseDTO(
                ticket.getTicketId(),
                ticket.getUserId(),
                ticket.getIssue(),
                ticket.getStatus(),
                ticket.getAssignedAgentId(),
                ticket.getAgentResponse(),
                ticket.getBookingId(),
                ticket.getCreatedAt()
        );
    }

    @Override
    public List<SupportTicketResponseDTO> getAllSupportTickets() {
        List<SupportTicket> tickets = supportTicketRepository.findAll();
        log.info("Fetched {} support tickets from the database", tickets.size());

        List<SupportTicketResponseDTO> ticketDTOs = new ArrayList<>();
        for (SupportTicket ticket : tickets) {
            ticketDTOs.add(new SupportTicketResponseDTO(
                    ticket.getTicketId(),
                    ticket.getUserId(),
                    ticket.getIssue(),
                    ticket.getStatus(),
                    ticket.getAssignedAgentId(),
                    ticket.getAgentResponse(),
                    ticket.getBookingId(),
                    ticket.getCreatedAt()
            ));
        }
        return ticketDTOs;
    }

    @Override
    public SupportTicketResponseDTO updateTicketByAgent(Long ticketId, TicketStatus status, String agentResponse) {
        SupportTicket ticket = supportTicketRepository.findById(ticketId)
                .orElseThrow(() -> new SupportTicketNotFoundException("Support ticket not found with ID: " + ticketId));

        ticket.setStatus(status); // ✅ Assign status from request parameter
        ticket.setAgentResponse(agentResponse); // ✅ Assign agent response from request parameter

        SupportTicket updatedTicket = supportTicketRepository.save(ticket);

        return new SupportTicketResponseDTO(
                updatedTicket.getTicketId(),
                updatedTicket.getUserId(),
                updatedTicket.getIssue(),
                updatedTicket.getStatus(),
                updatedTicket.getAssignedAgentId(),
                updatedTicket.getAgentResponse(),
                ticket.getBookingId(),
                ticket.getCreatedAt()
        );
    }

    @Override
    public List<SupportTicketResponseDTO> getAgentSupportTickets(Long assignedAgentId) {
        List<SupportTicket> tickets = supportTicketRepository.findByAssignedAgentId(assignedAgentId);

        List<SupportTicketResponseDTO> ticketDTOs = new ArrayList<>();
        for (SupportTicket ticket : tickets) {
            ticketDTOs.add(new SupportTicketResponseDTO(
                    ticket.getTicketId(),
                    ticket.getUserId(),
                    ticket.getIssue(),
                    ticket.getStatus(),
                    ticket.getAssignedAgentId(),
                    ticket.getAgentResponse(),
                    ticket.getBookingId(),
                    ticket.getCreatedAt()
            ));
        }
        return ticketDTOs;
    }
    
    @Override
    public List<SupportTicketResponseDTO> getUserSupportTickets(Long userId) {
        List<SupportTicket> tickets = supportTicketRepository.findByUserId(userId);
        List<SupportTicketResponseDTO> ticketDTOs = new ArrayList<>();
 
        for (SupportTicket ticket : tickets) {
            ticketDTOs.add(new SupportTicketResponseDTO(
                ticket.getTicketId(),
                ticket.getUserId(),
                ticket.getIssue(),
                ticket.getStatus(),
                ticket.getAssignedAgentId(),
                ticket.getAgentResponse(),
                ticket.getBookingId(),
                ticket.getCreatedAt()
            ));
        }
 
        log.info("Fetched {} support tickets for user ID: {}", ticketDTOs.size(), userId);
        return ticketDTOs;
    }

	
}

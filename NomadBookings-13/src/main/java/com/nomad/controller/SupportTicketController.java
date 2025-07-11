package com.nomad.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nomad.dto.SupportTicketRequestDTO;
import com.nomad.dto.SupportTicketResponseDTO;
import com.nomad.enums.TicketStatus;
import com.nomad.service.interfaces.SupportTicketService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/support")
@RequiredArgsConstructor
public class SupportTicketController {
    private final SupportTicketService supportTicketService;

    @PostMapping("/user/support-tickets/{bookingId}")
    public ResponseEntity<SupportTicketResponseDTO> submitSupportTicket(@PathVariable int bookingId ,@RequestBody SupportTicketRequestDTO requestDTO) {
        return ResponseEntity.ok(supportTicketService.submitSupportTicket(bookingId,requestDTO));
    }

    @GetMapping("/both/support-tickets/{ticketId}")
    public ResponseEntity<SupportTicketResponseDTO> trackSupportTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(supportTicketService.trackSupportTicket(ticketId));
    }

    @GetMapping("/admin/support-tickets")
    public ResponseEntity<List<SupportTicketResponseDTO>> getAllSupportTickets() {
        return ResponseEntity.ok(supportTicketService.getAllSupportTickets());
    }
    @PutMapping("/agent/support-tickets/{ticketId}")
    public ResponseEntity<SupportTicketResponseDTO> updateTicketByAgent(
            @PathVariable Long ticketId,
            @RequestParam TicketStatus status,
            @RequestParam String agentResponse) { 
        return ResponseEntity.ok(supportTicketService.updateTicketByAgent(ticketId, status, agentResponse));
    }
    @GetMapping("/agent/support-tickets/{agentId}")
    public ResponseEntity<List<SupportTicketResponseDTO>> getAgentSupportTickets(@PathVariable Long agentId) {
        return ResponseEntity.ok(supportTicketService.getAgentSupportTickets(agentId));
    }
    
    @GetMapping("/user/my-tickets/{userId}")
    public ResponseEntity<List<SupportTicketResponseDTO>> getUserSupportTickets(@PathVariable Long userId) {
        List<SupportTicketResponseDTO> userTickets = supportTicketService.getUserSupportTickets(userId);
        return ResponseEntity.ok(userTickets);
    }



}

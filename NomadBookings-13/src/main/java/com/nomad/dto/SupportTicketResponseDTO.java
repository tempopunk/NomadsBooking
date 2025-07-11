package com.nomad.dto;

import java.time.LocalDateTime;

import com.nomad.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketResponseDTO {
    private Long ticketId;
    private Long userId;
    private String issue;
    private TicketStatus status;
    private int assignedAgentId;
    private String agentResponse;
    private int bookingId;
    private LocalDateTime createdDate;
}

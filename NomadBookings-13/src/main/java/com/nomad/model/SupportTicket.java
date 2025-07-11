package com.nomad.model;

import com.nomad.enums.TicketStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "support_tickets")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "ticketId", callSuper = false)
public class SupportTicket extends AuditableBaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;

    private Long userId;
    private String issue;
    
    private int bookingId;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private int assignedAgentId;
    private String agentResponse; 
}

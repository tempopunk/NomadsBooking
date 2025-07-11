package com.nomad.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nomad.model.SupportTicket;

@Repository
public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
	 List<SupportTicket> findByAssignedAgentId(Long assignedAgentId);
	 List<SupportTicket> findByUserId(Long userId);
}

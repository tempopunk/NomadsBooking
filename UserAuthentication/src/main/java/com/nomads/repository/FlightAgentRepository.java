package com.nomads.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.FlightAgent;

public interface FlightAgentRepository extends JpaRepository<FlightAgent, Integer> {
	
//	public FlightAgent findByAgentId(int agentId);
	Optional<FlightAgent> findFirstByFlightId(int flightId);
	
	List<FlightAgent> findByAgentId(int agentId);

}

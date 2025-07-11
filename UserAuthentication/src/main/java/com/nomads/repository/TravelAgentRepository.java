package com.nomads.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.TravelAgent;



public interface TravelAgentRepository extends JpaRepository<TravelAgent, Integer> {
	public Optional<TravelAgent> findFirstByPackageId(int travelId);
	
	public List<TravelAgent> findByAgentId(int agentId);

}

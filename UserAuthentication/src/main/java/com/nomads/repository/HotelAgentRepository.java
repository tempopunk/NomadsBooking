package com.nomads.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.HotelAgent;



public interface HotelAgentRepository extends JpaRepository<HotelAgent, Integer> {
	
	HotelAgent findByHotelId(int hotelId);
	HotelAgent findByAgentId(int agentId);

}

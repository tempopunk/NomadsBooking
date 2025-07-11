package com.nomads.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.Agents;


public interface AgentRepository extends JpaRepository<Agents, Integer> {
	Agents findByEmail(String email);

}

package com.nomads.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
public class FlightAgent extends AuditableBaseEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	public FlightAgent(int agentId, int flightId) {
		super();
		this.agentId = agentId;
		this.flightId = flightId;
	}

	private int agentId;
	
	private int flightId;

}

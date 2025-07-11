package com.nomads.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Getter
@Setter
public class HotelAgent extends AuditableBaseEntity {
	
	public HotelAgent(Agents agent, int hotelId) {
		super();
		this.agent = agent;
		this.hotelId = hotelId;
	}


	@Id
	private int agentId;
	
	@OneToOne
	@MapsId
	@JoinColumn(name = "agent_id")
	private Agents agent;
	
	

	
	private int hotelId;

}

package com.nomads.entity;



import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Table(name="travel_agent")
@NoArgsConstructor
@Entity
@Getter
@Setter
public class TravelAgent extends AuditableBaseEntity{
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	
	public TravelAgent(int agentId, int packageId) {
		super();
		this.agentId = agentId;
		this.packageId = packageId;
	}

	private int agentId;
	
	private int packageId;
}

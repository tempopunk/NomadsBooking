package com.nomads.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Agents extends AuditableBaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "agent_id")
	private int agentId;
	private String name;
	private String email;
	private String passwordHash;
	private String agentType;
	
	@ManyToOne
	@JoinColumn(name ="role_id")
	private Roles role;
	@Column(name = "company_name")
	private String companyName;
	private String address;
	private String phoneNumber;
	
	@OneToOne(mappedBy = "agent", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private HotelAgent hotelAgent;

   


	
	public Agents(String name, String email, String passwordHash, String agentType, Roles role, String companyName,
			String address, String phoneNumber) {
		super();
		this.name = name;
		this.email = email;
		this.passwordHash = passwordHash;
		this.agentType = agentType;
		this.role = role;
		this.companyName = companyName;
		this.address = address;
		this.phoneNumber = phoneNumber;
	}

}

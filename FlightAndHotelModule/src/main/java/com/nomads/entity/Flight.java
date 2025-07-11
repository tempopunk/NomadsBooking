package com.nomads.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Flight extends AuditableBaseEntity {
	
	public Flight(String companyName, String origin, String destination,LocalDate departureDate, LocalDateTime departureTime, LocalDateTime arrivalTime,
			Double price) {
		super();
		this.companyName = companyName;
		this.origin = origin;
		this.destination = destination;
		this.departureDate = departureDate;
		this.departureTime = departureTime;
		this.arrivalTime = arrivalTime;
		this.price = price;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="flight_id")
	private int flightId;
	
	private String companyName;
	
	private String origin;
	
	private String destination;
	
	private LocalDate departureDate;
	
	private LocalDateTime departureTime;
	
	private LocalDateTime arrivalTime;
	
	private Double price;

	@OneToMany(mappedBy = "flight", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
    private List<Booking> bookings = new ArrayList<>();
	

}

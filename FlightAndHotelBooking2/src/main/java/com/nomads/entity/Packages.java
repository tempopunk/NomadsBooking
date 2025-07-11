package com.nomads.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Packages {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="package_id")
	private int packageId;

	private String origin;

	private String destination;

	
    private int hotelId;

    
    private int roomId;

    private int numberOfDays; 

    private LocalDate departureDate;

    private Double price;
    
    private int departureFlightId;
    
    private int returnFlightId;
    
    @ElementCollection
    @CollectionTable(name = "package_itinerary", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "itinerary_entry")
    private List<String> itineraryNotes = new ArrayList<>();

	public Packages(String origin, String destination, int hotelId, int roomId,int departureFlightId,int returnFlightId, int numberOfDays, 
			LocalDate departureDate, Double price, List<String> itineraryNotes) {
		super();
		this.origin = origin;
		this.destination = destination;
		this.hotelId = hotelId;
		this.roomId = roomId;
		this.departureFlightId = departureFlightId;
		this.returnFlightId = returnFlightId;
		this.numberOfDays = numberOfDays; 
		this.departureDate = departureDate;
		this.price = price;
		this.itineraryNotes = itineraryNotes;
	}
}
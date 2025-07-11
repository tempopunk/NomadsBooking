package com.nomads.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nomads.dto.StringListConverter;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Room extends AuditableBaseEntity{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int roomId;
	private String roomName;
	
	private String roomType;
	private int maxOccupancy;
	private double pricePerNight;
	private String foodOption;
	@Column(columnDefinition = "json")
    @Convert(converter = StringListConverter.class)
    private List<String> ammenities;
	
	
	@ManyToOne(fetch = FetchType.LAZY) // Use LAZY fetch to avoid loading entire hotel for every room
    @JoinColumn(name = "hotel_id", nullable = false) 
	@JsonIgnore
    private Hotel hotel;  // Each room belongs to one hotel

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	@JsonIgnore
    private List<Booking> bookings;  
	
	
	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore // Prevent infinite recursion when serializing Room
    private List<RoomImage> images; // List of RoomImage entities
    
    
	public Room(String roomName,String roomType, int maxOccupancy, double pricePerNight, String foodOption, List<String> ammenities,
			Hotel hotel) {
		super();
		this.roomName = roomName;
		this.roomType = roomType;
		this.maxOccupancy = maxOccupancy;
		this.pricePerNight = pricePerNight;
		this.foodOption = foodOption;
		this.ammenities = ammenities;
		this.hotel = hotel;
	}
	
//	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
//    @JsonIgnore
//    private List<Packages> packages;  // One-to-Many relationship

}

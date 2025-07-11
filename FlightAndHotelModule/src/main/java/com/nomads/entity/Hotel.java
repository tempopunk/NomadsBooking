package com.nomads.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
public class Hotel extends AuditableBaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="hotel_id")
	private int hotelId;
	private String hotelName;
	public Hotel(String name, String location, String type, Double lowerCost, Double upperCost, Double costRange,
			boolean is_deleted) {
		super();
		this.hotelName = name;
		this.location = location;
		this.type = type;
		this.lowerCost = lowerCost;
		this.upperCost = upperCost;
		this.costRange = costRange;
		this.is_deleted = is_deleted;
	}

	private String location;
	private String type;
	
	private Double lowerCost;
	private Double upperCost;
	private Double costRange;
	private boolean is_deleted;
	
	
//	@OneToOne(fetch = FetchType.LAZY) // Use LAZY fetch for performance
//    @JoinColumn(name = "agent_id", unique = true)
//    private HotelAgent hotelAgent;  // One-to-One relationship

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Booking> bookings;  // One-to-Many relationship
    
	@OneToMany(mappedBy="hotel",cascade=CascadeType.ALL,orphanRemoval = true, fetch = FetchType.EAGER)
	
	private List<Room> rooms;
	
	@OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnore // Important to prevent infinite recursion when serializing
    private List<HotelImage> images; // A hotel can have multiple images

//	@OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL,fetch = FetchType.LAZY)
//    @JsonIgnore
//    private List<Packages> packages;  // One-to-Many relationship

}

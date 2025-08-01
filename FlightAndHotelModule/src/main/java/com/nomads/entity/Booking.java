package com.nomads.entity;

import java.time.LocalDate;

import com.nomads.entity.enums.BookingStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Booking extends AuditableBaseEntity {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
	
	
    private int userId;
	
	private String bookingType;
	
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="hotel_id")
   
    private Hotel hotel;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="room_id")
   
    private Room room;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "flight_id") 
    
    private Flight flight;
    
    @Column(nullable=true)
    private int packageId;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, PAID, etc. [cite: 3, 5]
    
    private LocalDate bookingDate;
    public Booking(int userId, Hotel hotel, Room room,String bookingType, BookingStatus status, LocalDate bookingDate,
			double totalAmount) {
		super();
		this.userId = userId;
		this.hotel = hotel;
		this.room = room;
		this.status = status;
		this.bookingType=bookingType;
		this.bookingDate = bookingDate;
		this.totalAmount = totalAmount;
	}
	private double totalAmount;
	
	public Booking(int userId, String bookingType, Flight flight, BookingStatus status, LocalDate bookingDate, double totalAmount) {
		super();
		this.userId = userId;
		this.bookingType = bookingType;
		this.flight = flight;
		this.status = status;
		this.bookingDate = bookingDate;
		this.totalAmount = totalAmount;
	}

	public Booking(int userId, String bookingType, int packageId, BookingStatus status, LocalDate bookingDate,
			double totalAmount) {
		super();
		this.userId = userId;
		this.bookingType = bookingType;
		this.packageId = packageId;
		this.status = status;
		this.bookingDate = bookingDate;
		this.totalAmount = totalAmount;
	}
	
	
	

}

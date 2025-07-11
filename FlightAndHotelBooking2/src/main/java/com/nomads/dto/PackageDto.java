package com.nomads.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class PackageDto {
	@NotBlank(message = "Origin is required")
    private String origin;
	@NotBlank(message = "Destination is required")
	private String destination;

	@NotNull(message = "Number of Days is required") 
	@Min(value = 1, message = "Number of Days must be at least 1")
    private int numberOfDays; 

	@JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate departureDate;

	@NotNull(message = "Enter Price ")
    private Double price;

	@NotBlank(message = "Enter Hotel id ")
    private String hotelName;
	@NotBlank(message = "Enter room id ")
	
    private String roomName;
	
	private int departureFlightId;
	
	private int returnFlightId;
	
	private List<String> itineraryNotes;
}
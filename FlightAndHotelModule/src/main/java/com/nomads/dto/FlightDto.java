package com.nomads.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FlightDto {
	
	@NotBlank(message="company name shouldnt be blank")
    private String companyName;
	@NotBlank(message="origin should not be blank")
	private String origin;
	@NotBlank(message="destination shouldnt be blank")
	private String destination;
	@NotBlank(message="departure  time  shouldnt be blank")
	private LocalDate departureDate;
	@NotBlank(message="departure  time  shouldnt be blank")
	private LocalDateTime departureTime;
	@NotBlank(message="arrival name shouldnt be blank")
	private LocalDateTime arrivalTime;
	@NotBlank(message="price shouldnt be blank")
	private Double price;

}

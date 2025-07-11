package com.nomads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HotelDto {
	
	@NotBlank(message = "name shouldnt be blank")
	private String name;
	@NotBlank(message="location shouldnt be blank")
	private String location;
	@NotBlank(message="type shouldnt be blank")
	private String type;
	@NotNull(message="lowercost shouldnt be blank")
	private Double lowerCost;
	@NotNull(message="uppercost shouldnt be blank")
	private Double upperCost;
	@NotBlank(message="costrange shouldnt be blank")
	private Double costRange;
	
	

}

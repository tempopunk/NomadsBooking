package com.nomads.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RoomDto {
	
	@NotBlank(message="roomName shouldnt be blank")
	private String roomName;
	@NotBlank(message = "roomType shouldnt be blank")
	private String roomType;
	@NotNull(message = "maxOccupancy shouldnt be blank")
	private int maxOccupancy;
	@NotNull(message = "pricePerNight shouldnt be blank")
	private double pricePerNight;
	@NotBlank(message = "foodOption shouldnt be blank")
	private String foodOption;
	@NotNull(message = "ammenities list must not be null")
    @Size(min = 1, message = "ammenities list must contain at least one item")
    private List<@NotBlank(message = "Individual amenity must not be blank") String> ammenities;

}

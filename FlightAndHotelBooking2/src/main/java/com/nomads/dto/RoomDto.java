package com.nomads.dto;

import lombok.Data;

@Data
public class RoomDto {
	private String roomType;
	private int maxOccupancy;
	private double pricePerNight;
	private String foodOption;
	private String ammenities;

}

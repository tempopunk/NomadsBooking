package com.nomads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreatePackageBookingDto {
	
	
	int packageId;
	int userId;
	double price;
	String status;

}

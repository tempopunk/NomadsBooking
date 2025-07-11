package com.nomads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePackageBookingDto {
	
	int packageId;
	int userId;
	double price;
	String status;

}

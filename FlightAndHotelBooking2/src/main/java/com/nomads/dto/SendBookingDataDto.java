package com.nomads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SendBookingDataDto {
	
	private Long bookingId;
	private Double amount;

}

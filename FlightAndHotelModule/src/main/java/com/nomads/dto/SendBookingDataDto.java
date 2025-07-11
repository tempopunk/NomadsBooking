package com.nomads.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SendBookingDataDto {
	
	private Long bookingId;
	private Double amount;

}

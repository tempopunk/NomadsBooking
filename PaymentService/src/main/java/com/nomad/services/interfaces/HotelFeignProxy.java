package com.nomad.services.interfaces;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.nomad.model.enums.BookingStatus;

@FeignClient(name="FlightAndHotelBooking")
public interface HotelFeignProxy {
	
	@PostMapping("api/v1/hotel/micro/fandh/updatebooking1/{bookingId}/{status}")
	public boolean updateBooking(@PathVariable Long bookingId,@PathVariable BookingStatus status);

}

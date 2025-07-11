package com.nomad.service.interfaces;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.nomad.dto.BookingResourceDto;

@FeignClient(name="FlightAndHotelBooking")
public interface HotelFeignProxy {
	@GetMapping("api/v1/hotel/micro/getid/{bookingId}")
	public BookingResourceDto getentityId(@PathVariable int bookingId);

}

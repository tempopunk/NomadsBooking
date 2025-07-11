package com.nomads.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.nomads.dto.CreatePackageBookingDto;
import com.nomads.dto.SendBookingDataDto;

@FeignClient(name="FlightAndHotelBooking")
public interface PackageFeignProxy {
	
	@GetMapping("api/v1/hotel/micro/fandh/hotelname/{hotelName}")
	public int getHotelId(@PathVariable String hotelName);
	
	@GetMapping("api/v1/hotel/micro/fandh/roomname/{roomName}")
	public int getRoomId(@PathVariable String roomName);
	
	@PostMapping("api/v1/hotel/micro/fandh/createbooking")
	public SendBookingDataDto createPackageBooking(@RequestBody CreatePackageBookingDto createPackageBookingDto );

}

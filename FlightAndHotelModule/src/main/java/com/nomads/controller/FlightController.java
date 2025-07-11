package com.nomads.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nomads.dto.FlightDto;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.entity.Booking;
import com.nomads.entity.Flight;
import com.nomads.service.FlightService;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/flight")
@RequiredArgsConstructor
@Tag(name="Flight Management",description="Crud for flight management")
public class FlightController {
	 
	private final FlightService flightService;
	
	@GetMapping("/user/flight/search")
	public ResponseEntity<List<Flight>> getFlightsByLocation( @RequestParam String origin,@RequestParam String destination, @RequestParam LocalDate departureDate){
		return ResponseEntity.ok(flightService.searchByLocation(origin,destination,departureDate));
		 
	}
	
	@GetMapping("/user/flight/ascending")
	public ResponseEntity<List<Flight>> sortByAscend(@RequestParam String origin,@RequestParam String destination,@RequestParam LocalDate departureDate){
		return ResponseEntity.ok(flightService.sortByAscend(origin,destination,departureDate));
	}
	
	@GetMapping("user/flight/descending")
	public ResponseEntity<List<Flight>> sortByDescend(@RequestParam String origin,@RequestParam String destination,@RequestParam LocalDate departureDate){
		return ResponseEntity.ok(flightService.sortByDescend(origin,destination,departureDate));
	}
	
	@GetMapping("user/flight/viewflight")
	public ResponseEntity<Flight> viewFlight(@RequestParam int flightId){
		return ResponseEntity.ok(flightService.viewFlight(flightId));
	}
	
	@GetMapping("both/flight/viewflight")
	public ResponseEntity<Flight> viewFlight1(@RequestParam int flightId){
		return ResponseEntity.ok(flightService.viewFlight(flightId));
	}
	
	
	
	@PostMapping("user/flight/checkout")
	public ResponseEntity<PaymentResponseDTO> checkOut(@RequestParam int userId,@RequestParam int flightId){
		return ResponseEntity.ok(flightService.checkOut(userId,flightId));
	}
	
	@PostMapping("flight_agent/addflight/{agentId}")
	public ResponseEntity<String> addFlight(@PathVariable int agentId, @RequestBody FlightDto flightDto) {
		return ResponseEntity.ok(flightService.addFlight(agentId, flightDto));
	}
	

	@DeleteMapping("flight_agent/deleteflight")
	public String removeFlight(@RequestParam int flightId) {
		return flightService.deleteFlight(flightId);
	}
	
	@GetMapping("flight_agent/booking/byFlightId/{flightId}")
    public ResponseEntity<List<Booking>> viewFlightBooking(@PathVariable int flightId){
    	List<Booking> booking = flightService.viewFlightBooking(flightId);
    	if(booking.isEmpty()) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    	}
    	return ResponseEntity.ok(booking);
    }

	

}

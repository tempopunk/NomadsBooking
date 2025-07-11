package com.nomads.service;



import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.nomads.dto.FlightDto;
import com.nomads.dto.PaymentInitiationRequestDTO;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.entity.Booking;
import com.nomads.entity.Flight;
import com.nomads.entity.enums.BookingStatus;
import com.nomads.exception.FlightsNotFoundException;
import com.nomads.exception.ResourceNotFoundException;
import com.nomads.repository.BookingRepository;
import com.nomads.repository.FlightRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class FlightService {
	
	
	private final BookingRepository bookingRepository;
	
    private final FlightRepository flightRepository;
    
    private final AuthFeignProxy authFeignProxy;
    
    private final PaymentFeignProxy paymentFeignProxy;
	
	public List<Flight> searchByLocation(String origin,String destination, LocalDate departureDate){
		List<Flight> flights = flightRepository.findByOriginAndDestinationAndDepartureDate(origin, destination, departureDate);
		if(flights.isEmpty()) {
			log.info("no flights found for the given details");
			throw new FlightsNotFoundException("no flights found for the given details");
		}
		log.info("the flights are fetched succesfully");
		return flights;
				
	}
	public List<Flight> sortByAscend(String origin,String destination,LocalDate departureDate){
		List<Flight> flights = flightRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceAsc(origin, destination,departureDate);
		if(flights.isEmpty()) {
			log.info("no flights found for the given details");
			throw new FlightsNotFoundException("no flights found for the given details");
		}
		log.info("the flights are fetched succesfully in increasing cost");
		return flights;
	}
	public List<Flight> sortByDescend(String origin,String destination,LocalDate departureDate){
		List<Flight> flights = flightRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceDesc(origin, destination, departureDate);
		if(flights.isEmpty()) {
			log.info("no flights found for the given details");
			throw new FlightsNotFoundException("no flights found for the given details");
		}
		log.info("the flights are fetched succesfully in decreasing cost");
		return flights;
	}
	public Flight viewFlight(int flightId){
		return flightRepository.findById(flightId)
				.orElseThrow(() -> new ResourceNotFoundException("Flight not found with ID: " + flightId));
		
	}
	public PaymentResponseDTO checkOut(int userId,int flightId) {
		
		Flight flight = null;
		
		
		Optional<Flight> flights = flightRepository.findById(flightId);
		if(flights.isPresent()) {
			flight  = flights.get();
		}
		
		
		Booking booking = new Booking(userId,"FLIGHT",flight,BookingStatus.PENDING,LocalDate.now(),flight.getPrice());
		try {
			
			bookingRepository.save(booking);
		}
		catch(IllegalArgumentException e) {
			log.info("an error ocurred when saving the booking");
			throw new IllegalArgumentException("Error creating  the booking");
		}
		log.info("the booking has been created successfully");
		
         PaymentInitiationRequestDTO paymentInitiationRequestDTO = new PaymentInitiationRequestDTO(booking.getBookingId(),userId,booking.getTotalAmount());
		
		ResponseEntity<PaymentResponseDTO> responseEntity = paymentFeignProxy.initiatePayment(paymentInitiationRequestDTO);
		return responseEntity.getBody();
	
	}
	public String addFlight(int agentId,FlightDto flightDto) {
		Flight flight = new Flight(flightDto.getCompanyName(),flightDto.getOrigin(),flightDto.getDestination(),flightDto.getDepartureDate(),flightDto.getDepartureTime(),flightDto.getArrivalTime(),flightDto.getPrice());
		
		try {
			flight = flightRepository.save(flight);
			
		}
		catch(IllegalArgumentException e) {
			throw new IllegalArgumentException("Error adding the flight");
		}
		authFeignProxy.linkId("Flight", agentId, flight.getFlightId());

		log.info("the flight is added succesfully");
		return "flight added successfully";
	}

	public String deleteFlight(int packageId){
		
		
		
		flightRepository.deleteById(packageId);
		
		return "flight deleted succesfully";
	}
	
	public List<Booking> viewFlightBooking(int flightId) {
		return  bookingRepository.findByFlight_FlightId(flightId);
		
	}

}

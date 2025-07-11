package com.nomads.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nomads.entity.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {
	List<Flight> findByOriginAndDestinationAndDepartureDate(String origin,String destination, LocalDate departureTime);
	List<Flight> findByOriginAndDestinationAndDepartureDateOrderByPriceAsc(String origin, String destination,LocalDate departureTime);
	List<Flight> findByOriginAndDestinationAndDepartureDateOrderByPriceDesc(String origin, String destination,LocalDate departureTime);

}

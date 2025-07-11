package com.nomads.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.Packages;

public interface PackageRepository extends JpaRepository<Packages,Integer>{
	
	List<Packages> findByOriginAndDestinationAndDepartureDate(String origin, String destination, LocalDate departureDate);
	List<Packages> findByOriginAndDestinationAndDepartureDateOrderByPriceAsc(String origin, String destination,LocalDate departureDate);
	List<Packages> findByOriginAndDestinationAndDepartureDateOrderByPriceDesc(String origin, String destination, LocalDate departureDate);
}

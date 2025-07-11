package com.nomads.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.Hotel;

public interface HotelRepository extends JpaRepository<Hotel, Integer> {
	
	List<Hotel> findByLocation(String location);
	List<Hotel> findByLocationOrderByCostRangeAsc(String location);
	List<Hotel> findByLocationOrderByCostRangeDesc(String location);
	Optional<Hotel> findByHotelName(String hotelName);

}

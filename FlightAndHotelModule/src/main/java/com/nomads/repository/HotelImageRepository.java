package com.nomads.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.HotelImage;

public interface HotelImageRepository extends JpaRepository<HotelImage, Long> {

}

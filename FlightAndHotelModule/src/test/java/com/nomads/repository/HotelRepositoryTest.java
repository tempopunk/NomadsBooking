package com.nomads.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.nomads.entity.Hotel;

@ExtendWith(SpringExtension.class)
@DataJpaTest
class HotelRepositoryTest {

    @Autowired
    private HotelRepository hotelRepository;

    @Test
    void testFindByLocation() {
        // Arrange
        Hotel hotel = new Hotel();
        hotel.setHotelName("Grand Hyatt");
        hotel.setLocation("New York");
        hotel.setType("Luxury");
        hotel.setLowerCost(150.0);
        hotel.setUpperCost(500.0);
        hotel.setCostRange(350.0);
        hotelRepository.save(hotel);

        // Act
        List<Hotel> hotels = hotelRepository.findByLocation("New York");

        // Assert
        assertFalse(hotels.isEmpty());
        assertEquals("Grand Hyatt", hotels.get(0).getHotelName());
    }
}
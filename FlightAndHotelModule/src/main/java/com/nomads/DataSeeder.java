package com.nomads;



import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.nomads.entity.Flight;
import com.nomads.entity.Hotel;
import com.nomads.entity.Room;
import com.nomads.repository.FlightRepository;
import com.nomads.repository.HotelRepository;
import com.nomads.repository.RoomRepository;
import com.nomads.service.AuthFeignProxy;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner  {
	
	
	
	
    private  final HotelRepository hotelRepository;
    
    private final FlightRepository flightRepository;
	
    private final RoomRepository roomRepository;
	
    private final AuthFeignProxy authFeignProxy;
	 
    

    @Override
    @Transactional // Ensures all operations are atomic
    public void run(String... args) throws Exception {
        log.info("Starting Hotel Module Seed Data generation...");
        Hotel hotel1 = new Hotel();
        
        if(hotelRepository.count()==0) {
        	
        	
            hotel1.setHotelName("Grand Hyatt Regency");
            hotel1.setLocation("chennai");
            hotel1.setType("Luxury");
            hotel1.setLowerCost(150.0);
            hotel1.setUpperCost(500.0);
            hotel1.setCostRange(350.0);
            hotel1.set_deleted(false);
            hotel1 = hotelRepository.save(hotel1);
            authFeignProxy.linkId("Hotel", 1, hotel1.getHotelId());
            
          
            Room room1 = new Room("101","Standard Queen", 2, 180.0, "Breakfast Included",  List.of("Wi-Fi", "AC", "Mini Bar", "Balcony"), hotel1);
            Room room2 = new Room("102","Deluxe King", 2, 250.0, "Breakfast & Dinner", List.of("WiFi, AC, TV, Minibar"), hotel1);
            Room room3 = new Room("103","Executive Suite", 4, 450.0, "All Inclusive", List.of("WiFi, AC, TV, Minibar, Lounge Access"), hotel1);
            roomRepository.saveAll(Arrays.asList(room1, room2, room3));
            
        }
        

        
        if(flightRepository.count()==0) {
        	
        	Flight flight = new Flight();
            flight.setCompanyName("Boeing");
            flight.setOrigin("Vizag");
            flight.setDestination("Chennai");
            flight.setDepartureDate(LocalDate.now());
            flight.setDepartureTime(LocalDateTime.now());
            flight.setArrivalTime(LocalDateTime.now());
            flight.setPrice(3300.29);
            flight = flightRepository.save(flight);
            authFeignProxy.linkId("Flight", 2, flight.getFlightId());
            
            Flight flight1 = new Flight();
            flight1.setCompanyName("AirIndia");
            flight1.setOrigin("Chennai");
            flight1.setDestination("Vizag");
            flight1.setDepartureDate(LocalDate.now());
            flight1.setDepartureTime(LocalDateTime.now());
            flight1.setArrivalTime(LocalDateTime.now());
            flight1.setPrice(3100.29);
            flight1 = flightRepository.save(flight1);
            authFeignProxy.linkId("Flight", 2, flight1.getFlightId());
            

           
        	
        }
        
        
        
        log.info("Seed Data generation completed");
        
        
        
    }
}
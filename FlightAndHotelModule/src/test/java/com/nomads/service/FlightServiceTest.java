package com.nomads.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

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

class FlightServiceTest {

    @Mock
    private FlightRepository flightRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private AuthFeignProxy authFeignProxy;

    @Mock
    private PaymentFeignProxy paymentFeignProxy;

    @InjectMocks
    private FlightService flightService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchByLocation() {
        LocalDate departureDate = LocalDate.of(2025, 6, 24);
        when(flightRepository.findByOriginAndDestinationAndDepartureDate("NYC", "LAX", departureDate))
                .thenReturn(Arrays.asList(new Flight(), new Flight()));

        var flights = flightService.searchByLocation("NYC", "LAX", departureDate);

        assertEquals(2, flights.size());
        verify(flightRepository, times(1)).findByOriginAndDestinationAndDepartureDate("NYC", "LAX", departureDate);
    }

    @Test
    void testSearchByLocationThrowsException() {
        LocalDate departureDate = LocalDate.of(2025, 6, 24);
        when(flightRepository.findByOriginAndDestinationAndDepartureDate("NYC", "LAX", departureDate))
                .thenReturn(Arrays.asList());

        assertThrows(FlightsNotFoundException.class, () -> flightService.searchByLocation("NYC", "LAX", departureDate));
    }

    @Test
    void testSortByAscend() {
        LocalDate departureDate = LocalDate.of(2025, 6, 24);
        when(flightRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceAsc("NYC", "LAX", departureDate))
                .thenReturn(Arrays.asList(new Flight(), new Flight()));

        var flights = flightService.sortByAscend("NYC", "LAX", departureDate);

        assertEquals(2, flights.size());
        verify(flightRepository, times(1)).findByOriginAndDestinationAndDepartureDateOrderByPriceAsc("NYC", "LAX", departureDate);
    }

    @Test
    void testSortByDescend() {
        LocalDate departureDate = LocalDate.of(2025, 6, 24);
        when(flightRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceDesc("NYC", "LAX", departureDate))
                .thenReturn(Arrays.asList(new Flight(), new Flight()));

        var flights = flightService.sortByDescend("NYC", "LAX", departureDate);

        assertEquals(2, flights.size());
        verify(flightRepository, times(1)).findByOriginAndDestinationAndDepartureDateOrderByPriceDesc("NYC", "LAX", departureDate);
    }

    @Test
    void testViewFlight() {
        Flight flight = new Flight();
        when(flightRepository.findById(1)).thenReturn(Optional.of(flight));

        var result = flightService.viewFlight(1);

        assertNotNull(result);
        verify(flightRepository, times(1)).findById(1);
    }

    @Test
    void testViewFlightThrowsException() {
        when(flightRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> flightService.viewFlight(1));
    }

    @Test
    void testCheckOut() {
        Flight flight = new Flight();
        flight.setPrice(100.0);
        when(flightRepository.findById(1)).thenReturn(Optional.of(flight));
        when(paymentFeignProxy.initiatePayment(any(PaymentInitiationRequestDTO.class)))
                .thenReturn(ResponseEntity.ok(new PaymentResponseDTO()));

        var response = flightService.checkOut(1, 1);

        assertNotNull(response);
        verify(bookingRepository, times(1)).save(any(Booking.class));
        verify(paymentFeignProxy, times(1)).initiatePayment(any(PaymentInitiationRequestDTO.class));
    }

    @Test
    void testAddFlight() {
        FlightDto flightDto = new FlightDto();
        flightDto.setCompanyName("Airline");
        flightDto.setOrigin("NYC");
        flightDto.setDestination("LAX");
        flightDto.setDepartureDate(LocalDate.of(2025, 6, 24));
        flightDto.setPrice(100.0);

        Flight flight = new Flight();
        flight.setFlightId(1);
        when(flightRepository.save(any(Flight.class))).thenReturn(flight);

        var result = flightService.addFlight(1, flightDto);

        assertEquals("flight added successfully", result);
        verify(authFeignProxy, times(1)).linkId("Flight", 1, flight.getFlightId());
    }

    @Test
    void testDeleteFlight() {
        doNothing().when(flightRepository).deleteById(1);

        var result = flightService.deleteFlight(1);

        assertEquals("flight deleted succesfully", result);
        verify(flightRepository, times(1)).deleteById(1);
    }
}
package com.nomads.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.nomads.dto.FlightDto;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.entity.Flight;
import com.nomads.service.FlightService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

class FlightControllerTest {

    private MockMvc mockMvc;

    @Mock
    private FlightService flightService;

    @InjectMocks
    private FlightController flightController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(flightController).build();
    }

    @Test
    void testGetFlightsByLocation() throws Exception {
        List<Flight> flights = Arrays.asList(new Flight(), new Flight());
        when(flightService.searchByLocation("NYC", "LAX", LocalDate.of(2025, 6, 24)))
                .thenReturn(flights);

        mockMvc.perform(get("/api/v1/flight/user/flight/search")
                .param("origin", "NYC")
                .param("destination", "LAX")
                .param("departureDate", "2025-06-24"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testSortByAscend() throws Exception {
        List<Flight> flights = Arrays.asList(new Flight(), new Flight());
        when(flightService.sortByAscend("NYC", "LAX", LocalDate.of(2025, 6, 24)))
                .thenReturn(flights);

        mockMvc.perform(get("/api/v1/flight/user/flight/ascending")
                .param("origin", "NYC")
                .param("destination", "LAX")
                .param("departureDate", "2025-06-24"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testSortByDescend() throws Exception {
        List<Flight> flights = Arrays.asList(new Flight(), new Flight());
        when(flightService.sortByDescend("NYC", "LAX", LocalDate.of(2025, 6, 24)))
                .thenReturn(flights);

        mockMvc.perform(get("/api/v1/flight/user/flight/descending")
                .param("origin", "NYC")
                .param("destination", "LAX")
                .param("departureDate", "2025-06-24"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testViewFlight() throws Exception {
        Flight flight = new Flight();
        when(flightService.viewFlight(1)).thenReturn(flight);

        mockMvc.perform(get("/api/v1/flight/user/flight/viewflight")
                .param("flightId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testCheckOut() throws Exception {
        PaymentResponseDTO response = new PaymentResponseDTO();
        when(flightService.checkOut(1, 1)).thenReturn(response);

        mockMvc.perform(post("/api/v1/flight/user/flight/checkout")
                .param("userId", "1")
                .param("flightId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddFlight() throws Exception {
        FlightDto flightDto = new FlightDto();
        when(flightService.addFlight(1, flightDto)).thenReturn("Flight added successfully");

        mockMvc.perform(post("/api/v1/flight/flight_agent/addflight/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Flight added successfully"));
    }

    @Test
    void testRemoveFlight() throws Exception {
        when(flightService.deleteFlight(1)).thenReturn("Flight deleted successfully");

        mockMvc.perform(delete("/api/v1/flight/flight_agent/deleteflight")
                .param("flightId", "1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Flight deleted successfully"));
    }
}

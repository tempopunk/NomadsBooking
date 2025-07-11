package com.nomads.controller;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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

import com.nomads.dto.BookingResourceDto;
import com.nomads.dto.CreatePackageBookingDto;
import com.nomads.dto.HotelDto;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.dto.RoomDto;
import com.nomads.dto.SendBookingDataDto;
import com.nomads.entity.Hotel;
import com.nomads.entity.Room;
import com.nomads.entity.enums.BookingStatus;
import com.nomads.service.HotelService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

class HotelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HotelService hotelService;

    @InjectMocks
    private HotelController hotelController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(hotelController).build();
    }

    @Test
    void testGetEntityId() throws Exception {
        BookingResourceDto bookingResourceDto = new BookingResourceDto();
        when(hotelService.getentityId(1)).thenReturn(bookingResourceDto);

        mockMvc.perform(get("/api/v1/hotel/micro/getid/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetHotelId() throws Exception {
        when(hotelService.getHotelId("HotelName")).thenReturn(1);

        mockMvc.perform(get("/api/v1/hotel/micro/fandh/hotelname/HotelName"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void testGetRoomId() throws Exception {
        when(hotelService.getRoomId("RoomName")).thenReturn(1);

        mockMvc.perform(get("/api/v1/hotel/micro/fandh/roomname/RoomName"))
                .andExpect(status().isOk())
                .andExpect(content().string("1"));
    }

    @Test
    void testCreatePackageBooking() throws Exception {
        CreatePackageBookingDto createPackageBookingDto = new CreatePackageBookingDto();
        SendBookingDataDto sendBookingDataDto = new SendBookingDataDto();
        when(hotelService.createPackageBooking(createPackageBookingDto)).thenReturn(sendBookingDataDto);

        mockMvc.perform(post("/api/v1/hotel/micro/fandh/createbooking")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateBooking() throws Exception {
        when(hotelService.updateBooking(1L, BookingStatus.CONFIRMED)).thenReturn(true);

        mockMvc.perform(post("/api/v1/hotel/micro/fandh/updatebooking1/1/CONFIRMED"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    @Test
    void testGetHotelsByLocation() throws Exception {
        List<Hotel> hotels = Arrays.asList(new Hotel(), new Hotel());
        when(hotelService.searchByLocation("NYC")).thenReturn(hotels);

        mockMvc.perform(get("/api/v1/hotel/user/hotel/search")
                .param("location", "NYC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetHotelsById() throws Exception {
        Hotel hotel = new Hotel();
        when(hotelService.searchById(1)).thenReturn(hotel);

        mockMvc.perform(get("/api/v1/hotel/user/hotel/id")
                .param("id", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testSortByAscend() throws Exception {
        List<Hotel> hotels = Arrays.asList(new Hotel(), new Hotel());
        when(hotelService.sortByAscend("NYC")).thenReturn(hotels);

        mockMvc.perform(get("/api/v1/hotel/user/hotel/ascending")
                .param("location", "NYC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testSortByDescend() throws Exception {
        List<Hotel> hotels = Arrays.asList(new Hotel(), new Hotel());
        when(hotelService.sortByDescend("NYC")).thenReturn(hotels);

        mockMvc.perform(get("/api/v1/hotel/user/hotel/descending")
                .param("location", "NYC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testViewRooms() throws Exception {
        List<Room> rooms = Arrays.asList(new Room(), new Room());
        when(hotelService.viewRooms(1)).thenReturn(rooms);

        mockMvc.perform(get("/api/v1/hotel/user/hotel/viewrooms")
                .param("hotelId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testCheckOut() throws Exception {
        PaymentResponseDTO response = new PaymentResponseDTO();
        when(hotelService.checkOut(1, 1, 1)).thenReturn(response);

        mockMvc.perform(post("/api/v1/hotel/user/hotel/checkout")
                .param("userId", "1")
                .param("hotelId", "1")
                .param("roomId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddRoom() throws Exception {
        RoomDto roomDto = new RoomDto();
        when(hotelService.addRoom(1, roomDto)).thenReturn("Room added successfully");

        mockMvc.perform(post("/api/v1/hotel/hotel_agent/hotel/addroom")
                .param("hotelId", "1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Room added successfully"));
    }

    @Test
    void testAddHotel() throws Exception {
        HotelDto hotelDto = new HotelDto();
        when(hotelService.addHotel(1, hotelDto)).thenReturn("Hotel added successfully");

        mockMvc.perform(post("/api/v1/hotel/hotel_agent/hotel/addhotel/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hotel added successfully"));
    }

   
}
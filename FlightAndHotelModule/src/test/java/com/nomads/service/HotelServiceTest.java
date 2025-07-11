package com.nomads.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.nomads.entity.Hotel;
import com.nomads.entity.Room;
import com.nomads.exception.HotelsNotFoundException;
import com.nomads.exception.ResourceNotFoundException;
import com.nomads.repository.BookingRepository;
import com.nomads.repository.HotelImageRepository;
import com.nomads.repository.HotelRepository;
import com.nomads.repository.RoomImageRepository;
import com.nomads.repository.RoomRepository;

class HotelServiceTest {

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private HotelImageRepository hotelImageRepository;

    @Mock
    private RoomImageRepository roomImageRepository;

    @Mock
    private AuthFeignProxy authFeignProxy;

    @Mock
    private PaymentFeignProxy paymentFeignProxy;

    @InjectMocks
    private HotelService hotelService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSearchByLocation() {
        when(hotelRepository.findByLocation("NYC")).thenReturn(Arrays.asList(new Hotel(), new Hotel()));

        var hotels = hotelService.searchByLocation("NYC");

        assertEquals(2, hotels.size());
        verify(hotelRepository, times(1)).findByLocation("NYC");
    }

    @Test
    void testSearchByLocationThrowsException() {
        when(hotelRepository.findByLocation("NYC")).thenReturn(Arrays.asList());

        assertThrows(HotelsNotFoundException.class, () -> hotelService.searchByLocation("NYC"));
    }

    @Test
    void testSearchById() {
        Hotel hotel = new Hotel();
        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));

        var result = hotelService.searchById(1);

        assertNotNull(result);
        verify(hotelRepository, times(1)).findById(1);
    }

    @Test
    void testSearchByIdThrowsException() {
        when(hotelRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> hotelService.searchById(1));
    }

    @Test
    void testSortByAscend() {
        when(hotelRepository.findByLocationOrderByCostRangeAsc("NYC")).thenReturn(Arrays.asList(new Hotel(), new Hotel()));

        var hotels = hotelService.sortByAscend("NYC");

        assertEquals(2, hotels.size());
        verify(hotelRepository, times(1)).findByLocationOrderByCostRangeAsc("NYC");
    }

    @Test
    void testSortByDescend() {
        when(hotelRepository.findByLocationOrderByCostRangeDesc("NYC")).thenReturn(Arrays.asList(new Hotel(), new Hotel()));

        var hotels = hotelService.sortByDescend("NYC");

        assertEquals(2, hotels.size());
        verify(hotelRepository, times(1)).findByLocationOrderByCostRangeDesc("NYC");
    }

    @Test
    void testViewRooms() {
        Hotel hotel = new Hotel();
        hotel.setRooms(Arrays.asList(new Room(), new Room()));
        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));

        var rooms = hotelService.viewRooms(1);

        assertEquals(2, rooms.size());
        verify(hotelRepository, times(1)).findById(1);
    }

    @Test
    void testViewRoomsThrowsException() {
        Hotel hotel = new Hotel();
        hotel.setRooms(Arrays.asList());
        when(hotelRepository.findById(1)).thenReturn(Optional.of(hotel));

        assertThrows(ResourceNotFoundException.class, () -> hotelService.viewRooms(1));
    }

//    
    

   
}
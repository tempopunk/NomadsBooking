//package com.nomads.repository;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//import java.util.Optional;
//
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//
//import com.nomads.entity.Room;
//
//@ExtendWith(SpringExtension.class)
//@DataJpaTest
//class RoomRepositoryTest {
//
//    @Autowired
//    private RoomRepository roomRepository;
//
//    @Test
//    void testFindByRoomName() {
//        // Arrange
//        Room room = new Room();
//        room.setHotel(null);
//        room.setRoomName("Deluxe King");
//        room.setRoomType("Luxury");
//        room.setMaxOccupancy(2);
//        room.setPricePerNight(250.0);
//        roomRepository.save(room);
//
//        // Act
//        Optional<Room> foundRoom = roomRepository.findByRoomName("Deluxe King");
//
//        // Assert
//        assertTrue(foundRoom.isPresent());
//        assertEquals("Deluxe King", foundRoom.get().getRoomName());
//    }
//}
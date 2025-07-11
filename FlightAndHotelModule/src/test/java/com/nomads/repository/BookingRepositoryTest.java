package com.nomads.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDate;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.nomads.entity.Booking;
import com.nomads.entity.enums.BookingStatus;

@ExtendWith(SpringExtension.class)
@DataJpaTest
class BookingRepositoryTest {

    @Autowired
    private BookingRepository bookingRepository;

    @Test
    void testFindByBookingId() {
        // Arrange
        Booking booking = new Booking();
        booking.setUserId(1);
        booking.setBookingType("Hotel");
        booking.setStatus(BookingStatus.PENDING);
        booking.setBookingDate(LocalDate.now());
        booking.setTotalAmount(200.0);
        booking = bookingRepository.save(booking);

        // Act
        Optional<Booking> foundBooking = bookingRepository.findByBookingId(booking.getBookingId());

        // Assert
        assertTrue(foundBooking.isPresent());
        assertEquals(booking.getBookingId(), foundBooking.get().getBookingId());
    }
}
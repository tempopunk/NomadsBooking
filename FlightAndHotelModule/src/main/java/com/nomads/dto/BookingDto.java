package com.nomads.dto;



import com.nomads.entity.Hotel;
import com.nomads.entity.Room;
import com.nomads.entity.enums.BookingStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class BookingDto {
    private int user_id;
    private Hotel hotel;
    private Room room;// Optional [cite: 3]
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, PAID, etc. [cite: 3, 5]

    
    private Double totalAmount;

}

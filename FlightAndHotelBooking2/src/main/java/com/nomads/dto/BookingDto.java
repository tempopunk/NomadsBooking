package com.nomads.dto;




import com.nomads.entity.enums.BookingStatus;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class BookingDto {
    
    
    @Enumerated(EnumType.STRING)
    private BookingStatus status; // PENDING, CONFIRMED, PAID, etc. [cite: 3, 5]

    
    private Double totalAmount;

}

package com.nomad.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponseDTO {
    private Long reviewId;
    private Long userId;
    private Long hotelId;
    private Long flightId;
    private Long packageId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}

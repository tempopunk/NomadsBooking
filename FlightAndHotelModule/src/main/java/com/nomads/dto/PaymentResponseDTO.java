package com.nomads.dto;

import lombok.Data;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long bookingId;
    private Integer userId;
    private Double amount;
     
}
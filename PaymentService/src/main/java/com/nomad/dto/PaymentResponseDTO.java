package com.nomad.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.nomad.model.enums.PaymentStatus;

import lombok.Data;

@Data
public class PaymentResponseDTO {
    private Long paymentId;
    private Long bookingId;
    private Integer userId;
    private Double amount;
    
}
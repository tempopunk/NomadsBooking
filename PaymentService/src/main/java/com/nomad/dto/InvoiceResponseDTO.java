package com.nomad.dto;

import java.math.BigDecimal;
import java.time.Instant;

import lombok.Data;

@Data
public class InvoiceResponseDTO {
    private Long invoiceId;
    private String invoiceNumber;
    private Long bookingId;
    private Integer userId;
    private Long paymentId;
    private Instant invoiceDate;
    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal netAmount;
    private String invoicePdfUrl;
    private String message;
}

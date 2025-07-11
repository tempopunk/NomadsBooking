package com.nomads.dto;



import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentInitiationRequestDTO {
    @NotNull(message = "Booking ID is required")
    @Positive(message = "Booking ID must be positive")
    private Long bookingId;

    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be positive")
    private int userId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private double amount;

//    @NotNull(message = "Payment method is required")
//    private PaymentMethod paymentMethod;
}

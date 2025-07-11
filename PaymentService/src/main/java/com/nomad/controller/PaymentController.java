package com.nomad.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nomad.dto.CardFinalizationRequestDTO;
import com.nomad.dto.NetBankingFinalizationRequestDTO;
import com.nomad.dto.PaymentInitiationRequestDTO;
import com.nomad.dto.PaymentResponseDTO;
import com.nomad.dto.UpiFinalizationRequestDTO;
import com.nomad.model.Payment;
import com.nomad.services.interfaces.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Endpoint to initiate a payment. This creates a PENDING payment record
     * and returns a payment ID. No sensitive details are passed here.
     * @param initiationRequestDTO DTO containing basic payment details (bookingId, userId, amount, paymentMethod).
     * @return PaymentResponseDTO with the paymentId and PENDING status.
     */
    @PostMapping("micro/initiate")
    public ResponseEntity<PaymentResponseDTO> initiatePayment(@Valid @RequestBody PaymentInitiationRequestDTO initiationRequestDTO) {
        log.info("Received request to initiate payment for booking ID: {} ",
                initiationRequestDTO.getBookingId());
        PaymentResponseDTO responseDTO = paymentService.initiatePayment(initiationRequestDTO);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED); // 201 Created
    }

    /**
     * Endpoint to finalize a payment using Credit/Debit Card details.
     * Expects only card-specific details in the request body.
     * @param paymentId The ID of the initiated payment to finalize (from path).
     * @param request DTO containing payment ID (in body, for consistency check) and card details.
     * @return PaymentResponseDTO with the final payment status.
     */
    @PutMapping("user/{paymentId}/finalize/card") // Dedicated endpoint for card payments
    public ResponseEntity<PaymentResponseDTO> finalizeCardPayment(@PathVariable Long paymentId,
                                                                  @Valid @RequestBody CardFinalizationRequestDTO request) {
        log.info("Received request to finalize card payment ID: {}", paymentId);
        // Basic consistency check: Path variable ID should match body ID
//        if (!paymentId.equals(request.getPaymentId())) {
//            throw new BadRequestException("Payment ID in path does not match Payment ID in request body.");
//        }
        PaymentResponseDTO responseDTO = paymentService.finalizeCardPayment(request,paymentId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Endpoint to finalize a payment using UPI details.
     * Expects only UPI-specific details in the request body.
     * @param paymentId The ID of the initiated payment to finalize (from path).
     * @param request DTO containing payment ID (in body, for consistency check) and UPI details.
     * @return PaymentResponseDTO with the final payment status.
     */
    @PutMapping("user/{paymentId}/finalize/upi") // Dedicated endpoint for UPI payments
    public ResponseEntity<PaymentResponseDTO> finalizeUpiPayment(@PathVariable Long paymentId,
                                                                 @Valid @RequestBody UpiFinalizationRequestDTO request) {
        log.info("Received request to finalize UPI payment ID: {}", paymentId);
//        if (!paymentId.equals(request.getPaymentId())) {
//            throw new BadRequestException("Payment ID in path does not match Payment ID in request body.");
//        }
        PaymentResponseDTO responseDTO = paymentService.finalizeUpiPayment(request,paymentId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Endpoint to finalize a payment using Net Banking details.
     * Expects only Net Banking-specific details in the request body.
     * @param paymentId The ID of the initiated payment to finalize (from path).
     * @param request DTO containing payment ID (in body, for consistency check) and Net Banking details.
     * @return PaymentResponseDTO with the final payment status.
     */
    @PutMapping("user/{paymentId}/finalize/netbanking") // Dedicated endpoint for Net Banking payments
    public ResponseEntity<PaymentResponseDTO> finalizeNetBankingPayment(@PathVariable Long paymentId,
                                                                        @Valid @RequestBody NetBankingFinalizationRequestDTO request) {
        log.info("Received request to finalize Net Banking payment ID: {}", paymentId);
//        if (!paymentId.equals(request.getPaymentId())) {
//            throw new BadRequestException("Payment ID in path does not match Payment ID in request body.");
//        }
        PaymentResponseDTO responseDTO = paymentService.finalizeNetBankingPayment(request,paymentId);
        return ResponseEntity.ok(responseDTO);
    }

    /**
     * Retrieves details of a specific payment by its ID.
     * @param paymentId The ID of the payment to retrieve.
     * @return PaymentResponseDTO containing payment details.
     */
    @GetMapping("user/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentDetails(@PathVariable Long paymentId) {
        log.info("Received request to get payment details for ID: {}", paymentId);
        PaymentResponseDTO responseDTO = paymentService.getPaymentDetails(paymentId);
        return ResponseEntity.ok(responseDTO);
    }
    
    @GetMapping("user/mypayments/{userId}")
    public ResponseEntity<List<Payment>> getMyPayments(@PathVariable int userId){
    	List<Payment> payments = paymentService.getMyPayments(userId);
    	if(payments.isEmpty()) {
    		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    	}
    	return ResponseEntity.ok(payments);
    }
}
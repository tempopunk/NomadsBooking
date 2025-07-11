 package com.nomad.services.implementations;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nomad.dto.CardFinalizationRequestDTO;
import com.nomad.dto.NetBankingFinalizationRequestDTO;
import com.nomad.dto.PaymentInitiationRequestDTO;
import com.nomad.dto.PaymentResponseDTO; // Assuming PaymentResponseDTO is directly in 'dto'
import com.nomad.dto.UpiFinalizationRequestDTO;
import com.nomad.exception.BadRequestException;
import com.nomad.exception.PaymentProcessingException;
import com.nomad.exception.ResourceNotFoundException;
import com.nomad.model.Payment;
import com.nomad.model.enums.BookingStatus;
import com.nomad.model.enums.PaymentMethod;
import com.nomad.model.enums.PaymentStatus;
import com.nomad.repository.PaymentRepository;
import com.nomad.services.interfaces.HotelFeignProxy;
import com.nomad.services.interfaces.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    
    private final HotelFeignProxy template;
    
//    private final InvoiceService invoiceService;

    @Override
    @Transactional
    public PaymentResponseDTO initiatePayment(PaymentInitiationRequestDTO initiationRequest) {
        log.info("Initiating payment for booking ID: {}", initiationRequest.getBookingId());

       

//        if (!booking.getUserId().equals(initiationRequest.getUserId())) {
//            throw new BadRequestException("User ID mismatch for booking ID: " + initiationRequest.getBookingId());
//        }
//
//        if (booking.getTotalAmount().compareTo(initiationRequest.getAmount()) != 0) {
//            throw new BadRequestException("Payment amount does not match booking total. Expected: " + booking.getTotalAmount() + ", Received: " + initiationRequest.getAmount());
//        }

        
            Payment existingPayment = paymentRepository.findByBookingId(initiationRequest.getBookingId())
                .orElse(null);
            if (existingPayment != null && (existingPayment.getPaymentStatus() == PaymentStatus.SUCCESS || existingPayment.getPaymentStatus() == PaymentStatus.PENDING)) {
                throw new BadRequestException("Payment is already " + existingPayment.getPaymentStatus() + " for booking ID: " + initiationRequest.getBookingId());
            }
        

        Payment payment = new Payment();
        payment.setBookingId(initiationRequest.getBookingId());
        payment.setUserId(initiationRequest.getUserId());
        payment.setAmount(initiationRequest.getAmount());
        payment.setCurrency("INR");
        // REMOVED: payment.setPaymentMethod(initiationRequest.getPaymentMethod()); // Payment method not known at initiation
        payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setPaymentTimestamp(Instant.now());

        Payment savedPayment = paymentRepository.save(payment);
        
        

//        booking.setPaymentId(savedPayment.getPaymentId());
//        booking.setStatus(BookingStatus.PENDING_PAYMENT);
//        bookingRepository.save(booking);

        log.info("Payment initiated successfully with ID: {} for booking ID: {}", savedPayment.getPaymentId(), initiationRequest.getBookingId());
        return mapToPaymentResponseDTO(savedPayment, "Payment initiated. Please provide details to finalize.");
    }

    @Override
    @Transactional
    public PaymentResponseDTO finalizeCardPayment(CardFinalizationRequestDTO request,Long paymentId) {
        log.info("Attempting to finalize card payment ID: {}",paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment with ID " + paymentId + " cannot be finalized. Current status: " + payment.getPaymentStatus());
        }

        // --- NEW LOGIC: SET AND VALIDATE PAYMENT METHOD AT FINALIZATION ---
        if (payment.getPaymentMethod() != null) {
            // This means the payment was already finalized with some method
            throw new BadRequestException("Payment with ID " + paymentId + " has already been finalized with method: " + payment.getPaymentMethod());
        }
        // Set the payment method here, as it's being finalized with this method
        payment.setPaymentMethod(PaymentMethod.CREDIT_CARD);
        // -----------------------------------------------------------------

        

        String transactionId = generateUniqueTransactionId();
        PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
        String errorMessage = null;

        try {
            log.info("Processing card payment ending in: {}", request.getCardNumber().substring(request.getCardNumber().length() - 4));
            if (request.getCardNumber().endsWith("0000")) {
                throw new PaymentProcessingException("Simulated card processing failure due to card ending in '0000'.");
            }
            payment.setCardLastFourDigits(request.getCardNumber().substring(request.getCardNumber().length() - 4));
            payment.setCardType(deriveCardType(request.getCardNumber()));

            log.info("Payment gateway processing successful for payment ID: {}", paymentId);
        } catch (PaymentProcessingException | BadRequestException e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = e.getMessage();
            log.error("Payment finalization failed for payment ID {}: {}", paymentId, e.getMessage());
            throw e;
        } catch (Exception e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = "An unexpected error occurred during payment finalization.";
            log.error("Unexpected error during payment finalization for ID {}: {}", paymentId, e.getMessage(), e);
            throw new PaymentProcessingException(errorMessage);
        }

        payment.setTransactionId(transactionId);
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentTimestamp(Instant.now());
        payment.setErrorMessage(errorMessage);

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment record ID: {} status updated to {}.", savedPayment.getPaymentId(), savedPayment.getPaymentStatus());

        if (paymentStatus == PaymentStatus.SUCCESS) {
//            booking.setStatus(BookingStatus.COMPLETED);
//            bookingRepository.save(booking);
        	  template.updateBooking(payment.getBookingId(), BookingStatus.PAID);
        	
            log.info("Booking ID: {} status updated to COMPLETED.", payment.getBookingId());
//            invoiceService.generateInvoice(savedPayment.getBookingId(), savedPayment.getPaymentId());
//            log.info("Invoice generation initiated for booking ID: {} and payment ID: {}", savedPayment.getBookingId(), savedPayment.getPaymentId());
        } else {
//            booking.setStatus(BookingStatus.CANCELLED);
//            bookingRepository.save(booking);
        	template.updateBooking(payment.getBookingId(), BookingStatus.PAID);
            log.warn("Booking ID: {} status set to CANCELLED due to payment failure.", payment.getBookingId());
        }

        return mapToPaymentResponseDTO(savedPayment, paymentStatus == PaymentStatus.SUCCESS ? "Payment successful" : "Payment failed");
    }

    @Override
    @Transactional
    public PaymentResponseDTO finalizeUpiPayment(UpiFinalizationRequestDTO request,Long paymentId) {
        log.info("Attempting to finalize UPI payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment with ID " + paymentId + " cannot be finalized. Current status: " + payment.getPaymentStatus());
        }

        // --- NEW LOGIC: SET AND VALIDATE PAYMENT METHOD AT FINALIZATION ---
        if (payment.getPaymentMethod() != null) {
            throw new BadRequestException("Payment with ID " + paymentId + " has already been finalized with method: " + payment.getPaymentMethod());
        }
        payment.setPaymentMethod(PaymentMethod.UPI);
        // -----------------------------------------------------------------

        
        String transactionId = generateUniqueTransactionId();
        PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
        String errorMessage = null;

        try {
            log.info("Processing UPI payment for UPI ID: {}", request.getUpiId());
            if ("fail@upi".equals(request.getUpiId())) {
                 throw new PaymentProcessingException("Simulated UPI payment failure.");
            }
            //payment.setUpiId(request.getUpiDetails().getUpiId());

            log.info("Payment gateway processing successful for payment ID: {}", paymentId);
        } catch (PaymentProcessingException | BadRequestException e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = e.getMessage();
            log.error("Payment finalization failed for payment ID {}: {}", paymentId, e.getMessage());
            throw e;
        } catch (Exception e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = "An unexpected error occurred during payment finalization.";
            log.error("Unexpected error during payment finalization for ID {}: {}", paymentId, e.getMessage(), e);
            throw new PaymentProcessingException(errorMessage);
        }

        payment.setTransactionId(transactionId);
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentTimestamp(Instant.now());
        payment.setErrorMessage(errorMessage);

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment record ID: {} status updated to {}.", savedPayment.getPaymentId(), savedPayment.getPaymentStatus());

        if (paymentStatus == PaymentStatus.SUCCESS) {
//            booking.setStatus(BookingStatus.COMPLETED);
//            bookingRepository.save(booking);
        	template.updateBooking(payment.getBookingId(), BookingStatus.PAID);
            log.info("Booking ID: {} status updated to COMPLETED.", payment.getBookingId());
            //invoiceService.generateInvoice(savedPayment.getBookingId(), savedPayment.getPaymentId());
            //log.info("Invoice generation initiated for booking ID: {} and payment ID: {}", savedPayment.getBookingId(), savedPayment.getPaymentId());
        } else {
//            booking.setStatus(BookingStatus.CANCELLED);
//            bookingRepository.save(booking);
        	template.updateBooking(payment.getBookingId(), BookingStatus.CANCELLED);
            log.warn("Booking ID: {} status set to CANCELLED due to payment failure.", payment.getBookingId());
        }

        return mapToPaymentResponseDTO(savedPayment, paymentStatus == PaymentStatus.SUCCESS ? "Payment successful" : "Payment failed");
    }

    @Override
    @Transactional
    public PaymentResponseDTO finalizeNetBankingPayment(NetBankingFinalizationRequestDTO request,Long paymentId) {
        log.info("Attempting to finalize Net Banking payment ID: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new BadRequestException("Payment with ID " + paymentId + " cannot be finalized. Current status: " + payment.getPaymentStatus());
        }

        // --- NEW LOGIC: SET AND VALIDATE PAYMENT METHOD AT FINALIZATION ---
        if (payment.getPaymentMethod() != null) {
            throw new BadRequestException("Payment with ID " + paymentId + " has already been finalized with method: " + payment.getPaymentMethod());
        }
        payment.setPaymentMethod(PaymentMethod.NET_BANKING);
        // -----------------------------------------------------------------

        

        String transactionId = generateUniqueTransactionId();
        PaymentStatus paymentStatus = PaymentStatus.SUCCESS;
        String errorMessage = null;

        try {
            log.info("Processing Net Banking payment for bank: {}", request.getBankName());
            if ("FailedBank".equals(request.getBankName())) {
                 throw new PaymentProcessingException("Simulated Net Banking payment failure.");
            }
            payment.setBankName(request.getBankName());

            log.info("Payment gateway processing successful for payment ID: {}", paymentId);
        } catch (PaymentProcessingException | BadRequestException e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = e.getMessage();
            log.error("Payment finalization failed for payment ID {}: {}", paymentId, e.getMessage());
            throw e;
        } catch (Exception e) {
            paymentStatus = PaymentStatus.FAILED;
            errorMessage = "An unexpected error occurred during payment finalization.";
            log.error("Unexpected error during payment finalization for ID {}: {}", paymentId, e.getMessage(), e);
            throw new PaymentProcessingException(errorMessage);
        }

        payment.setTransactionId(transactionId);
        payment.setPaymentStatus(paymentStatus);
        payment.setPaymentTimestamp(Instant.now());
        payment.setErrorMessage(errorMessage);

        Payment savedPayment = paymentRepository.save(payment);
        log.info("Payment record ID: {} status updated to {}.", savedPayment.getPaymentId(), savedPayment.getPaymentId());

        if (paymentStatus == PaymentStatus.SUCCESS) {
//            booking.setStatus(BookingStatus.COMPLETED);
//            bookingRepository.save(booking);
        	template.updateBooking(payment.getBookingId(), BookingStatus.PAID);
            log.info("Booking ID: {} status updated to COMPLETED.", payment.getBookingId());
            //invoiceService.generateInvoice(savedPayment.getBookingId(), savedPayment.getPaymentId());
            //log.info("Invoice generation initiated for booking ID: {} and payment ID: {}", savedPayment.getBookingId(), savedPayment.getPaymentId());
        } else {
//            booking.setStatus(BookingStatus.CANCELLED);
//            bookingRepository.save(booking);
        	template.updateBooking(payment.getBookingId(), BookingStatus.CANCELLED);
            log.warn("Booking ID: {} status set to CANCELLED due to payment failure.", payment.getBookingId());
        }

        return mapToPaymentResponseDTO(savedPayment, paymentStatus == PaymentStatus.SUCCESS ? "Payment successful" : "Payment failed");
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentDetails(Long paymentId) {
        log.info("Fetching payment details for payment ID: {}", paymentId);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return mapToPaymentResponseDTO(payment, "Payment details fetched successfully");
    }

    private String generateUniqueTransactionId() {
        return "TRN" + Instant.now().toEpochMilli() + (int)(Math.random() * 100000);
    }

    private String deriveCardType(String cardNumber) {
        if (cardNumber == null || cardNumber.isEmpty()) return "Unknown";
        if (cardNumber.startsWith("4")) return "Visa";
        if (cardNumber.startsWith("5")) return "Mastercard";
        if (cardNumber.startsWith("34") || cardNumber.startsWith("37")) return "Amex";
        return "Unknown";
    }

    private PaymentResponseDTO mapToPaymentResponseDTO(Payment payment, String message) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setPaymentId(payment.getPaymentId());
        dto.setBookingId(payment.getBookingId());
        dto.setUserId(payment.getUserId());
        dto.setAmount(payment.getAmount());
        return dto;
    }
    
    public List<Payment> getMyPayments(int userId){
    	return paymentRepository.findByUserId(userId);
    }
}
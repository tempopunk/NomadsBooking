package com.nomad.services.interfaces;

import java.util.List;

import com.nomad.dto.CardFinalizationRequestDTO;
import com.nomad.dto.NetBankingFinalizationRequestDTO;
import com.nomad.dto.PaymentInitiationRequestDTO;
import com.nomad.dto.PaymentResponseDTO;
import com.nomad.dto.UpiFinalizationRequestDTO;
import com.nomad.model.Payment;


public interface PaymentService {
    /**
     * Initiates a payment, creating a PENDING payment record.
     * @param initiationRequest DTO containing basic payment and booking details.
     * @return PaymentResponseDTO with the generated payment ID and PENDING status.
     */
    PaymentResponseDTO initiatePayment(PaymentInitiationRequestDTO initiationRequest);

    /**
     * Finalizes an initiated payment using Credit/Debit Card details.
     * @param request DTO containing payment ID and card details.
     * @return PaymentResponseDTO with updated payment status.
     */
    PaymentResponseDTO finalizeCardPayment(CardFinalizationRequestDTO request,Long paymentId);

    /**
     * Finalizes an initiated payment using UPI details.
     * @param request DTO containing payment ID and UPI details.
     * @return PaymentResponseDTO with updated payment status.
     */
    PaymentResponseDTO finalizeUpiPayment(UpiFinalizationRequestDTO request,Long paymentId);

    /**
     * Finalizes an initiated payment using Net Banking details.
     * @param request DTO containing payment ID and Net Banking details.
     * @return PaymentResponseDTO with updated payment status.
     */
    PaymentResponseDTO finalizeNetBankingPayment(NetBankingFinalizationRequestDTO request,Long paymentId);

    /**
     * Retrieves details of a specific payment.
     * @param paymentId The ID of the payment to retrieve.
     * @return PaymentResponseDTO containing payment details.
     */
    PaymentResponseDTO getPaymentDetails(Long paymentId);
    
    public List<Payment> getMyPayments(int userId);
}
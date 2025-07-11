package com.nomad.services.interfaces;

import com.nomad.dto.InvoiceResponseDTO;

public interface InvoiceService {
    InvoiceResponseDTO generateInvoice(int userId,Long bookingId, Long paymentId);
    InvoiceResponseDTO getInvoiceDetails(Long invoiceId);
    InvoiceResponseDTO getInvoiceByBookingId(Long bookingId);
    byte[] downloadInvoiceAsPdf(String invoiceNumber);
}
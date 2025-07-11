package com.nomad.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nomad.dto.InvoiceResponseDTO; // Assuming this DTO is in com.nomad.dto
import com.nomad.exception.ResourceNotFoundException;
import com.nomad.model.Payment;
import com.nomad.repository.PaymentRepository;
import com.nomad.services.interfaces.InvoiceService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/v1/invoices") 
@RequiredArgsConstructor // For Constructor-based Dependency Injection
@Slf4j // For logging
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PaymentRepository paymentRepository;// Injecting the InvoiceService

    /**
     * Generates an invoice for a given booking and payment.
     * @param bookingId The ID of the booking.
     * @param paymentId The ID of the payment.
     * @return InvoiceResponseDTO with generated invoice details.
     */
    @PostMapping("user/generate") // Using POST for creating a new invoice resource
    public ResponseEntity<InvoiceResponseDTO> generateInvoice(
            @RequestParam Long paymentId) {
    	Payment payment = paymentRepository.findByPaymentId(paymentId).orElseThrow(() -> new ResourceNotFoundException("booking not found with ID: " + paymentId));
        log.info("Received request to generate invoice for booking ID: {} and payment ID: {}", payment.getBookingId(), paymentId);
        InvoiceResponseDTO responseDTO = invoiceService.generateInvoice(payment.getUserId(),payment.getBookingId(), paymentId);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED); // 201 Created
    }

    /**
     * Retrieves details of a specific invoice by its ID.
     * @param invoiceId The ID of the invoice to retrieve.
     * @return InvoiceResponseDTO containing invoice details.
     */
    @GetMapping("user/{invoiceId}") // Using GET for retrieving a resource by ID
    public ResponseEntity<InvoiceResponseDTO> getInvoiceDetails(@PathVariable Long invoiceId) {
        log.info("Received request to get invoice details for ID: {}", invoiceId);
        InvoiceResponseDTO responseDTO = invoiceService.getInvoiceDetails(invoiceId);
        return ResponseEntity.ok(responseDTO); // 200 OK
    }

    /**
     * Retrieves invoice details by booking ID.
     * @param bookingId The ID of the booking associated with the invoice.
     * @return InvoiceResponseDTO containing invoice details.
     */
    @GetMapping("user/booking/{bookingId}") // Using GET for retrieving a resource by related ID
    public ResponseEntity<InvoiceResponseDTO> getInvoiceByBookingId(@PathVariable Long bookingId) {
        log.info("Received request to get invoice details for booking ID: {}", bookingId);
        InvoiceResponseDTO responseDTO = invoiceService.getInvoiceByBookingId(bookingId);
        return ResponseEntity.ok(responseDTO); // 200 OK
    }

    /**
     * Downloads the invoice as a PDF.
     * @param invoiceId The ID of the invoice to download.
     * @return ResponseEntity with the PDF byte array.
     */
    @GetMapping("user/{invoiceNumber}/download") // Using GET for downloading a file
    public ResponseEntity<byte[]> downloadInvoiceAsPdf(@PathVariable String invoiceNumber) {
    	
        log.info("Received request to download PDF for invoice ID: {}", invoiceNumber);
        byte[] pdfContent = invoiceService.downloadInvoiceAsPdf(invoiceNumber);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF); // Set content type to PDF
        String filename = "invoice-" + invoiceNumber + ".pdf";
        headers.setContentDispositionFormData("attachment", filename); // Suggest file download
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0"); // Cache control headers

        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK); // 200 OK with PDF content
    }
}

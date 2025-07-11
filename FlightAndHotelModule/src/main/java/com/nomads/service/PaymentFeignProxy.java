package com.nomads.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.nomads.dto.PaymentInitiationRequestDTO;
import com.nomads.dto.PaymentResponseDTO;

import jakarta.validation.Valid;

@FeignClient(name="PaymentService")
public interface PaymentFeignProxy {
	@PostMapping("/api/v1/payments/micro/initiate")
    public ResponseEntity<PaymentResponseDTO> initiatePayment(@Valid @RequestBody PaymentInitiationRequestDTO initiationRequestDTO);

}

package com.nomad.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpiFinalizationRequestDTO {
	@NotBlank(message = "UPI ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9.\\-]+@[a-zA-Z0-9.\\-]+$", message = "Invalid UPI ID format")
    private String upiId;
}

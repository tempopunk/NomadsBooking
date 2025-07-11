package com.nomads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AgentProfileDto {
	@NotNull
	private int agentId;
	@NotBlank(message = "Name is required")
    @Size(min = 2, max = 25, message = "Name must be between 2 and 25 characters")
	private String name;
	@NotBlank(message = "Email is required")
    @Size(min = 2, max = 25, message = "Email must be between 2 and 25 characters")
	private String email;
	
	private String companyName;
	@NotBlank(message = "address  is required")
    @Size(min = 2, max = 100, message = "Company name  must be between 2 and 10 characters")
	private String address;
	@NotBlank(message = "Phone number   is required")
    @Size(min = 2, max = 10, message = "Company name  must be between 2 and 10 characters")
	private String phoneNumber;


}

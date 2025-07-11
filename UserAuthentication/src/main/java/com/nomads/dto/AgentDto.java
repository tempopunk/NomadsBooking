package com.nomads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AgentDto {
	
	@NotBlank(message = "Name is required")
    @Size(min = 2, max = 25, message = "Name must be between 2 and 25 characters")
	private String name;
	@NotBlank(message = "Email is required")
    @Size(min = 2, max = 25, message = "Email must be between 2 and 25 characters")
	private String email;
	@Pattern(
			  regexp = "^(?=.*[a-z])(?=.*\\d).{6,}$",
			  message = "Password must be at least 6 characters long and contain at least one lowercase letter and one digit."
			)
	private String passwordHash;
	@NotBlank(message = "agent is required")
    @Size(min = 2, max = 14, message = "agent must be between 2 and 10 characters")
	private String agentType;
	@NotBlank(message = "Company name  is required")
    @Size(min = 2, max = 10, message = "Company name  must be between 2 and 10 characters")
	private String companyName;
	@NotBlank(message = "address  is required")
    @Size(min = 2, max = 100, message = "Company name  must be between 2 and 10 characters")
	private String address;
	@NotBlank(message = "Phone number   is required")
    @Size(min = 2, max = 10, message = "Company name  must be between 2 and 10 characters")
	private String phoneNumber;

}

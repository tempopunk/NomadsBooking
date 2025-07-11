package com.nomads.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
	
	@NotBlank(message = "Email is required")
    @Size(min = 2, max = 25, message = "Email must be between 2 and 25 characters")
	private String  email;
	@Pattern(
			  regexp = "^(?=.*[a-z])(?=.*\\d).{6,}$",
			  message = "Password must be at least 6 characters long and contain at least one lowercase letter and one digit."
			)
	private String password;

}

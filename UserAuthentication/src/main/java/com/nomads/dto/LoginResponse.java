package com.nomads.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
	
	private int id;
	private String name;
	private String email;
	private String token;
	private String role;

}

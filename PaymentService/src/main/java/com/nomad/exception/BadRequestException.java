package com.nomad.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends IllegalArgumentException {
    
	private static final long serialVersionUID = 1L;

	public BadRequestException(String message) {
        super(message);
    }
}
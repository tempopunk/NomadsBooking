package com.nomad.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN) 
public class BookingNotConfirmedException extends IllegalStateException { 
    
	private static final long serialVersionUID = 1L;

	public BookingNotConfirmedException(String message) {
        super(message);
    }
}
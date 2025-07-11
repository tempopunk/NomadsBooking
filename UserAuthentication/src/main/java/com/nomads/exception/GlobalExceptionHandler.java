package com.nomads.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
	
	@ExceptionHandler(AgentAlreadyExistsException.class)
	public ResponseEntity<String> handleAgentAlreadyExistsException(AgentAlreadyExistsException ex ){
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.CONFLICT);
	}
	
	@ExceptionHandler(InvalidUserCredentialsException.class)
	public ResponseEntity<String> handleInvalidUserCredentialsException(InvalidUserCredentialsException ex ){
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(InvalidAgentCredentialsException.class)
	public ResponseEntity<String> handleInvalidAgentCredentialsException(InvalidAgentCredentialsException ex ){
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.UNAUTHORIZED);
	}
	
	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException ex ){
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.CONFLICT);
	}
		
	

}

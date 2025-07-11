package com.nomads.exception;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice

public class GlobalExecptionHandler {
	 @ExceptionHandler(Exception.class)
	    public ResponseEntity<String> Exception(Exception ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	    }
	
	 @ExceptionHandler(ResourceNotFoundException.class)
	    public ResponseEntity<String> handleResourceNotFoundException(ResourceNotFoundException ex) {
	        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	    }
	 
	 @ExceptionHandler(DateTimeParseException.class)
	    public ResponseEntity<String> handleHttpMessageNotReadableException(DateTimeParseException ex) {
	        return new ResponseEntity<>("the date format is incorrect please use yyyy-mm-dd", HttpStatus.BAD_REQUEST);
	    }
	 
	 @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<Map<String, String>> handleValidationExceptions(
	            MethodArgumentNotValidException ex) {
	        Map<String, String> errors = new HashMap<>();
	        ex.getBindingResult().getAllErrors().forEach((error) -> {
	            String fieldName = ((FieldError) error).getField();
	            String errorMessage = error.getDefaultMessage();
	            errors.put(fieldName, errorMessage);
	        });
	        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	    }
	 
	 @ExceptionHandler(IllegalDateFormatException.class)
		public ResponseEntity<String> handleIllegalArgumentException(IllegalDateFormatException ex) {
			return new ResponseEntity<>(ex.getMessage(),HttpStatus.BAD_REQUEST);
}
	 
	 @ExceptionHandler(IllegalDateException.class)
		public ResponseEntity<String> handleIllegalDateException(IllegalDateException ex) {
			return new ResponseEntity<>(ex.getMessage(),HttpStatus.BAD_REQUEST);
}
	 
}
package com.nomads.exception;

public class IllegalDateFormatException extends IllegalArgumentException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public IllegalDateFormatException(String message) {
        super(message);
    }
}
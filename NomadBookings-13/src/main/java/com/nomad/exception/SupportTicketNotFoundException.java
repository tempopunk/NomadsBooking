package com.nomad.exception;

public class SupportTicketNotFoundException extends RuntimeException {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public SupportTicketNotFoundException(String message) {
        super(message);
    }
}

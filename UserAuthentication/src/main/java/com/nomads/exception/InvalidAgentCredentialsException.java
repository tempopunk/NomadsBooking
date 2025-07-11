package com.nomads.exception;

public class InvalidAgentCredentialsException extends RuntimeException{
	
	private static final long serialVersionUID = 1L;

	public InvalidAgentCredentialsException(String msg) {
		super(msg);
	}

}

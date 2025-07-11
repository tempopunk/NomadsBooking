package com.nomads.exception;

public class AgentAlreadyExistsException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public AgentAlreadyExistsException(String msg) {
		super(msg);
	}

}

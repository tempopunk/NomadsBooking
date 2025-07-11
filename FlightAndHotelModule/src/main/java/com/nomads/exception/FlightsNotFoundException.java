package com.nomads.exception;

public class FlightsNotFoundException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public FlightsNotFoundException(String msg) {
		super(msg);
	}

}

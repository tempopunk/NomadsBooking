package com.nomads.exception;

public class HotelsNotFoundException extends RuntimeException {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public HotelsNotFoundException(String msg) {
		super(msg);
	}

}

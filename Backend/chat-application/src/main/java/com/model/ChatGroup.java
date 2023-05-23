package com.model;

public class ChatGroup {

	private String sender;
	private String message;

	public ChatGroup(String sender, String message) {
		this.sender = sender;
		this.message = message;
	}

	public ChatGroup() {
		super();
	}

	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}

	@Override
	public String toString() {
		return "ChatGroup [sender=" + sender + ", message=" + message + "]";
	}
}
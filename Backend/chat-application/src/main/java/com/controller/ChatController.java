package com.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.model.ChatGroup;
import com.model.ChatPrivate;

@RestController
@CrossOrigin("*")
public class ChatController {

	@Autowired
	SimpMessagingTemplate messagingTemplate;

	//for group
	@MessageMapping("/message")
	@SendTo("/chatroom/public")
	public ChatGroup messageReceived(@Payload ChatGroup chatGroup) {
		return chatGroup;
	}

	//for personal
	@MessageMapping("/private-message")
	public void privateMessage(@Payload ChatPrivate chatPrivate) {
		messagingTemplate.convertAndSendToUser(chatPrivate.getSender(), "/private", chatPrivate);
	}
}
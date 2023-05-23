package com.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.model.User;
import com.repo.UserRepo;

@RestController
@CrossOrigin("*")
public class HomeController {

	@Autowired
	UserRepo userrepo;

	@PostMapping("/addUser")
	public ResponseEntity<?> add(@RequestParam("username") String uname, @RequestParam("password") String password,
			User user) {
		try {
			User existuser = this.userrepo.findByName(uname);
			if (existuser != null) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Already Exists");
			}
			user.setUsername(uname);
			user.setPassword(password);
			this.userrepo.save(user);
			return ResponseEntity.status(HttpStatus.OK).body("User Added Suucessfully");
		} catch (Exception exception) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something Went Wrong");
		}
	}

	@GetMapping("/checkuser")
	public ResponseEntity<?> checkUser(@RequestParam("username") String uname) {
		User user = this.userrepo.findByName(uname);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Not Exists");
		}
		return ResponseEntity.status(HttpStatus.OK).body("User Already Exists");
	}

	@GetMapping("/getall")
	public ArrayList<String> getAllUsers(ModelAndView andView) {
		ArrayList<String> userName = new ArrayList<>();
		for (User user : this.userrepo.findAll()) {
			userName.add(user.getUsername());
		}
		return userName;
	}

}
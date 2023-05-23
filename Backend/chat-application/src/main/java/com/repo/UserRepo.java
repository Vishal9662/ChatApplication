package com.repo;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.model.User;

public interface UserRepo extends MongoRepository<User, String> {
	@Query("{Username: ?0}")
	User findByName(String name);
}
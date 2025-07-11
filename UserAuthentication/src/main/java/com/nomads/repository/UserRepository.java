package com.nomads.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.User;

public interface UserRepository extends JpaRepository<User,Integer > {
    
	User findByEmail(String email);

}

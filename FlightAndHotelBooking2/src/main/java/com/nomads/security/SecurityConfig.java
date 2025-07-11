package com.nomads.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	    @Autowired
	    private JwtFilter jwtFilter;

	    @Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    	http.csrf(csrf -> csrf.disable())
	    	    .authorizeHttpRequests(auth -> auth
	    	    		
//	    	    .requestMatchers("/api/v1/package/**").permitAll()
////	            .requestMatchers("/api/v1/admin/**").hasRole("Admin")
//	            .requestMatchers("/api/v1/package/user/**").hasRole("User")
//	            .requestMatchers("/api/v1/package/travel_agent/**").hasRole("TravelAgent")
////	    
////	            
//	            .anyRequest().authenticated())
	    	    .anyRequest().permitAll())
	            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
	    
	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

}

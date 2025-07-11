package com.nomad.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	    
	    private final JwtFilter jwtFilter;

	    @Bean
	    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
	    	http.csrf(csrf -> csrf.disable())
	    	    .authorizeHttpRequests(auth -> auth
	    	    		
	    	    .requestMatchers("/api/v1/hotel/micro/**").permitAll()
	            .requestMatchers("/api/v1/feedback/user/**").hasRole("User")
	            .requestMatchers("/api/v1/review/user/**").hasRole("User")
	            .requestMatchers("/api/v1/feedback/admin/**").hasRole("Admin")
	            .requestMatchers("/api/v1/review/admin/**").hasRole("Admin")
	            .requestMatchers("/api/v1/review/user/**").hasRole("User")
	            .requestMatchers("/api/v1/review/reviews/hotel/**").hasAnyRole("User","HotelAgent","Admin")
	            .requestMatchers("/api/v1/review/reviews/flight/**").hasAnyRole("User","FlightAgent","Admin")
	            .requestMatchers("/api/v1/review/reviews/package/**").hasAnyRole("User","TravelAgent","Admin")
	            .requestMatchers("/api/v1/support/user/**").hasRole("User")
	            .requestMatchers("/api/v1/support/both/**").hasAnyRole("User","HotelAgent","TravelAgent","FlightAgent")
	            .requestMatchers("/api/v1/support/admin/**").hasRole("Admin")
	            .requestMatchers("/api/v1/support/agent/**").hasAnyRole("HotelAgent","TravelAgent","FlightAgent")
	            
	           
            
	            .anyRequest().authenticated())
//	    	    .anyRequest().permitAll())
	            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
	    
	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

}

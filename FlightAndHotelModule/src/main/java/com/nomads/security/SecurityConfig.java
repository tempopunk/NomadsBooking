package com.nomads.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
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
	    	    //.requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()
	            .requestMatchers("/api/v1/hotel/user/**").hasRole("User")
	            .requestMatchers("/api/v1/flight/user/**").hasRole("User")
	            .requestMatchers("/api/v1/hotel/hotel_agent/**").hasAnyRole("HotelAgent","User")
	            .requestMatchers("/api/v1/flight/flight_agent/**").hasRole("FlightAgent")
	            .requestMatchers("/api/v1/flight/both/**").hasRole("FlightAgent")
            
	            .anyRequest().authenticated())
	    	    
	            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
	    
	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }

}

package com.example.demo;



import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.reactive.CorsWebFilter;

import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
 
@Configuration

public class CorsConfig {

    @Bean

    public CorsWebFilter corsWebFilter() {

        CorsConfiguration corsConfig = new CorsConfiguration();

        corsConfig.setAllowCredentials(true);

        corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        corsConfig.setAllowedHeaders(Arrays.asList("http://localhost:3000","*"));

        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        corsConfig.setMaxAge(3600L);
 
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", corsConfig);
 
        return new CorsWebFilter(source);

    }

}
 
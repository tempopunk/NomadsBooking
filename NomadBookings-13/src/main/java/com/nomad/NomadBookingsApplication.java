package com.nomad;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients("com.nomad.service")
@EnableJpaAuditing
public class NomadBookingsApplication {

	public static void main(String[] args) {
		SpringApplication.run(NomadBookingsApplication.class, args);
	}

}

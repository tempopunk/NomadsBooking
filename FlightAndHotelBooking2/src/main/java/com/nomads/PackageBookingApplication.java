package com.nomads;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
@EnableDiscoveryClient
@EnableFeignClients("com.nomads.service")
public class PackageBookingApplication {

	public static void main(String[] args) {
		SpringApplication.run(PackageBookingApplication.class, args);
	}

}

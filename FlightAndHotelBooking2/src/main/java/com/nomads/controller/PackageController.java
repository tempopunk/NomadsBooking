package com.nomads.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.nomads.dto.PackageDto;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.entity.Packages;
import com.nomads.service.PackageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/package")
public class PackageController {
	
	 
	private final PackageService packageService;
	
	@GetMapping("/user/search")
	public ResponseEntity<List<Packages>> getPackagesByLocation( @RequestParam String origin,@RequestParam String destination, @RequestParam LocalDate departureDate){
		return ResponseEntity.ok(packageService.searchByLocation(origin,destination,departureDate));
		
	}
	
	@GetMapping("/user/ascending")
	public ResponseEntity<List<Packages>> sortByAscend(@RequestParam String origin,@RequestParam String destination,@RequestParam LocalDate departureDate){
		return ResponseEntity.ok(packageService.sortByAscend(origin,destination,departureDate));
	}
	
	@GetMapping("/user/descending")
	public ResponseEntity<List<Packages>> sortByDescend(@RequestParam String origin,@RequestParam String destination,@RequestParam LocalDate departureDate){
		return ResponseEntity.ok(packageService.sortByDescend(origin,destination,departureDate));
	}
	
	@GetMapping("/user/viewpackage")
	public ResponseEntity<Packages> viewPackage(@RequestParam int packageId){
		return ResponseEntity.ok(packageService.viewPackage(packageId));
	}
	
	@PostMapping("/user/checkout")
	public ResponseEntity<PaymentResponseDTO> checkOut(@RequestParam int userId,@RequestParam int packageId){
		return ResponseEntity.ok(packageService.checkOut(userId,packageId));
	}
	
	@PostMapping("/travel_agent/addpackage/{agentId}")
	public ResponseEntity<String> addPackage(@Valid @RequestBody PackageDto packageDto, @PathVariable int agentId){
		return ResponseEntity.ok(packageService.addPackage(packageDto,agentId));
	}
	

	@DeleteMapping("/travel_agent/deletepackage")
	public String removePackage(@RequestParam int packageId) {
		return packageService.deletePackage(packageId);
	}

}

package com.nomads.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.nomads.dto.CreatePackageBookingDto;
import com.nomads.dto.PackageDto;
import com.nomads.dto.PaymentInitiationRequestDTO;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.dto.SendBookingDataDto;
import com.nomads.entity.Packages;
import com.nomads.exception.IllegalDateException;
import com.nomads.exception.ResourceNotFoundException;
import com.nomads.repository.PackageRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class PackageService {

	private final PackageRepository packageRepository;
	
	private final PackageFeignProxy template;
	
	private final PaymentFeignProxy paymentFeignProxy;
	
	private final AuthFeignProxy authFeignProxy;
	

	public List<Packages> searchByLocation(String origin, String destination, LocalDate departure) {
		log.info("Search results :");
		return packageRepository.findByOriginAndDestinationAndDepartureDate(origin, destination, departure);
	}
	
	public List<Packages> sortByAscend(String origin, String destination, LocalDate departure) {
	    log.info("Sorted : Low to High");
	    List<Packages> packages = packageRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceAsc(origin, destination, departure);
	    if (packages.isEmpty()) {
	        log.info("Packages Not Found");
	        throw new ResourceNotFoundException("Packages Not Found for the specified source, destination, and date.");
	    }
	    return packages;
	}
	
	public List<Packages> sortByDescend(String origin, String destination, LocalDate departure) {
	    log.info("Sorted : High to Low");
	    List<Packages> packages = packageRepository.findByOriginAndDestinationAndDepartureDateOrderByPriceDesc(origin, destination, departure);
	    if (packages.isEmpty()) {
	        log.info("Packages Not Found");
	        throw new ResourceNotFoundException("Packages Not Found for the specified source, destination, and date.");
	    }
	    return packages;
	}

	public Packages viewPackage(int package_id) {
		log.info("Package Details :");
		Optional<Packages> packages = packageRepository.findById(package_id);
		if (packages.isPresent()) {
			return packages.get();
		}
		log.info("Package Not Found");
		throw new ResourceNotFoundException("Invalid Package Id . Please Recheck Package");
	}


	public PaymentResponseDTO checkOut(int userId, int packageId) {
	    

	    Packages packag = packageRepository.findById(packageId)
	            .orElseThrow(() -> new ResourceNotFoundException("Package not found with ID: " + packageId));

	    LocalDate today = LocalDate.now();
	    LocalDate sixWeeksFromNow = today.plusWeeks(6);

	   
	    if (packag.getDepartureDate().isAfter(sixWeeksFromNow)) {
	        throw new IllegalDateException("Users cannot book packages with a departure date beyond 6 weeks. Departure date: " + packag.getDepartureDate());
	    }

	    double price = packag.getPrice();
	    
	    CreatePackageBookingDto createPackageBookingDto = new CreatePackageBookingDto(packageId,userId,price,"PENDING");
	    
	    SendBookingDataDto sendBookingDataDto = template.createPackageBooking(createPackageBookingDto);
	    ResponseEntity<PaymentResponseDTO> responseEntity = null;
	    if(sendBookingDataDto!= null) {
	    	
	    	PaymentInitiationRequestDTO paymentInitiationRequestDTO = new PaymentInitiationRequestDTO(sendBookingDataDto.getBookingId(),userId,sendBookingDataDto.getAmount());
			
			responseEntity = paymentFeignProxy.initiatePayment(paymentInitiationRequestDTO);			
	    	
	    }
	    
	    


	    return responseEntity.getBody();
	}
	


	
	public String addPackage(PackageDto packageDto,int agentId) {
		
	    
	    int hotelId = template.getHotelId(packageDto.getHotelName());

	    int roomId = template.getRoomId(packageDto.getRoomName());
	    
	    Packages pack = new Packages(packageDto.getOrigin(), packageDto.getDestination(), hotelId, roomId,packageDto.getDepartureFlightId(),packageDto.getReturnFlightId(),
	            packageDto.getNumberOfDays(),
	            packageDto.getDepartureDate(), packageDto.getPrice(),packageDto.getItineraryNotes());
	    
	    

	    Packages pac = packageRepository.save(pack);
	    
	    authFeignProxy.linkId("Package", agentId,pac.getPackageId());
	    log.info("Package added successfully");
	    return "Package added successfully";
	}
	
	
	public String deletePackage(int packageId) {
		packageRepository.deleteById(packageId);
		log.info("Package deleted succesfully");
		return "package deleted succesfully";
	}
}
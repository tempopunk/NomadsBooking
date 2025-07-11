package com.nomad.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nomad.dto.ReviewRequestDTO;
import com.nomad.dto.ReviewResponseDTO;
import com.nomad.model.Review;
import com.nomad.service.interfaces.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    
    @GetMapping("/admin/reviews")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    
    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.noContent().build();
    }

    
    @PostMapping("/user/reviews")
    public ResponseEntity<ReviewResponseDTO> submitReview(@Valid @RequestBody ReviewRequestDTO requestDTO) {
        return ResponseEntity.ok(reviewService.submitReview(requestDTO));
    }

  
    @GetMapping("/reviews/hotel/{hotelId}/average-rating")
    public ResponseEntity<Double> getAverageHotelRating(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getAverageHotelRating(hotelId));
    }

    @GetMapping("/reviews/flight/{flightId}/average-rating")
    public ResponseEntity<Double> getAverageFlightRating(@PathVariable Long flightId) {
        return ResponseEntity.ok(reviewService.getAverageFlightRating(flightId));
    }

    @GetMapping("/reviews/package/{packageId}/average-rating")
    public ResponseEntity<Double> getAveragePackageRating(@PathVariable Long packageId) {
        return ResponseEntity.ok(reviewService.getAveragePackageRating(packageId));
    }

    
    @GetMapping("/reviews/hotel/{hotelId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(reviewService.getReviewsByHotel(hotelId));
    }

   
    @GetMapping("/reviews/flight/{flightId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByFlight(@PathVariable Long flightId) {
        return ResponseEntity.ok(reviewService.getReviewsByFlight(flightId));
    }

    @GetMapping("/reviews/package/{packageId}")
    public ResponseEntity<List<ReviewResponseDTO>> getReviewsByPackage(@PathVariable Long packageId) {
        return ResponseEntity.ok(reviewService.getReviewsByPackage(packageId));
    }
    
    @GetMapping("/user/hreviews/exists/{userId}/{hotelId}")
    public ResponseEntity<Review> alreadyReviewed(@PathVariable int userId,@PathVariable int hotelId){
    	return ResponseEntity.ok(reviewService.alreadyReviewed(userId,hotelId));
    	
    }
    
    @GetMapping("/user/previews/exists/{userId}/{packageId}")
    public ResponseEntity<Review> alreadyReviewedPackage(@PathVariable int userId,@PathVariable int packageId){
    	return ResponseEntity.ok(reviewService.alreadyReviewedPackage(userId,packageId));
    	
    }
    
    @GetMapping("/user/freviews/exists/{userId}/{flightId}")
    public ResponseEntity<Review> alreadyReviewedFlight(@PathVariable int userId,@PathVariable int flightId){
    	return ResponseEntity.ok(reviewService.alreadyReviewedFlight(userId,flightId));
    	
    }
}

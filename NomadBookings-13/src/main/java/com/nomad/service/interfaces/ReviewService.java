package com.nomad.service.interfaces;

import java.util.List;

import com.nomad.dto.ReviewRequestDTO;
import com.nomad.dto.ReviewResponseDTO;
import com.nomad.model.Review;

public interface ReviewService {
  
    List<ReviewResponseDTO> getAllReviews();
    void deleteReview(Long reviewId);

    ReviewResponseDTO submitReview(ReviewRequestDTO requestDTO);

   
    double getAverageHotelRating(Long hotelId);
    double getAverageFlightRating(Long flightId);
    double getAveragePackageRating(Long packageId);

    
    List<ReviewResponseDTO> getReviewsByHotel(Long hotelId);
    List<ReviewResponseDTO> getReviewsByFlight(Long flightId);
    List<ReviewResponseDTO> getReviewsByPackage(Long packageId);
    
    Review alreadyReviewed(int userId,int hotelId);
    Review alreadyReviewedPackage(int userId,int packageId);
    Review alreadyReviewedFlight(int userId,int flightId);
}

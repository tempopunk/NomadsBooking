package com.nomad.service.Implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.nomad.Repository.ReviewRepository;
import com.nomad.dto.ReviewRequestDTO;
import com.nomad.dto.ReviewResponseDTO;
import com.nomad.exception.ReviewNotFoundException;
import com.nomad.model.Review;
import com.nomad.service.interfaces.ReviewService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepository reviewRepository;

    @Override
    public List<ReviewResponseDTO> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        log.info("Fetched {} reviews from the database", reviews.size());
        return reviews.stream()
                .map(review -> new ReviewResponseDTO(
                        review.getReviewId(),
                        review.getUserId(),
                        review.getHotelId(),
                        review.getFlightId(),
                        review.getPackageId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponseDTO submitReview(ReviewRequestDTO requestDTO) {
        Review review = new Review();
        review.setUserId(requestDTO.getUserId());
        review.setHotelId(requestDTO.getHotelId());
        review.setFlightId(requestDTO.getFlightId());
        review.setPackageId(requestDTO.getPackageId());
        review.setRating(requestDTO.getRating());
        review.setComment(requestDTO.getComment());

        Review savedReview = reviewRepository.save(review);
        log.info("Review submitted successfully with ID: {}", savedReview.getReviewId());
        return new ReviewResponseDTO(
                savedReview.getReviewId(),
                savedReview.getUserId(),
                savedReview.getHotelId(),
                savedReview.getFlightId(),
                savedReview.getPackageId(),
                savedReview.getRating(),
                savedReview.getComment(),
                savedReview.getCreatedAt());
    }

    @Override
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            log.error("Review not found with ID: {}", reviewId);
            throw new ReviewNotFoundException("Review not found with ID: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
        log.info("Review deleted successfully with ID: {}", reviewId);
    }

    @Override
    public double getAverageHotelRating(Long hotelId) {
        return reviewRepository.findByHotelId(hotelId)
                .stream()
                .mapToInt(Review::getRating)
                .average()
                .orElseThrow(() -> {
                    log.error("No reviews found for hotel ID: {}", hotelId);
                    return new ReviewNotFoundException("No reviews found for hotel ID: " + hotelId);
                });
    }

    @Override
    public double getAverageFlightRating(Long flightId) {
        return reviewRepository.findByFlightId(flightId)
                .stream()
                .mapToInt(Review::getRating)
                .average()
                .orElseThrow(() -> new ReviewNotFoundException("No reviews found for flight ID: " + flightId));
    }

    @Override
    public double getAveragePackageRating(Long packageId) {
        return reviewRepository.findByPackageId(packageId)
                .stream()
                .mapToInt(Review::getRating)
                .average()
                .orElseThrow(() -> new ReviewNotFoundException("No reviews found for package ID: " + packageId));
    }
    @Override
    public List<ReviewResponseDTO> getReviewsByHotel(Long hotelId) {
        List<Review> reviews = reviewRepository.findByHotelId(hotelId);
        if (reviews.isEmpty()) {
            log.error("No reviews found for hotel ID: {}", hotelId);
            throw new ReviewNotFoundException("No reviews found for hotel ID: " + hotelId);
        }
        return reviews.stream()
                .map(review -> new ReviewResponseDTO(
                        review.getReviewId(),
                        review.getUserId(),
                        review.getHotelId(),
                        review.getFlightId(),
                        review.getPackageId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByFlight(Long flightId) {
        List<Review> reviews = reviewRepository.findByFlightId(flightId);
        if (reviews.isEmpty()) {
            log.error("No reviews found for flight ID: {}", flightId);
            throw new ReviewNotFoundException("No reviews found for flight ID: " + flightId);
        }
        return reviews.stream()
                .map(review -> new ReviewResponseDTO(
                        review.getReviewId(),
                        review.getUserId(),
                        review.getHotelId(),
                        review.getFlightId(),
                        review.getPackageId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponseDTO> getReviewsByPackage(Long packageId) {
        List<Review> reviews = reviewRepository.findByPackageId(packageId);
        if (reviews.isEmpty()) {
            log.error("No reviews found for package ID: {}", packageId);
            throw new ReviewNotFoundException("No reviews found for package ID: " + packageId);
        }
        return reviews.stream()
                .map(review -> new ReviewResponseDTO(
                        review.getReviewId(),
                        review.getUserId(),
                        review.getHotelId(),
                        review.getFlightId(),
                        review.getPackageId(),
                        review.getRating(),
                        review.getComment(),
                        review.getCreatedAt()))
                .collect(Collectors.toList());
    }
    
    public Review alreadyReviewed(int userId,int hotelId){
    	Review review = reviewRepository.findByUserIdAndHotelId(userId,hotelId);
    	return review;
    	
    }
    public Review alreadyReviewedPackage(int userId,int packageId){
    	Review review = reviewRepository.findByUserIdAndPackageId(userId,packageId);
    	return review;
    	
    }
    
    public Review alreadyReviewedFlight(int userId,int flightId){
    	Review review = reviewRepository.findByUserIdAndFlightId(userId,flightId);
    	return review;
    	
    }
}

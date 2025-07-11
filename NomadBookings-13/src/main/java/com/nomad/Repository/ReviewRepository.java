package com.nomad.Repository;

import com.nomad.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByHotelId(Long hotelId);
    List<Review> findByFlightId(Long flightId);
    List<Review> findByPackageId(Long packageId);
    Review findByUserIdAndHotelId(int userId,int hotelId);
    Review findByUserIdAndPackageId(int userId,int packageId);
    Review findByUserIdAndFlightId(int userId,int flightId);
}

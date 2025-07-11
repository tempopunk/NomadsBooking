package com.nomads.service;



import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;


import com.nomads.dto.BookingResourceDto;
import com.nomads.dto.CreatePackageBookingDto;
import com.nomads.dto.HotelDto;
import com.nomads.dto.PaymentInitiationRequestDTO;
import com.nomads.dto.PaymentResponseDTO;
import com.nomads.dto.RoomDto;
import com.nomads.dto.SendBookingDataDto;
import com.nomads.entity.Booking;
import com.nomads.entity.Hotel;
import com.nomads.entity.HotelImage;
import com.nomads.entity.Room;
import com.nomads.entity.RoomImage;
import com.nomads.entity.enums.BookingStatus;
import com.nomads.exception.HotelsNotFoundException;
import com.nomads.exception.ResourceNotFoundException;
import com.nomads.repository.BookingRepository;
import com.nomads.repository.HotelImageRepository;
import com.nomads.repository.HotelRepository;
import com.nomads.repository.RoomImageRepository;
import com.nomads.repository.RoomRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class HotelService{
	
	
	private final HotelRepository hotelRepository;
	
	
	private final AuthFeignProxy authFeignProxy;
	
	private final PaymentFeignProxy paymentFeignProxy;
	
	
	private final RoomRepository roomRepository;
	
	
	private final BookingRepository bookingRepository;
	
	
	private final HotelImageRepository hotelImageRepository;
	
	
	private final RoomImageRepository roomImageRepository;
	
	public List<Hotel> searchByLocation(String location){
		List<Hotel> hotels = hotelRepository.findByLocation(location);
		if(hotels.isEmpty()) {
			log.info("No hotels are found for given location");
			throw new HotelsNotFoundException("Hotels not found for the given location");
		}
		log.info("Fetched the hotels succesfully for the given location");
		return hotels;
				
		
	}
	
	public Hotel searchById(int id){
		return hotelRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + id));
				
		
	}
	
	public Room searchRoomById(int id){
		return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
				
		
	}
	
	public List<Hotel> sortByAscend(String location){
		List<Hotel> hotels = hotelRepository.findByLocationOrderByCostRangeAsc(location);
		if(hotels.isEmpty()) {
			log.info("No hotels are found for given location");
			throw new HotelsNotFoundException("Hotels not found for the given location");
		}
		log.info("Fetched the hotels succesfully for the given location in ascending order of price");
		
		return hotels;
	}
	
	public List<Hotel> sortByDescend(String location){
		List<Hotel> hotels = hotelRepository.findByLocationOrderByCostRangeDesc(location);
		if(hotels.isEmpty()) {
			log.info("No hotels are found for given location");
			throw new HotelsNotFoundException("Hotels not found for the given location");
		}
		log.info("Fetched the hotels succesfully for the given location in descending order of price");
		
		return hotels;
	}
	
	public List<Room> viewRooms(int hotel_id){
		Hotel hotel = null;
		hotel = hotelRepository.findById(hotel_id)
				.orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotel_id));
		List<Room> rooms = hotel.getRooms();
		if(rooms.isEmpty()) {
			log.info("no rooms are not found");
			throw new ResourceNotFoundException("currently no rooms available for booking ");
		}
		log.info("rooms fetched successfully");
		return hotel.getRooms();
	}
	
	public PaymentResponseDTO checkOut(int userId,int hotel_id, int room_id) {
		
		Hotel hotel = null;
		Room room = null;
		
		hotel = hotelRepository.findById(hotel_id)
				.orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + room_id));
		room = roomRepository.findById(room_id)
				.orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + room_id));
		
		Booking booking = new Booking(userId,hotel,room,"HOTEL",BookingStatus.PENDING,LocalDate.now(),room.getPricePerNight());
		
		try {
			booking = bookingRepository.save(booking);
		}
		catch(IllegalArgumentException e) {
			throw new IllegalArgumentException("Error creating a the booking");
		}
		PaymentInitiationRequestDTO paymentInitiationRequestDTO = new PaymentInitiationRequestDTO(booking.getBookingId(),userId,booking.getTotalAmount());
		
		ResponseEntity<PaymentResponseDTO> responseEntity = paymentFeignProxy.initiatePayment(paymentInitiationRequestDTO);			
		
		log.info("The booking has been created successfully");
		return responseEntity.getBody();
		
	}
	
	public String addRoom( int hotel_id,RoomDto roomDto) {
		Hotel hotel = null;
		hotel = hotelRepository.findById(hotel_id)
				.orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotel_id));;
		
		Room room = new Room(roomDto.getRoomName(),roomDto.getRoomType(),roomDto.getMaxOccupancy(),roomDto.getPricePerNight(),roomDto.getFoodOption(),roomDto.getAmmenities(),hotel);
		hotel.getRooms().add(room);
		hotelRepository.save(hotel);
		log.info("room added succesfully");
		
		return "room added succesfully";
	}
	
	public String addHotel(int agentId,HotelDto hotelDto) {
		
		
		Hotel hotel = new Hotel(hotelDto.getName(),hotelDto.getLocation(),hotelDto.getType(),hotelDto.getLowerCost(),hotelDto.getUpperCost(),hotelDto.getCostRange(),false);
		hotelRepository.save(hotel);
		authFeignProxy.linkId("Hotel", agentId, hotel.getHotelId());
		
		
		log.info("hotel added succesfully");
		
		return "hotel added succesfully";
	}
	
	@Transactional
	public String deleteRoom(int room_id,int hotelId){
		
		Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
		
		Room room = roomRepository.findById(room_id)
				.orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + room_id));
		
		hotel.getRooms().remove(room);
		hotelRepository.save(hotel);
		
		
		return "room deleted succusfully";
	}
	
	@Transactional 
    public Hotel addHotelImages(int hotelId, List<MultipartFile> files) throws IOException {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        List<HotelImage> newImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                HotelImage hotelImage = new HotelImage();
                hotelImage.setImageData(file.getBytes());
                hotelImage.setFileName(file.getOriginalFilename());
                hotelImage.setContentType(file.getContentType());
                hotelImage.setHotel(hotel); 
                newImages.add(hotelImage);
            }
        }
        hotel.getImages().addAll(newImages);

        return hotelRepository.save(hotel);
    }
	
	@Transactional
    public void deleteHotelImage(int hotelId, Long imageId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));

        HotelImage imageToDelete = hotelImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel image not found with ID: " + imageId));

        // Ensure the image actually belongs to the specified hotel
        if (imageToDelete.getHotel().getHotelId() != hotelId) {
            throw new IllegalArgumentException("Image ID " + imageId + " does not belong to Hotel ID " + hotelId);
        }

       
        hotel.getImages().remove(imageToDelete);
        hotelRepository.save(hotel); // Save the hotel to apply the change
    }
	
	// Read-only transactions are more efficient
    public List<HotelImage> getHotelImages(int hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with ID: " + hotelId));
        // The images are lazily fetched, so accessing getImages() within a transaction loads them.
        return new ArrayList<>(hotel.getImages()); // Return a copy to prevent external modification
    }
    
    
    public HotelImage getHotelImageById(Long imageId) {
        return hotelImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel image not found with ID: " + imageId));
    }
    
    
    public List<RoomImage> getRoomImages(int roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));
        // The images are lazily fetched, so accessing getImages() within a transaction loads them.
        return new ArrayList<>(room.getImages()); // Return a copy to prevent external modification
    }
    
    
    
    
    @Transactional
    public Room addRoomImages(int roomId, List<MultipartFile> files) throws IOException {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        List<RoomImage> newImages = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                RoomImage roomImage = new RoomImage();
                roomImage.setImageData(file.getBytes());
                roomImage.setFileName(file.getOriginalFilename());
                roomImage.setContentType(file.getContentType());
                roomImage.setRoom(room); // Establish the relationship
                newImages.add(roomImage);
            }
        }

        // Add new images to the room's collection
        room.getImages().addAll(newImages);

        // Due to CascadeType.ALL, saving the room will persist the new images
        return roomRepository.save(room);
    }
    
    @Transactional
    public void deleteRoomImage(int roomId, Long imageId) {
        Room room =roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + roomId));

        RoomImage imageToDelete = roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Room image not found with ID: " + imageId));

        // Ensure the image actually belongs to the specified room
        if (imageToDelete.getRoom().getRoomId() != roomId) {
            throw new IllegalArgumentException("Image ID " + imageId + " does not belong to Room ID " + roomId);
        }
        room.getImages().remove(imageToDelete);
        roomRepository.save(room); // Save the hotel to apply the change
	
    }
    
    
    public RoomImage getRoomImageById(Long imageId) {
        return roomImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Room image not found with ID: " + imageId));
    }
    
    public int getHotelId(String hotelName) {
    	Optional<Hotel> hotels =hotelRepository.findByHotelName(hotelName);
    	if(hotels.isPresent()) {
    		return hotels.get().getHotelId();
    	}
		return 0;
	}
    
	public int getRoomId(String roomName) {
		Optional<Room> rooms = roomRepository.findByRoomName(roomName);
		if(rooms.isPresent()) {
			return rooms.get().getRoomId();
		}
		return 0;
	}
	
	public SendBookingDataDto createPackageBooking(CreatePackageBookingDto createPackageBookingDto) {
		Booking booking = new Booking(createPackageBookingDto.getUserId(),"PACKAGE",createPackageBookingDto.getPackageId(),BookingStatus.PENDING,LocalDate.now(),createPackageBookingDto.getPrice());
		booking = bookingRepository.save(booking);
		SendBookingDataDto sendBookingDataDto = new SendBookingDataDto(booking.getBookingId(), booking.getTotalAmount());
		return sendBookingDataDto;
	}
	
	public boolean updateBooking(Long bookingId,BookingStatus status) {
		Optional<Booking> bookings = bookingRepository.findById(bookingId);
		if(bookings.isPresent()) {
			Booking booking = bookings.get();
			booking.setStatus(status);
			bookingRepository.save(booking);
			return true;
		}
		return false;
	}
	
	public BookingResourceDto getentityId( int bookingId) {
		BookingResourceDto bookingResourceDto = new BookingResourceDto();
		Long lng = (long)bookingId;
		Booking booking = bookingRepository.findById(lng)
				.orElseThrow(() -> new ResourceNotFoundException("booking not found with ID: " + lng));
		if(booking.getBookingType().equals("HOTEL")) {
			bookingResourceDto.setId(booking.getHotel().getHotelId());
			bookingResourceDto.setType("HOTEL");
			
		}
		else if(booking.getBookingType().equals("PACKAGE")) {
			bookingResourceDto.setId(booking.getPackageId());
			bookingResourceDto.setType("PACKAGE");
		}
		else {
			bookingResourceDto.setId(booking.getFlight().getFlightId());
			bookingResourceDto.setType("FLIGHT");
		}
		
		return bookingResourceDto;
		
	}
	
	public List<Booking> viewPendingBooking(int userId) {
		List<Booking> booking = bookingRepository.findByUserIdAndStatus(userId,BookingStatus.PENDING);
		return booking;
	}
	
	public List<Booking> viewPaidBooking(int userId) {
		List<Booking> booking = bookingRepository.findByUserIdAndStatus(userId,BookingStatus.PAID);
		return booking;
	}
	
	public List<Booking> viewHotelBooking(int hotelId) {
		List<Booking> booking = bookingRepository.findByHotel_HotelId(hotelId);
		return booking;
	}
	
	public List<Booking> viewFlightBooking(int hotelId) {
		List<Booking> booking = bookingRepository.findByFlight_FlightId(hotelId);
		return booking;
	}
	
	public List<Booking> viewPackageBooking(int hotelId) {
		List<Booking> booking = bookingRepository.findByPackageId(hotelId);
		return booking;
	}
	
	
}
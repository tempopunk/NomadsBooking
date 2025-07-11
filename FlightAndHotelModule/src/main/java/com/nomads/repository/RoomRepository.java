package com.nomads.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nomads.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {

	Optional<Room> findByRoomName(String roomName);

}

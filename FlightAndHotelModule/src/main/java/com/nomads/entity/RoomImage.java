package com.nomads.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class RoomImage  extends AuditableBaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Use Long for ID in separate entities

    @Lob // Stores the image data as a BLOB
    @Column(name = "image_data", columnDefinition = "MEDIUMBLOB")
    private byte[] imageData;

    private String fileName; // Optional: store original file name
    private String contentType; // Optional: store content type (e.g., "image/jpeg")

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id") // Foreign key to Room entity
    @JsonIgnore // Prevent infinite recursion when serializing RoomImage
    private Room room; // Many-to-one relationship with Room
}
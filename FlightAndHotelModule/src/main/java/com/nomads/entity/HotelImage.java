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
public class HotelImage extends AuditableBaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique ID for each image

    @Lob // Stores the image data as a BLOB
    @Column(name = "image_data", columnDefinition = "MEDIUMBLOB")
    private byte[] imageData;

    private String fileName;    // Optional: store the original file name
    private String contentType; // Optional: store the MIME type (e.g., "image/jpeg", "image/png")

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id") // This is the foreign key column in the HotelImage table
    @JsonIgnore // Important to prevent infinite recursion when serializing
    private Hotel hotel; // Many HotelImages can belong to one Hotel
}
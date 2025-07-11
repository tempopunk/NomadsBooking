package com.nomad.model;

import java.math.BigDecimal;
import java.time.Instant;


import com.nomad.model.auditing.AuditableBaseEntity;
import com.nomad.model.enums.PaymentMethod;
import com.nomad.model.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payments")
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "paymentId", callSuper = false)
public class Payment extends AuditableBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = false)
    private Long bookingId; 

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 3)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private PaymentMethod paymentMethod;

    @Column(unique = true, length = 255)
    private String transactionId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus paymentStatus;

    @Column(nullable = false)
    private Instant paymentTimestamp = Instant.now();

    @Column(length = 4)
    private String cardLastFourDigits;

    @Column(length = 50)
    private String cardType;

    @Column(length = 100)
    private String bankName;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;
}

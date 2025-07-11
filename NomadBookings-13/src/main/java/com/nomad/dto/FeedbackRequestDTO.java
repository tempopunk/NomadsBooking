package com.nomad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackRequestDTO {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "Feedback text cannot be blank")
    private String feedbackText;
}

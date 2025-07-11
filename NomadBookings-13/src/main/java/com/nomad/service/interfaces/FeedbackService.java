package com.nomad.service.interfaces;

import com.nomad.dto.FeedbackRequestDTO;
import com.nomad.dto.FeedbackResponseDTO;
import java.util.List;

public interface FeedbackService {
    FeedbackResponseDTO submitFeedback(FeedbackRequestDTO requestDTO); // ✅ Returns DTO instead of entity
    List<FeedbackResponseDTO> getAllFeedback(); // ✅ Returns DTO instead of entity
}

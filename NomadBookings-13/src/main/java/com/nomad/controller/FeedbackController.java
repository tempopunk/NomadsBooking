package com.nomad.controller;

import com.nomad.dto.FeedbackRequestDTO;
import com.nomad.dto.FeedbackResponseDTO;
import com.nomad.service.interfaces.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/feedback")
@RequiredArgsConstructor
@Tag(name = "Feedback Controller", description = "Handles user feedback operations") // ✅ Adds a tag for Swagger UI
public class FeedbackController {
    private final FeedbackService feedbackService;

    @PostMapping("/user/feedback")
    public ResponseEntity<FeedbackResponseDTO> submitFeedback(@RequestBody FeedbackRequestDTO requestDTO) {
        return ResponseEntity.ok(feedbackService.submitFeedback(requestDTO));
    }

    @GetMapping("/admin/feedback")
    public ResponseEntity<List<FeedbackResponseDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}

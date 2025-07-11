package com.nomad.service.Implementation;

import com.nomad.dto.FeedbackRequestDTO;
import com.nomad.dto.FeedbackResponseDTO;
import com.nomad.model.Feedback;
import com.nomad.Repository.FeedbackRepository;
import com.nomad.service.interfaces.FeedbackService;
import com.nomad.exception.FeedbackNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j  
public class FeedbackServiceImpl implements FeedbackService {
    private final FeedbackRepository feedbackRepository;

    @Override
    public FeedbackResponseDTO submitFeedback(FeedbackRequestDTO requestDTO) {
        Feedback feedback = new Feedback();
        feedback.setUserId(requestDTO.getUserId());
        feedback.setFeedbackText(requestDTO.getFeedbackText());

        Feedback savedFeedback = feedbackRepository.save(feedback);
        log.info("Feedback submitted successfully with ID: {}", savedFeedback.getFeedbackId());  // ✅ Logging added

        return new FeedbackResponseDTO(savedFeedback.getFeedbackId(), savedFeedback.getUserId(), savedFeedback.getFeedbackText());
    }

    @Override
    public List<FeedbackResponseDTO> getAllFeedback() {
        List<Feedback> feedbackList = feedbackRepository.findAll();
        if (feedbackList.isEmpty()) {  // ✅ Exception handling added
            log.error("No feedback found in the database.");
            throw new FeedbackNotFoundException("No feedback found.");
        }

        List<FeedbackResponseDTO> feedbackDTOs = new ArrayList<>();
        for (Feedback feedback : feedbackList) {
            feedbackDTOs.add(new FeedbackResponseDTO(feedback.getFeedbackId(), feedback.getUserId(), feedback.getFeedbackText()));
        }

        log.info("Fetched {} feedback entries from the database", feedbackDTOs.size());  // ✅ Logging added
        return feedbackDTOs;
    }
}

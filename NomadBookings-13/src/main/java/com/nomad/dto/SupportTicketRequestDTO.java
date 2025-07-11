package com.nomad.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupportTicketRequestDTO {

    @NotNull(message = "User ID cannot be null")
    private Long userId;

    @NotBlank(message = "Issue description cannot be blank")
    private String issue;

//    @NotNull(message = "Status cannot be null")
//    private TicketStatus status;
//
//    private Long assignedAgentId;
   

}

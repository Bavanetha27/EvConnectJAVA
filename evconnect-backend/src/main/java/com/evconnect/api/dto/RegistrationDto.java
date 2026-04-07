package com.evconnect.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RegistrationDto {
    private String id;
    
    private String userId;

    @NotBlank
    private String eventId;

    private LocalDateTime registrationDate;

    private String status;
}

package com.evconnect.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReportDto {

    @NotBlank
    private String eventId;

    @NotBlank
    private String reason;
}

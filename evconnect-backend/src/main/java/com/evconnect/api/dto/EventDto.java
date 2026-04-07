package com.evconnect.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventDto {
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private LocalDateTime date;

    @NotBlank
    private String location;

    @NotBlank
    private String category;

    private String organizerId;
}

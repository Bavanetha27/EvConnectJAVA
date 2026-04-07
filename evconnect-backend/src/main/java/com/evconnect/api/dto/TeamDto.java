package com.evconnect.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class TeamDto {
    private String id;

    @NotBlank
    private String name;

    private String leaderId;

    private List<String> memberIds;
    
    @NotBlank
    private String eventId;
}

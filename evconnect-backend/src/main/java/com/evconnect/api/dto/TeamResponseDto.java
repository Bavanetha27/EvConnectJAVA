package com.evconnect.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamResponseDto {
    private String id;
    private String name;
    private String leaderId;
    private String leaderName;
    private String eventId;
    private String teamCode;
    private List<TeamMemberDto> members;
}

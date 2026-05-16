package com.evconnect.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMemberDto implements Serializable {
    private static final long serialVersionUID = 1L;
    private String id;
    private String username;
}

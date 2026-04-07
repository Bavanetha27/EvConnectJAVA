package com.evconnect.api.controller;

import com.evconnect.api.dto.TeamDto;
import com.evconnect.api.dto.TeamResponseDto;
import com.evconnect.api.security.UserDetailsImpl;
import com.evconnect.api.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<TeamResponseDto> createTeam(@Valid @RequestBody TeamDto dto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(teamService.createTeam(dto, userDetails.getId()));
    }

    @PostMapping("/join-code")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<TeamResponseDto> joinTeamByCode(@RequestBody Map<String, String> payload, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(teamService.joinTeamByCode(payload.get("teamCode"), userDetails.getId()));
    }
    
    @DeleteMapping("/{teamId}/members/{memberId}")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<TeamResponseDto> removeTeamMember(@PathVariable String teamId, @PathVariable String memberId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(teamService.removeMember(teamId, memberId, userDetails.getId()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<List<TeamResponseDto>> getMyTeams(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(teamService.getMyTeams(userDetails.getId()));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<TeamResponseDto>> getTeamsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(teamService.getTeamsByEvent(eventId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TeamResponseDto>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }
}

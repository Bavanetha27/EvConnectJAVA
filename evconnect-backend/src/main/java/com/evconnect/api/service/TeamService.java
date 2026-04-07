package com.evconnect.api.service;

import com.evconnect.api.dto.TeamDto;
import com.evconnect.api.dto.TeamMemberDto;
import com.evconnect.api.dto.TeamResponseDto;
import com.evconnect.api.model.Team;
import com.evconnect.api.repository.EventRepository;
import com.evconnect.api.repository.TeamRepository;
import com.evconnect.api.repository.UserRepository;
import com.evconnect.api.repository.RegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;

    public TeamResponseDto createTeam(TeamDto dto, String leaderId) {
        // 1. Must be registered for the event
        registrationRepository.findByUserIdAndEventId(leaderId, dto.getEventId())
                .orElseThrow(() -> new RuntimeException("You must be registered for the event to create a team"));

        // 2. Must not already be in a team for this event
        if (teamRepository.findByEventIdAndMemberIdsContaining(dto.getEventId(), leaderId).isPresent()) {
            throw new RuntimeException("You are already in a team for this event");
        }

        eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<String> members = new ArrayList<>();
        members.add(leaderId);

        Team team = Team.builder()
                .name(dto.getName())
                .leaderId(leaderId)
                .eventId(dto.getEventId())
                .memberIds(members)
                .teamCode(generateTeamCode())
                .build();

        return mapToResponseDto(teamRepository.save(team));
    }

    private String generateTeamCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < 6; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public TeamResponseDto joinTeamByCode(String teamCode, String userId) {
        Team team = teamRepository.findByTeamCode(teamCode)
                .orElseThrow(() -> new RuntimeException("Invalid team code"));

        // 1. Must be registered for the event
        registrationRepository.findByUserIdAndEventId(userId, team.getEventId())
                .orElseThrow(() -> new RuntimeException("You must be registered for the event to join a team"));

        // 2. Must not already be in a team for this event
        if (teamRepository.findByEventIdAndMemberIdsContaining(team.getEventId(), userId).isPresent()) {
            throw new RuntimeException("You are already in a team for this event");
        }

        if (!team.getMemberIds().contains(userId)) {
            team.getMemberIds().add(userId);
            return mapToResponseDto(teamRepository.save(team));
        }
        
        throw new RuntimeException("Already a member of this team");
    }

    public TeamResponseDto removeMember(String teamId, String memberId, String leaderId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getLeaderId().equals(leaderId)) {
            throw new RuntimeException("Only the team leader can remove members");
        }

        if (memberId.equals(leaderId)) {
            throw new RuntimeException("The leader cannot be removed from their own team");
        }

        if (team.getMemberIds().contains(memberId)) {
            team.getMemberIds().remove(memberId);
            return mapToResponseDto(teamRepository.save(team));
        }

        throw new RuntimeException("User is not a member of this team");
    }

    public List<TeamResponseDto> getMyTeams(String userId) {
        return teamRepository.findByMemberIdsContaining(userId)
                .stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    public List<TeamResponseDto> getTeamsByEvent(String eventId) {
        return teamRepository.findByEventId(eventId)
                .stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    public List<TeamResponseDto> getAllTeams() {
        return teamRepository.findAll()
                .stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    private TeamResponseDto mapToResponseDto(Team team) {
        List<String> memberIds = team.getMemberIds();
        if (memberIds == null) memberIds = new ArrayList<>();

        List<TeamMemberDto> memberDtos = memberIds.stream()
                .map(id -> {
                    String username = userRepository.findById(id)
                            .map(u -> u.getUsername())
                            .orElse("Unknown User");
                    return new TeamMemberDto(id, username);
                })
                .collect(Collectors.toList());

        String leaderName = team.getLeaderId() != null 
                ? userRepository.findById(team.getLeaderId())
                    .map(u -> u.getUsername())
                    .orElse("Unknown Leader")
                : "Unknown Leader";

        return TeamResponseDto.builder()
                .id(team.getId())
                .name(team.getName())
                .leaderId(team.getLeaderId())
                .leaderName(leaderName)
                .eventId(team.getEventId())
                .teamCode(team.getTeamCode())
                .members(memberDtos)
                .build();
    }
}

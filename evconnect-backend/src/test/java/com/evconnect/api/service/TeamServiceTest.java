package com.evconnect.api.service;

import com.evconnect.api.dto.TeamDto;
import com.evconnect.api.dto.TeamResponseDto;
import com.evconnect.api.model.Event;
import com.evconnect.api.model.Registration;
import com.evconnect.api.model.Team;
import com.evconnect.api.model.User;
import com.evconnect.api.repository.EventRepository;
import com.evconnect.api.repository.RegistrationRepository;
import com.evconnect.api.repository.TeamRepository;
import com.evconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RegistrationRepository registrationRepository;

    @InjectMocks
    private TeamService teamService;

    private String leaderId = "leader123";
    private String eventId = "event123";
    private TeamDto teamDto;
    private Team testTeam;

    @BeforeEach
    void setUp() {
        teamDto = new TeamDto();
        teamDto.setName("Test Team");
        teamDto.setEventId(eventId);

        testTeam = Team.builder()
                .id("team123")
                .name("Test Team")
                .leaderId(leaderId)
                .eventId(eventId)
                .memberIds(new ArrayList<>(Collections.singletonList(leaderId)))
                .teamCode("ABC123")
                .build();
    }

    @Test
    void createTeam_Successful() {
        when(registrationRepository.findByUserIdAndEventId(leaderId, eventId))
                .thenReturn(Optional.of(new Registration()));
        when(teamRepository.findByEventIdAndMemberIdsContaining(eventId, leaderId))
                .thenReturn(Optional.empty());
        when(eventRepository.findById(eventId))
                .thenReturn(Optional.of(Event.builder().id(eventId).build()));
        when(teamRepository.save(any(Team.class))).thenReturn(testTeam);
        when(userRepository.findById(leaderId)).thenReturn(Optional.of(User.builder().username("leader").build()));

        TeamResponseDto result = teamService.createTeam(teamDto, leaderId);

        assertNotNull(result);
        assertEquals("Test Team", result.getName());
        verify(teamRepository).save(any(Team.class));
    }

    @Test
    void createTeam_NotRegistered_ShouldThrowException() {
        when(registrationRepository.findByUserIdAndEventId(leaderId, eventId))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> teamService.createTeam(teamDto, leaderId));
    }

    @Test
    void joinTeamByCode_Successful() {
        String teamCode = "ABC123";
        String userId = "user456";
        when(teamRepository.findByTeamCode(teamCode)).thenReturn(Optional.of(testTeam));
        when(registrationRepository.findByUserIdAndEventId(userId, eventId))
                .thenReturn(Optional.of(new Registration()));
        when(teamRepository.findByEventIdAndMemberIdsContaining(eventId, userId))
                .thenReturn(Optional.empty());
        when(teamRepository.save(any(Team.class))).thenReturn(testTeam);
        when(userRepository.findById(anyString())).thenReturn(Optional.of(User.builder().username("name").build()));

        TeamResponseDto result = teamService.joinTeamByCode(teamCode, userId);

        assertNotNull(result);
        assertTrue(testTeam.getMemberIds().contains(userId));
    }

    @Test
    void removeMember_Successful() {
        String memberId = "user456";
        testTeam.getMemberIds().add(memberId);
        when(teamRepository.findById("team123")).thenReturn(Optional.of(testTeam));
        when(teamRepository.save(any(Team.class))).thenReturn(testTeam);
        when(userRepository.findById(anyString())).thenReturn(Optional.of(User.builder().username("name").build()));

        teamService.removeMember("team123", memberId, leaderId);

        assertFalse(testTeam.getMemberIds().contains(memberId));
    }

    @Test
    void removeMember_NotLeader_ShouldThrowException() {
        when(teamRepository.findById("team123")).thenReturn(Optional.of(testTeam));
        assertThrows(RuntimeException.class, () -> 
            teamService.removeMember("team123", "memberId", "not-the-leader"));
    }
}

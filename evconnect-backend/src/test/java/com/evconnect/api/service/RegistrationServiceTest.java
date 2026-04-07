package com.evconnect.api.service;

import com.evconnect.api.model.Event;
import com.evconnect.api.model.Registration;
import com.evconnect.api.repository.EventRepository;
import com.evconnect.api.repository.RegistrationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrationRepository;

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private RegistrationService registrationService;

    private Event testEvent;
    private Registration testRegistration;
    private String userId = "user123";
    private String eventId = "event123";

    @BeforeEach
    void setUp() {
        testEvent = Event.builder().id(eventId).build();
        testRegistration = Registration.builder()
                .id("reg123")
                .userId(userId)
                .eventId(eventId)
                .status("CONFIRMED")
                .build();
    }

    @Test
    void registerForEvent_Successful() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(testEvent));
        when(registrationRepository.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.empty());
        when(registrationRepository.save(any(Registration.class))).thenReturn(testRegistration);

        Registration result = registrationService.registerForEvent(eventId, userId);

        assertNotNull(result);
        assertEquals("CONFIRMED", result.getStatus());
        verify(registrationRepository).save(any(Registration.class));
    }

    @Test
    void registerForEvent_EventNotFound_ShouldThrowException() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> registrationService.registerForEvent(eventId, userId));
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    void registerForEvent_AlreadyRegistered_ShouldThrowException() {
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(testEvent));
        when(registrationRepository.findByUserIdAndEventId(userId, eventId)).thenReturn(Optional.of(testRegistration));

        assertThrows(RuntimeException.class, () -> registrationService.registerForEvent(eventId, userId));
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    void cancelRegistration_Successful() {
        when(registrationRepository.findById("reg123")).thenReturn(Optional.of(testRegistration));
        when(registrationRepository.save(any(Registration.class))).thenReturn(testRegistration);

        registrationService.cancelRegistration("reg123", userId);

        assertEquals("CANCELLED", testRegistration.getStatus());
        verify(registrationRepository).save(testRegistration);
    }

    @Test
    void cancelRegistration_Unauthorized_ShouldThrowException() {
        when(registrationRepository.findById("reg123")).thenReturn(Optional.of(testRegistration));

        assertThrows(RuntimeException.class, () -> registrationService.cancelRegistration("reg123", "otherUser"));
        verify(registrationRepository, never()).save(any(Registration.class));
    }

    @Test
    void getMyRegistrations_ShouldReturnList() {
        when(registrationRepository.findByUserId(userId)).thenReturn(Arrays.asList(testRegistration));

        List<Registration> result = registrationService.getMyRegistrations(userId);

        assertEquals(1, result.size());
        verify(registrationRepository).findByUserId(userId);
    }
}

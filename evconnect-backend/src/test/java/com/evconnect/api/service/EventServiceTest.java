package com.evconnect.api.service;

import com.evconnect.api.dto.EventDto;
import com.evconnect.api.model.Event;
import com.evconnect.api.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    private Event testEvent;
    private EventDto testDto;
    private String organizerId = "org123";

    @BeforeEach
    void setUp() {
        testEvent = Event.builder()
                .id("1")
                .title("Test Event")
                .description("Description")
                .date(LocalDateTime.now())
                .location("Online")
                .category("Tech")
                .organizerId(organizerId)
                .build();

        testDto = new EventDto();
        testDto.setTitle("Updated Title");
        testDto.setDescription("Updated description");
        testDto.setDate(LocalDateTime.now().plusDays(1));
        testDto.setLocation("New York");
        testDto.setCategory("Business");
    }

    @Test
    void createEvent_ShouldSaveAndReturnEvent() {
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        Event created = eventService.createEvent(testDto, organizerId);

        assertNotNull(created);
        assertEquals(organizerId, created.getOrganizerId());
        verify(eventRepository).save(any(Event.class));
    }

    @Test
    void getAllEvents_ShouldReturnList() {
        when(eventRepository.findAll()).thenReturn(Arrays.asList(testEvent));

        List<Event> events = eventService.getAllEvents();

        assertEquals(1, events.size());
        verify(eventRepository).findAll();
    }

    @Test
    void getEventById_WhenExists_ShouldReturnEvent() {
        when(eventRepository.findById("1")).thenReturn(Optional.of(testEvent));

        Event event = eventService.getEventById("1");

        assertNotNull(event);
        assertEquals("Test Event", event.getTitle());
    }

    @Test
    void getEventById_WhenNotExists_ShouldThrowException() {
        when(eventRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> eventService.getEventById("2"));
    }

    @Test
    void updateEvent_WhenAuthorized_ShouldUpdateAndSave() {
        when(eventRepository.findById("1")).thenReturn(Optional.of(testEvent));
        when(eventRepository.save(any(Event.class))).thenReturn(testEvent);

        Event updated = eventService.updateEvent("1", testDto, organizerId);

        assertNotNull(updated);
        assertEquals("Updated Title", testEvent.getTitle());
        verify(eventRepository).save(testEvent);
    }

    @Test
    void updateEvent_WhenNotAuthorized_ShouldThrowException() {
        when(eventRepository.findById("1")).thenReturn(Optional.of(testEvent));

        assertThrows(RuntimeException.class, () -> eventService.updateEvent("1", testDto, "otherOrg"));
        verify(eventRepository, never()).save(any(Event.class));
    }

    @Test
    void deleteEvent_WhenAuthorized_ShouldDelete() {
        when(eventRepository.findById("1")).thenReturn(Optional.of(testEvent));

        eventService.deleteEvent("1", organizerId);

        verify(eventRepository).delete(testEvent);
    }

    @Test
    void deleteEvent_WhenNotAuthorized_ShouldThrowException() {
        when(eventRepository.findById("1")).thenReturn(Optional.of(testEvent));

        assertThrows(RuntimeException.class, () -> eventService.deleteEvent("1", "otherOrg"));
        verify(eventRepository, never()).delete(any(Event.class));
    }
}

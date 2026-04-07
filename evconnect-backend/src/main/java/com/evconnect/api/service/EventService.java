package com.evconnect.api.service;

import com.evconnect.api.dto.EventDto;
import com.evconnect.api.model.Event;
import com.evconnect.api.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(EventDto dto, String organizerId) {
        Event event = Event.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .date(dto.getDate())
                .location(dto.getLocation())
                .category(dto.getCategory())
                .organizerId(organizerId)
                .build();
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event updateEvent(String id, EventDto dto, String organizerId) {
        Event event = getEventById(id);

        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Not authorized to update this event");
        }

        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setDate(dto.getDate());
        event.setLocation(dto.getLocation());
        event.setCategory(dto.getCategory());

        return eventRepository.save(event);
    }

    public void deleteEvent(String id, String organizerId) {
        Event event = getEventById(id);
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Not authorized to delete this event");
        }
        
        eventRepository.delete(event);
    }
}

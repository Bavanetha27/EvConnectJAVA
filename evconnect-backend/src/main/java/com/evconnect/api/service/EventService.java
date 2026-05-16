package com.evconnect.api.service;

import com.evconnect.api.dto.EventDto;
import com.evconnect.api.model.Event;
import com.evconnect.api.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    @CacheEvict(value = "events", allEntries = true)
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

    @Cacheable(value = "events")
    public List<Event> getAllEvents() {
        System.out.println(">>> [DEBUG] Cache Miss! Fetching events from MongoDB...");
        return eventRepository.findAll();
    }

    @Cacheable(value = "event", key = "#id")
    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    @CacheEvict(value = {"events", "event"}, allEntries = true)
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

    @CacheEvict(value = {"events", "event"}, allEntries = true)
    public void deleteEvent(String id, String userId, boolean isAdmin) {
        Event event = getEventById(id);
        
        if (!isAdmin && !event.getOrganizerId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this event");
        }
        
        eventRepository.delete(event);
    }
}

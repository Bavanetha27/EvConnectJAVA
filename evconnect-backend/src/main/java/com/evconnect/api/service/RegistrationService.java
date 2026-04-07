package com.evconnect.api.service;

import com.evconnect.api.model.Registration;
import com.evconnect.api.model.Event;
import com.evconnect.api.repository.RegistrationRepository;
import com.evconnect.api.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final EventRepository eventRepository;

    public Registration registerForEvent(String eventId, String userId) {
        eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (registrationRepository.findByUserIdAndEventId(userId, eventId).isPresent()) {
            throw new RuntimeException("Already registered for this event");
        }

        Registration registration = Registration.builder()
                .userId(userId)
                .eventId(eventId)
                .registrationDate(LocalDateTime.now())
                .status("CONFIRMED")
                .build();

        return registrationRepository.save(registration);
    }

    public void cancelRegistration(String registrationId, String userId) {
        Registration reg = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        if (!reg.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to cancel this registration");
        }

        reg.setStatus("CANCELLED");
        registrationRepository.save(reg);
    }

    public List<Registration> getMyRegistrations(String userId) {
        return registrationRepository.findByUserId(userId);
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
}

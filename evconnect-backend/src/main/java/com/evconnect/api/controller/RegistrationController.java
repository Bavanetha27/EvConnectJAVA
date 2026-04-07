package com.evconnect.api.controller;

import com.evconnect.api.model.Registration;
import com.evconnect.api.security.UserDetailsImpl;
import com.evconnect.api.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<Registration> register(@PathVariable String eventId, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(registrationService.registerForEvent(eventId, userDetails.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<?> cancelRegistration(@PathVariable String id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        registrationService.cancelRegistration(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<List<Registration>> getMyRegistrations(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(registrationService.getMyRegistrations(userDetails.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllRegistrations());
    }
}

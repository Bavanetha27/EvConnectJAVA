package com.evconnect.api.service;

import com.evconnect.api.dto.ReportDto;
import com.evconnect.api.model.Report;
import com.evconnect.api.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final com.evconnect.api.repository.EventRepository eventRepository;
    private final com.evconnect.api.repository.UserRepository userRepository;

    public Report createReport(ReportDto dto, String userId) {
        Report report = Report.builder()
                .eventId(dto.getEventId())
                .userId(userId)
                .reason(dto.getReason())
                .createdAt(LocalDateTime.now())
                .build();
        return reportRepository.save(report);
    }

    public List<Report> getAllReports() {
        List<Report> reports = reportRepository.findAll();
        reports.forEach(r -> {
            // For reports, user is kept as Anonymous as requested
            r.setUsername("Anonymous");
            
            try {
                eventRepository.findById(r.getEventId()).ifPresentOrElse(
                    event -> r.setEventName(event.getTitle()),
                    () -> {
                        System.err.println(">>> [DEBUG] Report lookup failed: Event ID " + r.getEventId() + " not found in DB.");
                        r.setEventName("Unknown Event");
                    }
                );
            } catch (Exception e) {
                r.setEventName("Error loading name");
            }
        });
        return reports;
    }

    public void deleteReport(String id) {
        reportRepository.deleteById(id);
    }
}

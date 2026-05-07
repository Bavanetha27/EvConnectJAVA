package com.evconnect.api.controller;

import com.evconnect.api.dto.ReportDto;
import com.evconnect.api.model.Report;
import com.evconnect.api.security.UserDetailsImpl;
import com.evconnect.api.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ORGANIZER')")
    public ResponseEntity<Report> createReport(@Valid @RequestBody ReportDto dto, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(reportService.createReport(dto, userDetails.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteReport(@PathVariable String id) {
        reportService.deleteReport(id);
        return ResponseEntity.ok().build();
    }
}

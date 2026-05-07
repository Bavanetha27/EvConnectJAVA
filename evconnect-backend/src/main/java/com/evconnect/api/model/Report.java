package com.evconnect.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "reports")
public class Report {

    @Id
    private String id;
    
    private String eventId;
    
    private String userId;
    
    private String reason;
    
    private LocalDateTime createdAt;
}

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
@Document(collection = "events")
public class Event {

    @Id
    private String id;
    
    private String title;
    
    private String description;
    
    private LocalDateTime date;
    
    private String location;
    
    private String category;
    
    private String organizerId;
}

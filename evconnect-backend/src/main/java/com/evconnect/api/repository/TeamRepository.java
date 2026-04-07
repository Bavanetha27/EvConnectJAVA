package com.evconnect.api.repository;

import com.evconnect.api.model.Team;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends MongoRepository<Team, String> {
    List<Team> findByEventId(String eventId);
    List<Team> findByMemberIdsContaining(String userId);
    Optional<Team> findByTeamCode(String teamCode);
    Optional<Team> findByEventIdAndMemberIdsContaining(String eventId, String userId);
}

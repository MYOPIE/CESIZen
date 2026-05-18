package fr.cesizen.api.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.cesizen.api.domain.entity.DifficultyLevel;

@Repository
// TODO : créer cette interface de repository pour l'entité DifficultyLevel
public interface DifficultyLevelRepository extends JpaRepository<DifficultyLevel, Long> {
    List<DifficultyLevel> findByIsPublishedTrue();
}

package fr.cesizen.api.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.cesizen.api.domain.entity.DifficultyLevel;

@Repository
public interface DifficultyLevelRepository extends JpaRepository<DifficultyLevel, Long> {
    boolean existsByName(String name);
}

package fr.cesizen.api.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.cesizen.api.domain.entity.Activity;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByIsActiveTrue();
    boolean existsByCategoryId(Long categoryId);
}

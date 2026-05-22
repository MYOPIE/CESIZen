package fr.cesizen.api.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fr.cesizen.api.domain.entity.Information;

@Repository
public interface InformationRepository extends JpaRepository<Information, Long> {
    List<Information> findByIsPublishedTrue();
    List<Information> findByCategoryId(Long categoryId);
    boolean existsByCategoryId(Long categoryId);
}

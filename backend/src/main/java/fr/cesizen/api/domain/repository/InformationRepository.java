package fr.cesizen.api.domain.repository;

import fr.cesizen.api.domain.entity.Information;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InformationRepository extends JpaRepository<Information, Long> {
    List<Information> findByIsPublishedTrue();
    List<Information> findByCategoryId(Long categoryId);
}

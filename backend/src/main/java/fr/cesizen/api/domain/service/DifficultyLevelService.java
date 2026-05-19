package fr.cesizen.api.domain.service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.DifficultyLevel;
import fr.cesizen.api.domain.repository.DifficultyLevelRepository;
import fr.cesizen.api.web.dto.DifficultyLevelRequest;
import fr.cesizen.api.web.dto.DifficultyLevelResponse;

@Service
@Transactional
public class DifficultyLevelService {

    private final DifficultyLevelRepository difficultyLevelRepository;

    public DifficultyLevelService(DifficultyLevelRepository difficultyLevelRepository) {
        this.difficultyLevelRepository = difficultyLevelRepository;
    }

    public DifficultyLevelResponse createDifficultyLevel(DifficultyLevelRequest request) {
        if (difficultyLevelRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Un niveau de difficulté avec ce nom existe déjà");
        }

        DifficultyLevel difficultyLevel = DifficultyLevel.builder()
                .name(request.getName())
                .build();

        DifficultyLevel saved = difficultyLevelRepository.save(difficultyLevel);
        return mapToResponse(saved);
    }

    public DifficultyLevelResponse getDifficultyLevelById(@NonNull Long id) {
        DifficultyLevel difficultyLevel = difficultyLevelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Niveau de difficulté non trouvé"));
        return mapToResponse(difficultyLevel);
    }

    public List<DifficultyLevelResponse> getAllDifficultyLevels() {
        return difficultyLevelRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public DifficultyLevelResponse updateDifficultyLevel(@NonNull Long id, DifficultyLevelRequest request) {
        DifficultyLevel difficultyLevel = difficultyLevelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Niveau de difficulté non trouvé"));

        if (!difficultyLevel.getName().equals(request.getName()) && difficultyLevelRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Un niveau de difficulté avec ce nom existe déjà");
        }

        difficultyLevel.setName(request.getName());

        DifficultyLevel updated = difficultyLevelRepository.save(difficultyLevel);
        return mapToResponse(updated);
    }

    public void deleteDifficultyLevel(@NonNull Long id) {
        DifficultyLevel difficultyLevel = difficultyLevelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Niveau de difficulté non trouvé"));
        difficultyLevelRepository.delete(difficultyLevel);
    }

    private DifficultyLevelResponse mapToResponse(DifficultyLevel difficultyLevel) {
        return DifficultyLevelResponse.builder()
                .id(difficultyLevel.getId())
                .name(difficultyLevel.getName())
                .build();
    }
}

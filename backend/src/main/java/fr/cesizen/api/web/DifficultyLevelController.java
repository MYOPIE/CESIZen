package fr.cesizen.api.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.cesizen.api.domain.service.DifficultyLevelService;
import fr.cesizen.api.web.dto.DifficultyLevelRequest;
import fr.cesizen.api.web.dto.DifficultyLevelResponse;

@RestController
@RequestMapping("/api/v1/difficulty-levels")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DifficultyLevelController {

    private final DifficultyLevelService difficultyLevelService;

    public DifficultyLevelController(DifficultyLevelService difficultyLevelService) {
        this.difficultyLevelService = difficultyLevelService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DifficultyLevelResponse> createDifficultyLevel(@RequestBody DifficultyLevelRequest request) {
        return new ResponseEntity<>(difficultyLevelService.createDifficultyLevel(request), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DifficultyLevelResponse> getDifficultyLevelById(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(difficultyLevelService.getDifficultyLevelById(id));
    }

    @GetMapping
    public ResponseEntity<List<DifficultyLevelResponse>> getAllDifficultyLevels() {
        return ResponseEntity.ok(difficultyLevelService.getAllDifficultyLevels());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DifficultyLevelResponse> updateDifficultyLevel(@PathVariable @NonNull Long id, @RequestBody DifficultyLevelRequest request) {
        return ResponseEntity.ok(difficultyLevelService.updateDifficultyLevel(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDifficultyLevel(@PathVariable @NonNull Long id) {
        difficultyLevelService.deleteDifficultyLevel(id);
        return ResponseEntity.noContent().build();
    }
}

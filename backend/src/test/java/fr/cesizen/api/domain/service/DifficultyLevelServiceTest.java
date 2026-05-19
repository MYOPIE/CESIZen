package fr.cesizen.api.domain.service;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.cesizen.api.domain.entity.DifficultyLevel;
import fr.cesizen.api.domain.repository.DifficultyLevelRepository;
import fr.cesizen.api.web.dto.DifficultyLevelRequest;
import fr.cesizen.api.web.dto.DifficultyLevelResponse;

@ExtendWith(MockitoExtension.class)
class DifficultyLevelServiceTest {

    @Mock
    private DifficultyLevelRepository repository;

    @InjectMocks
    private DifficultyLevelService service;

    @Test
    void createDifficultyLevel_whenNameExists_throws() {
        when(repository.existsByName("Easy")).thenReturn(true);

        DifficultyLevelRequest request = new DifficultyLevelRequest();
        request.setName("Easy");

        assertThrows(IllegalArgumentException.class, () -> service.createDifficultyLevel(request));
    }

    @Test
    void createDifficultyLevel_success() {
        when(repository.existsByName("Easy")).thenReturn(false);

        DifficultyLevel saved = new DifficultyLevel(1L, "Easy");
        when(repository.save(any(DifficultyLevel.class))).thenReturn(saved);

        DifficultyLevelRequest request = new DifficultyLevelRequest();
        request.setName("Easy");

        DifficultyLevelResponse response = service.createDifficultyLevel(request);

        assertEquals(1L, response.getId());
        assertEquals("Easy", response.getName());
    }

    @Test
    void getAllDifficultyLevels_mapsCorrectly() {
        when(repository.findAll()).thenReturn(List.of(new DifficultyLevel(1L, "Easy")));

        var list = service.getAllDifficultyLevels();

        assertEquals(1, list.size());
        assertEquals("Easy", list.get(0).getName());
    }
}

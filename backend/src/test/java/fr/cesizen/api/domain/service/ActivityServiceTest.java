package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.DifficultyLevel;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.domain.repository.DifficultyLevelRepository;
import fr.cesizen.api.web.dto.ActivityRequest;
import fr.cesizen.api.web.dto.ActivityResponse;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private DifficultyLevelRepository difficultyLevelRepository;

    @InjectMocks
    private ActivityService service;

    @Test
    void createActivity_success() {
        Activity activity = new Activity(
            1L, "Test Activity", "Description", "Content", "Instructions",
            true, null, LocalDateTime.now(), LocalDateTime.now(), 100, null
        );
        when(activityRepository.save(any(Activity.class))).thenReturn(activity);

        ActivityRequest request = new ActivityRequest();
        request.setTitle("Test Activity");
        request.setDescription("Description");
        request.setDurationMinutes(100);

        ActivityResponse response = service.createActivity(request);

        assertEquals(1L, response.getId());
        assertEquals("Test Activity", response.getTitle());
        assertEquals("Description", response.getDescription());
    }

    @Test
    void getActivityById_success() {
        Activity activity = new Activity(
            1L, "Test Activity", "Description", "Content", "Instructions",
            true, null, LocalDateTime.now(), LocalDateTime.now(), 100, null
        );
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));

        ActivityResponse response = service.getActivityById(1L);

        assertEquals(1L, response.getId());
        assertEquals("Test Activity", response.getTitle());
        assertEquals("Description", response.getDescription());
    }

    @Test
    void getActivityById_notFound_throws() {
        when(activityRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getActivityById(1L));
    }

    @Test
    void getAllActivities_mapsCorrectly() {
        Activity activity = new Activity(
            1L, "Test Activity", "Description", "Content", "Instructions",
            true, null, LocalDateTime.now(), LocalDateTime.now(), 100, null
        );
        when(activityRepository.findAll()).thenReturn(List.of(activity));

        var list = service.getAllActivities();

        assertEquals(1, list.size());
        assertEquals("Test Activity", list.get(0).getTitle());
        assertEquals("Description", list.get(0).getDescription());
    }
}
package fr.cesizen.api.domain.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.entity.DifficultyLevel;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.domain.repository.DifficultyLevelRepository;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.ActivityRequest;
import fr.cesizen.api.web.dto.ActivityResponse;
import fr.cesizen.api.web.dto.CategoryResponse;
import fr.cesizen.api.web.dto.DifficultyLevelResponse;

@Service
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CategoryRepository categoryRepository;
    private final DifficultyLevelRepository difficultyLevelRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ActivityService(ActivityRepository activityRepository, CategoryRepository categoryRepository, DifficultyLevelRepository difficultyLevelRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.categoryRepository = categoryRepository;
        this.difficultyLevelRepository = difficultyLevelRepository;
        this.userRepository = userRepository;
    }

    public ActivityResponse createActivity(ActivityRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        DifficultyLevel difficultyLevel = null;
        if (request.getDifficultyLevelId() != null) {
            difficultyLevel = difficultyLevelRepository.findById(request.getDifficultyLevelId())
                    .orElseThrow(() -> new IllegalArgumentException("Niveau de difficulté non trouvé"));
        }

        Activity activity = Activity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .instructions(request.getInstructions())
                .category(category)
                .difficultyLevel(difficultyLevel)
                .durationMinutes(request.getDurationMinutes())
                .isActive(true)
                .build();

        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    public ActivityResponse getActivityById(@NonNull Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        return mapToResponse(activity);
    }

    public List<ActivityResponse> getAllActivities() {
        return activityRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ActivityResponse> getActiveActivities() {
        return activityRepository.findByIsActiveTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ActivityResponse updateActivity(@NonNull Long id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        DifficultyLevel difficultyLevel = null;
        if (request.getDifficultyLevelId() != null) {
            difficultyLevel = difficultyLevelRepository.findById(request.getDifficultyLevelId())
                    .orElseThrow(() -> new IllegalArgumentException("Niveau de difficulté non trouvé"));
        }

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setContent(request.getContent());
        activity.setInstructions(request.getInstructions());
        activity.setCategory(category);
        activity.setDifficultyLevel(difficultyLevel);
        activity.setDurationMinutes(request.getDurationMinutes());

        Activity updatedActivity = activityRepository.save(activity);
        return mapToResponse(updatedActivity);
    }

    public void deleteActivity(@NonNull Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        activityRepository.delete(activity);
    }

    public void deactivateActivity(@NonNull Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        activity.setIsActive(false);
        activityRepository.save(activity);
    }

    public void reactivateActivity(@NonNull Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        activity.setIsActive(true);
        activityRepository.save(activity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        CategoryResponse categoryResponse = null;
        if (activity.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(activity.getCategory().getId())
                    .name(activity.getCategory().getName())
                    .type(activity.getCategory().getType())
                    .build();
        }

        DifficultyLevelResponse difficultyLevelResponse = null;
        if (activity.getDifficultyLevel() != null) {
            difficultyLevelResponse = DifficultyLevelResponse.builder()
                    .id(activity.getDifficultyLevel().getId())
                    .name(activity.getDifficultyLevel().getName())
                    .build();
        }

        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .content(activity.getContent())
                .instructions(activity.getInstructions())
                .isActive(activity.getIsActive())
                .category(categoryResponse)
                .durationMinutes(activity.getDurationMinutes())
                .difficultyLevel(difficultyLevelResponse)
                .createdAt(activity.getCreatedAt().format(formatter))
                .updatedAt(activity.getUpdatedAt().format(formatter))
                .build();
    }

    public List<ActivityResponse> getActivitiesWithFavoriteStatus(@NonNull Long userId) {
        List<Activity> activities = activityRepository.findAll();
        
        Set<Long> favoriteIds = userRepository.findById(userId)
                .map(user -> user.getFavoriteActivities().stream()
                        .map(Activity::getId)
                        .collect(Collectors.toSet()))
                .orElse(Set.of());
        
        return activities.stream()
                .map(activity -> {
                    ActivityResponse response = mapToResponse(activity);
                    response.setFavorite(favoriteIds.contains(activity.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }
}

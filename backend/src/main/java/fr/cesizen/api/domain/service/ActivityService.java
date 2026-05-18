package fr.cesizen.api.domain.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.web.dto.ActivityRequest;
import fr.cesizen.api.web.dto.ActivityResponse;
import fr.cesizen.api.web.dto.CategoryResponse;

@Service
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CategoryRepository categoryRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ActivityService(ActivityRepository activityRepository, CategoryRepository categoryRepository) {
        this.activityRepository = activityRepository;
        this.categoryRepository = categoryRepository;
    }

    public ActivityResponse createActivity(ActivityRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        Activity activity = Activity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .instructions(request.getInstructions())
                .category(category)
                .isActive(true)
                .build();

        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    public ActivityResponse getActivityById(Long id) {
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

    public ActivityResponse updateActivity(Long id, ActivityRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setContent(request.getContent());
        activity.setInstructions(request.getInstructions());
        activity.setCategory(category);

        Activity updatedActivity = activityRepository.save(activity);
        return mapToResponse(updatedActivity);
    }

    public void deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        activityRepository.delete(activity);
    }

    // TODO : mettre en place un bouton de désactivation pour les activités (invisible pour les utilisateurs) et un bouton de réactivation pour les réactiver
    public void deactivateActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        activity.setIsActive(false);
        activityRepository.save(activity);
    }

    public void reactivateActivity(Long id) {
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

        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .content(activity.getContent())
                .instructions(activity.getInstructions())
                .isActive(activity.getIsActive())
                .category(categoryResponse)
                .createdAt(activity.getCreatedAt().format(formatter))
                .updatedAt(activity.getUpdatedAt().format(formatter))
                .build();
    }
}

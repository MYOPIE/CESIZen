package fr.cesizen.api.domain.service;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.web.dto.ActivityRequest;
import fr.cesizen.api.web.dto.ActivityResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class ActivityService {

    private final ActivityRepository activityRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public ActivityResponse createActivity(ActivityRequest request) {
        Activity activity = Activity.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .instructions(request.getInstructions())
                .isActive(true)
                .build();

        Activity savedActivity = activityRepository.save(activity);
        return mapToResponse(savedActivity);
    }

    public ActivityResponse getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
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
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));

        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setContent(request.getContent());
        activity.setInstructions(request.getInstructions());

        Activity updatedActivity = activityRepository.save(activity);
        return mapToResponse(updatedActivity);
    }

    public void deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
        activityRepository.delete(activity);
    }

    public void deactivateActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
        activity.setIsActive(false);
        activityRepository.save(activity);
    }

    public void reactivateActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
        activity.setIsActive(true);
        activityRepository.save(activity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .title(activity.getTitle())
                .description(activity.getDescription())
                .content(activity.getContent())
                .instructions(activity.getInstructions())
                .isActive(activity.getIsActive())
                .createdAt(activity.getCreatedAt().format(formatter))
                .updatedAt(activity.getUpdatedAt().format(formatter))
                .build();
    }
}

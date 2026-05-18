package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.ActivityResponse;

@Service
@Transactional
public class FavoriteService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public FavoriteService(UserRepository userRepository, ActivityRepository activityRepository) {
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    public void addFavorite(Long userId, Long activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        
        user.getFavoriteActivities().add(activity);
        userRepository.save(user);
    }

    public void removeFavorite(Long userId, Long activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        
        user.getFavoriteActivities().remove(activity);
        userRepository.save(user);
    }

    public List<ActivityResponse> getFavoriteActivities(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        return user.getFavoriteActivities().stream()
                .map(activity -> {
                    // Create a simplified response for favorites
                    return ActivityResponse.builder()
                            .id(activity.getId())
                            .title(activity.getTitle())
                            .description(activity.getDescription())
                            .content(activity.getContent())
                            .instructions(activity.getInstructions())
                            .isActive(activity.getIsActive())
                            .durationMinutes(activity.getDurationMinutes())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
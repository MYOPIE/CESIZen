package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.Information;
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.ActivityResponse;
import fr.cesizen.api.web.dto.InformationResponse;

@Service
@Transactional
public class FavoriteService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final InformationRepository informationRepository;

    public FavoriteService(UserRepository userRepository, ActivityRepository activityRepository, InformationRepository informationRepository) {
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.informationRepository = informationRepository;
    }

    public void addFavorite(@NonNull Long userId, @NonNull Long activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        
        user.getFavoriteActivities().add(activity);
        userRepository.save(user);
    }

    public void removeFavorite(@NonNull Long userId, @NonNull Long activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new IllegalArgumentException("Activité non trouvée"));
        
        user.getFavoriteActivities().remove(activity);
        userRepository.save(user);
    }

    public List<ActivityResponse> getFavoriteActivities(@NonNull Long userId) {
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

    public void addFavoriteInformation(@NonNull Long userId, @NonNull Long informationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Information info = informationRepository.findById(informationId)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        
        user.getFavoriteInformations().add(info);
        userRepository.save(user);
    }

    public void removeFavoriteInformation(@NonNull Long userId, @NonNull Long informationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        Information info = informationRepository.findById(informationId)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        
        user.getFavoriteInformations().remove(info);
        userRepository.save(user);
    }

    public List<InformationResponse> getFavoriteInformations(@NonNull Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        
        return user.getFavoriteInformations().stream()
                .map(info -> InformationResponse.builder()
                        .id(info.getId())
                        .title(info.getTitle())
                        .content(info.getContent())
                        .isPublished(info.getIsPublished())
                        .readingTime(info.getReadingTime())
                        .build())
                .collect(Collectors.toList());
    }
}
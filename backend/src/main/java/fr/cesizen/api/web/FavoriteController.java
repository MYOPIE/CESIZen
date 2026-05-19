package fr.cesizen.api.web;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.cesizen.api.domain.service.FavoriteService;
import fr.cesizen.api.web.dto.ActivityResponse;
import fr.cesizen.api.web.dto.InformationResponse;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/users/{userId}/activities/{activityId}")
    public ResponseEntity<Void> addFavorite(@PathVariable @NonNull Long userId, @PathVariable @NonNull Long activityId) {
        favoriteService.addFavorite(userId, activityId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}/activities/{activityId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable @NonNull Long userId, @PathVariable @NonNull Long activityId) {
        favoriteService.removeFavorite(userId, activityId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<ActivityResponse>> getFavoriteActivities(@PathVariable @NonNull Long userId) {
        List<ActivityResponse> activities = favoriteService.getFavoriteActivities(userId);
        return ResponseEntity.ok(activities);
    }

    @PostMapping("/users/{userId}/informations/{informationId}")
    public ResponseEntity<Void> addFavoriteInformation(@PathVariable @NonNull Long userId, @PathVariable @NonNull Long informationId) {
        favoriteService.addFavoriteInformation(userId, informationId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}/informations/{informationId}")
    public ResponseEntity<Void> removeFavoriteInformation(@PathVariable @NonNull Long userId, @PathVariable @NonNull Long informationId) {
        favoriteService.removeFavoriteInformation(userId, informationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{userId}/informations")
    public ResponseEntity<List<InformationResponse>> getFavoriteInformations(@PathVariable @NonNull Long userId) {
        List<InformationResponse> informations = favoriteService.getFavoriteInformations(userId);
        return ResponseEntity.ok(informations);
    }
}
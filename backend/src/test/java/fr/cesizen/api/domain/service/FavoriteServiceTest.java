package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.Optional;
import java.util.HashSet;

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
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.web.dto.ActivityResponse;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private InformationRepository informationRepository;

    @InjectMocks
    private FavoriteService service;

    @Test
    void addFavorite_success() {
        User user = new User();
        user.setId(1L);
        user.setFavoriteActivities(new HashSet<>());

        Activity activity = new Activity();
        activity.setId(1L);
        activity.setTitle("Test Activity");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
        when(userRepository.save(any(User.class))).thenReturn(user);

        service.addFavorite(1L, 1L);

        assertEquals(1, user.getFavoriteActivities().size());
    }

    @Test
    void removeFavorite_success() {
        User user = new User();
        user.setId(1L);
        Activity activity = new Activity();
        activity.setId(1L);
        user.setFavoriteActivities(new HashSet<>(List.of(activity)));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(activityRepository.findById(1L)).thenReturn(Optional.of(activity));
        when(userRepository.save(any(User.class))).thenReturn(user);

        service.removeFavorite(1L, 1L);

        assertEquals(0, user.getFavoriteActivities().size());
    }

    @Test
    void getFavoriteActivities_returnsActivities() {
        User user = new User();
        user.setId(1L);
        Activity activity = new Activity();
        activity.setId(1L);
        activity.setTitle("Test Activity");
        activity.setDescription("Description");
        user.setFavoriteActivities(new HashSet<>(List.of(activity)));

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        List<ActivityResponse> activities = service.getFavoriteActivities(1L);

        assertEquals(1, activities.size());
    }

    @Test
    void addFavorite_userNotFound_throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.addFavorite(1L, 1L));
    }
}
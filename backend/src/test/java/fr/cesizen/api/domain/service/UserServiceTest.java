package fr.cesizen.api.domain.service;

import java.util.HashSet;
import java.util.Optional;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.Information;
import fr.cesizen.api.domain.entity.Role;
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.UserRegisterRequest;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService service;

    @Test
    void deleteUser_clearsFavoritesBeforeDelete() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setPassword("hashed");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setFavoriteActivities(new HashSet<>());
        user.setFavoriteInformations(new HashSet<>());

        Activity activity = new Activity();
        activity.setId(10L);
        Information information = new Information();
        information.setId(20L);
        user.getFavoriteActivities().add(activity);
        user.getFavoriteInformations().add(information);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        service.deleteUser(1L);

        assertEquals(0, user.getFavoriteActivities().size());
        assertEquals(0, user.getFavoriteInformations().size());
        verify(userRepository).deleteById(1L);
    }

    @Test
    void getEmailById_returnsEmail() {
        User user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        assertEquals("user@example.com", service.getEmailById(1L));
    }

    @Test
    void deleteUser_userNotFound_throws() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Throwable throwable = assertThrows(IllegalArgumentException.class, () -> service.deleteUser(1L));
        assertEquals("Utilisateur non trouvé", throwable.getMessage());
    }

    @Test
    void updateUser_updatesEmailAndProfile() {
        User user = new User();
        user.setId(1L);
        user.setEmail("old@example.com");
        user.setFirstName("Old");
        user.setLastName("Name");
        user.setPassword("hashed");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserRegisterRequest request = new UserRegisterRequest(
                "new@example.com",
                "New",
                "Name",
                "Password1",
                "Password1"
        );

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("hashed-new-password");
        when(userRepository.save(user)).thenReturn(user);

        service.updateUser(1L, request);

        assertEquals("new@example.com", user.getEmail());
        assertEquals("New", user.getFirstName());
        assertEquals("Name", user.getLastName());
        verify(userRepository).save(user);
    }

    @Test
    void updateUser_updatesEmailWithCurrentPassword() {
        User user = new User();
        user.setId(1L);
        user.setEmail("old@example.com");
        user.setFirstName("Old");
        user.setLastName("Name");
        user.setPassword("hashed-password");
        user.setRole(Role.USER);
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        UserRegisterRequest request = new UserRegisterRequest(
                "new@example.com",
                "Old",
                "Name",
                "",
                ""
        );
        request.setCurrentPassword("current-password");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current-password", "hashed-password")).thenReturn(true);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.save(user)).thenReturn(user);

        service.updateUser(1L, request);

        assertEquals("new@example.com", user.getEmail());
        verify(userRepository).save(user);
    }
}
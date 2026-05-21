package fr.cesizen.api.domain.service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Role;
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.UserRegisterRequest;
import fr.cesizen.api.web.dto.UserResponse;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @SuppressWarnings("null")
    public UserResponse registerUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
        }

        User user = User.builder()
                .email(request.getEmail())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .isActive(true)
                .build();

        return mapToResponse(userRepository.save(user));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserResponse getUserById(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        return mapToResponse(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public long countUsers() {
        return userRepository.count();
    }

    @SuppressWarnings("null")
    public UserResponse updateUser(@NonNull Long id, UserRegisterRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        boolean emailChanged = request.getEmail() != null && !request.getEmail().isBlank() && !request.getEmail().equals(user.getEmail());
        boolean passwordChanged = request.getPassword() != null && !request.getPassword().isEmpty();

        if (emailChanged && !passwordChanged) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                throw new IllegalArgumentException("Veuillez renseigner votre mot de passe actuel pour valider le changement d'email");
            }

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Mot de passe actuel incorrect");
            }
        }

        if (emailChanged) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Cet email est déjà utilisé");
            }
            user.setEmail(request.getEmail());
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        if (passwordChanged) {
            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new IllegalArgumentException("Les mots de passe ne correspondent pas");
            }
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToResponse(userRepository.save(user));
    }

    public void deleteUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        clearUserFavorites(user);
        userRepository.deleteById(id);
    }

    public String getEmailById(@NonNull Long id) {
        return userRepository.findById(id)
                .map(User::getEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
    }

    public void deactivateUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setIsActive(false);
        userRepository.save(user);
    }

    public void promoteToAdmin(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setRole(Role.ADMIN);
        userRepository.save(user);
    }

    public void demoteFromAdmin(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setRole(Role.USER);
        userRepository.save(user);
    }

    public void reactivateUser(@NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));
        user.setIsActive(true);
        userRepository.save(user);
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().getValue())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt().format(formatter))
                .updatedAt(user.getUpdatedAt().format(formatter))
                .build();
    }

    private void clearUserFavorites(User user) {
        if (user.getFavoriteActivities() != null) {
            user.getFavoriteActivities().clear();
        }

        if (user.getFavoriteInformations() != null) {
            user.getFavoriteInformations().clear();
        }
    }
}

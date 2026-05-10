package fr.cesizen.api.web;

import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.service.UserService;
import fr.cesizen.api.web.dto.AuthResponse;
import fr.cesizen.api.web.dto.UserLoginRequest;
import fr.cesizen.api.web.dto.UserRegisterRequest;
import fr.cesizen.api.web.dto.UserResponse;
import org.springframework.http.HttpStatus;
import fr.cesizen.api.config.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        try {
            UserResponse user = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(AuthResponse.builder()
                            .user(user)
                            .message("Utilisateur enregistré avec succès")
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(AuthResponse.builder()
                            .message(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        Optional<User> userOpt = userService.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(AuthResponse.builder()
                            .message("Adresse e-mail non reconnue.")
                            .build());
        }

        User user = userOpt.get();
        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            UserResponse userResponse = UserResponse.builder()
                    .id(user.getId())
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole().getValue())
                    .isActive(user.getIsActive())
                    .createdAt(user.getCreatedAt().format(formatter))
                    .updatedAt(user.getUpdatedAt().format(formatter))
                    .build();

            String token = jwtUtils.generateToken(user.getEmail(), user.getRole().getValue());

            return ResponseEntity.ok(AuthResponse.builder()
                    .user(userResponse)
                    .token(token)
                    .message("Connexion réussie")
                    .build());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(AuthResponse.builder()
                        .message("Mot de passe incorrect.")
                        .build());
    }
}

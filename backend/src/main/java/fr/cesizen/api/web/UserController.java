package fr.cesizen.api.web;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fr.cesizen.api.domain.service.UserService;
import fr.cesizen.api.web.dto.UserRegisterRequest;
import fr.cesizen.api.web.dto.UserResponse;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable @NonNull Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable @NonNull Long id, @RequestBody UserRegisterRequest request) {
        try {
            return ResponseEntity.ok(userService.updateUser(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable @NonNull Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilisateur supprimé avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable @NonNull Long id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok("Utilisateur désactivé avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }

    @PutMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateUser(@PathVariable @NonNull Long id) {
        try {
            userService.reactivateUser(id);
            return ResponseEntity.ok("Utilisateur réactivé avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }

    @PutMapping("/{id}/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@PathVariable @NonNull Long id) {
        try {
            userService.promoteToAdmin(id);
            return ResponseEntity.ok("Utilisateur promu administrateur");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }

    @PutMapping("/{id}/demote-admin")
    public ResponseEntity<?> demoteFromAdmin(@PathVariable @NonNull Long id) {
        try {
            userService.demoteFromAdmin(id);
            return ResponseEntity.ok("Le rôle d'administrateur a été retiré à l'utilisateur");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Utilisateur non trouvé");
        }
    }
}

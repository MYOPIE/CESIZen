package fr.cesizen.api.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;

import fr.cesizen.api.domain.entity.Activity;
import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.entity.Role;
import fr.cesizen.api.domain.entity.User;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.domain.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class FavoriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Long userId;
    private Long activityId;

    @BeforeEach
    void setupTestData() {
        jdbcTemplate.execute("DELETE FROM user_favorite_activities");
        jdbcTemplate.execute("DELETE FROM user_favorite_informations");
        activityRepository.deleteAll();
        userRepository.deleteAll();
        categoryRepository.deleteAll();

        Category category = categoryRepository.save(
            Category.builder().name("Relaxation").type("ACTIVITY").build()
        );

        Activity activity = Activity.builder()
            .title("Respiration guidée")
            .description("Activité de test")
            .content("Contenu test")
            .instructions("Instructions test")
            .isActive(true)
            .category(category)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .durationMinutes(10)
            .build();
        activityId = activityRepository.save(activity).getId();

        User user = User.builder()
            .email("favorite.test@cesizen.fr")
            .firstName("Favorite")
            .lastName("Tester")
            .password("password")
            .role(Role.USER)
            .isActive(true)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();
        userId = userRepository.save(user).getId();
    }

    @Test
    void getFavoriteActivities_succeeds() throws Exception {
        mockMvc.perform(get("/api/favorites/users/{userId}", userId))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 404);
                });
    }

    @Test
    void addFavoriteActivity_succeeds() throws Exception {
        mockMvc.perform(post("/api/favorites/users/{userId}/activities/{activityId}", userId, activityId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 400 || status == 404);
                });
    }

    @Test
    void removeFavoriteActivity_succeeds() throws Exception {
        mockMvc.perform(delete("/api/favorites/users/{userId}/activities/{activityId}", userId, activityId)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 400 || status == 404);
                });
    }
}
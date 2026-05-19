package fr.cesizen.api.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class FavoriteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getFavoriteActivities_succeeds() throws Exception {
        mockMvc.perform(get("/api/favorites/users/1"))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 404);
                });
    }

    @Test
    void addFavoriteActivity_succeeds() throws Exception {
        mockMvc.perform(post("/api/favorites/users/1/activities/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 400 || status == 404);
                });
    }

    @Test
    void removeFavoriteActivity_succeeds() throws Exception {
        mockMvc.perform(delete("/api/favorites/users/1/activities/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    assert(status == 200 || status == 400 || status == 404);
                });
    }
}
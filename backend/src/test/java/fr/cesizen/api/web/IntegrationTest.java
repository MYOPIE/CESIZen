package fr.cesizen.api.web;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void healthCheck_returnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk());
    }

    @Test
    void welcome_returnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/welcome"))
                .andExpect(status().isOk());
    }

    @Test
    void getAllControllers_exist() throws Exception {
        // Test that all main controllers are accessible
        mockMvc.perform(get("/api/v1/activities")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/categories")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/informations")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/favorites")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/users")).andExpect(status().isOk());
        mockMvc.perform(get("/api/v1/auth")).andExpect(status().isOk());
    }
}
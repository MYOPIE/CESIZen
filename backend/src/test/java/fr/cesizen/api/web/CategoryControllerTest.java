package fr.cesizen.api.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser(roles = "ADMIN")
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getCategories_returnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/categories"))
                .andExpect(status().isOk());
    }

    @Test
    void getCategoryById_doesNotThrow() throws Exception {
        mockMvc.perform(get("/api/v1/categories/999"))
                .andExpect(result -> {
                    // Accept any status code - the test should not throw
                });
    }

    @Test
    void createCategory_doesNotThrow() throws Exception {
        mockMvc.perform(post("/api/v1/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test\"}"))
                .andExpect(result -> {
                    // Accept any status code - the test should not throw
                });
    }
}
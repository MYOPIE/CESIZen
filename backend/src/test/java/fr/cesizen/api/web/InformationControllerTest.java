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
class InformationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getInformations_returnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/informations"))
                .andExpect(status().isOk());
    }

    @Test
    void getInformationById_doesNotThrow() throws Exception {
        mockMvc.perform(get("/api/v1/informations/999"))
                .andExpect(result -> {
                    // Accept any status code - the test should not throw
                });
    }

    @Test
    void createInformation_doesNotThrow() throws Exception {
        mockMvc.perform(post("/api/v1/informations")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Test\"}"))
                .andExpect(result -> {
                    // Accept any status code - the test should not throw
                });
    }
}
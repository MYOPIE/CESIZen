package fr.cesizen.api.web;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import fr.cesizen.api.application.usecase.WelcomeUseCase;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class WelcomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @TestConfiguration
    static class TestConfig {
        @Bean
        public WelcomeUseCase welcomeUseCase() {
            return new WelcomeUseCase() {
                @Override
                public String buildMessage(String firstName) {
                    return "Bienvenue " + firstName + " sur CESIZen";
                }

                @Override
                public Instant generatedAt() {
                    return Instant.parse("2020-01-01T00:00:00Z");
                }
            };
        }
    }

    @Test
    void status_returnsOK() throws Exception {
        mockMvc.perform(get("/api/v1/welcome/status"))
                .andExpect(status().isOk())
                .andExpect(content().string("OK"));
    }

    @Test
    void post_welcome_returnsMessageAndTimestamp() throws Exception {
        String body = "{\"firstName\":\"Pierre\"}";

        mockMvc.perform(post("/api/v1/welcome").contentType(MediaType.APPLICATION_JSON).content(body))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Bienvenue Pierre sur CESIZen"))
            .andExpect(jsonPath("$.timestamp").exists());
    }
}


package fr.cesizen.api.web;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import fr.cesizen.api.web.dto.UserLoginRequest;
import fr.cesizen.api.web.dto.UserRegisterRequest;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = Replace.ANY)
class AuthNonRegressionTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void register_then_login_success() {
        String base = "http://localhost:" + port + "/api/v1/auth";

        UserRegisterRequest register = new UserRegisterRequest("test@example.com", "Test", "User", "pass123", "pass123");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<UserRegisterRequest> regEntity = new HttpEntity<>(register, headers);

        ResponseEntity<String> regResp = restTemplate.postForEntity(base + "/register", regEntity, String.class);
        assertThat(regResp.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        UserLoginRequest login = new UserLoginRequest();
        login.setEmail("test@example.com");
        login.setPassword("pass123");
        HttpEntity<UserLoginRequest> loginEntity = new HttpEntity<>(login, headers);

        ResponseEntity<String> loginResp = restTemplate.postForEntity(base + "/login", loginEntity, String.class);
        assertThat(loginResp.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(loginResp.getBody()).contains("Connexion réussie");
    }
}

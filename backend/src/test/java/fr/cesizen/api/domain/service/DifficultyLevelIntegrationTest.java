package fr.cesizen.api.domain.service;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import fr.cesizen.api.domain.entity.DifficultyLevel;
import fr.cesizen.api.domain.repository.DifficultyLevelRepository;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = Replace.ANY)
class DifficultyLevelIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private DifficultyLevelRepository repository;

    @Test
    void getAll_returnsSavedLevels() {
        repository.deleteAll();
        DifficultyLevel saved = repository.save(new DifficultyLevel(null, "Medium"));

        ResponseEntity<DifficultyLevel[]> response = restTemplate.getForEntity("http://localhost:" + port + "/api/v1/difficulty-levels", DifficultyLevel[].class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).extracting("name").contains("Medium");
    }

    @Test
    void getById_returnsSavedLevel() {
        repository.deleteAll();
        DifficultyLevel saved = repository.save(new DifficultyLevel(null, "Hard"));

        ResponseEntity<DifficultyLevel> response = restTemplate.getForEntity("http://localhost:" + port + "/api/v1/difficulty-levels/" + saved.getId(), DifficultyLevel.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Hard");
    }
}

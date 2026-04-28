package fr.cesizen.api.web;

import java.time.Instant;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "application", "cesizen-backend",
                "timestamp", Instant.now().toString());
    }

    @GetMapping("/v1/system/health")
    public Map<String, Object> healthV1() {
        return health();
    }

    @GetMapping("/v1/system/info")
    public Map<String, Object> info() {
        return Map.of(
                "name", "CESIZen API",
                "version", "v1",
                "timestamp", Instant.now().toString());
    }
}

package fr.cesizen.api.web.dto;

import java.time.Instant;

public record WelcomeResponse(
        String message,
        Instant timestamp
) {
}

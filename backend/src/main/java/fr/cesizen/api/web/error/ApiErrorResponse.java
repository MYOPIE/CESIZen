package fr.cesizen.api.web.error;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String path,
        List<String> details
) {
}

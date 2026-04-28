package fr.cesizen.api.application.usecase;

import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class WelcomeUseCase {

    public String buildMessage(String firstName) {
        return "Bienvenue " + firstName + " sur CESIZen";
    }

    public Instant generatedAt() {
        return Instant.now();
    }
}

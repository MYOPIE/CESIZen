package fr.cesizen.api.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WelcomeRequest(
        @NotBlank(message = "Le prenom est obligatoire")
        @Size(max = 50, message = "Le prenom ne doit pas depasser 50 caracteres")
        String firstName
) {
}

package fr.cesizen.api.web;

import fr.cesizen.api.application.usecase.WelcomeUseCase;
import fr.cesizen.api.web.dto.WelcomeRequest;
import fr.cesizen.api.web.dto.WelcomeResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/welcome")
public class WelcomeController {

    private final WelcomeUseCase welcomeUseCase;

    public WelcomeController(WelcomeUseCase welcomeUseCase) {
        this.welcomeUseCase = welcomeUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.OK)
    public WelcomeResponse welcome(@Valid @RequestBody WelcomeRequest request) {
        return new WelcomeResponse(
                welcomeUseCase.buildMessage(request.firstName()),
                welcomeUseCase.generatedAt());
    }

    @GetMapping("/status")
    @ResponseStatus(HttpStatus.OK)
    public String status() {
        return "OK";
    }
}

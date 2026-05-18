package fr.cesizen.api.web;

import fr.cesizen.api.domain.service.InformationService;
import fr.cesizen.api.web.dto.InformationRequest;
import fr.cesizen.api.web.dto.InformationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/informations")
@CrossOrigin(origins = "http://localhost:4200")
public class InformationController {

    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createInformation(@RequestBody InformationRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(informationService.createInformation(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<InformationResponse>> getAllInformations() {
        return ResponseEntity.ok(informationService.getAllInformations());
    }

    @GetMapping("/published")
    public ResponseEntity<List<InformationResponse>> getPublishedInformations() {
        return ResponseEntity.ok(informationService.getPublishedInformations());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<InformationResponse>> getInformationsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(informationService.getInformationsByCategory(categoryId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInformationById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(informationService.getInformationById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information non trouvée");
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateInformation(@PathVariable Long id, @RequestBody InformationRequest request) {
        try {
            return ResponseEntity.ok(informationService.updateInformation(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information non trouvée");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteInformation(@PathVariable Long id) {
        try {
            informationService.deleteInformation(id);
            return ResponseEntity.ok("Information supprimée avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information non trouvée");
        }
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> publishInformation(@PathVariable Long id) {
        try {
            informationService.publishInformation(id);
            return ResponseEntity.ok("Information publiée avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information non trouvée");
        }
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unpublishInformation(@PathVariable Long id) {
        try {
            informationService.unpublishInformation(id);
            return ResponseEntity.ok("Information dépubliée avec succès");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information non trouvée");
        }
    }
}

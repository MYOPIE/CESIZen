package fr.cesizen.api.web;

import fr.cesizen.api.domain.service.InformationService;
import fr.cesizen.api.web.dto.InformationRequest;
import fr.cesizen.api.web.dto.InformationResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/category/{category}")
    public ResponseEntity<List<InformationResponse>> getInformationsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(informationService.getInformationsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getInformationById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(informationService.getInformationById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInformation(@PathVariable Long id, @RequestBody InformationRequest request) {
        try {
            return ResponseEntity.ok(informationService.updateInformation(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInformation(@PathVariable Long id) {
        try {
            informationService.deleteInformation(id);
            return ResponseEntity.ok("Information deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information not found");
        }
    }

    @PutMapping("/{id}/publish")
    public ResponseEntity<?> publishInformation(@PathVariable Long id) {
        try {
            informationService.publishInformation(id);
            return ResponseEntity.ok("Information published successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information not found");
        }
    }

    @PutMapping("/{id}/unpublish")
    public ResponseEntity<?> unpublishInformation(@PathVariable Long id) {
        try {
            informationService.unpublishInformation(id);
            return ResponseEntity.ok("Information unpublished successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Information not found");
        }
    }
}

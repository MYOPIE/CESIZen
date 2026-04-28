package fr.cesizen.api.web;

import fr.cesizen.api.domain.service.ActivityService;
import fr.cesizen.api.web.dto.ActivityRequest;
import fr.cesizen.api.web.dto.ActivityResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@CrossOrigin(origins = "http://localhost:4200")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public ResponseEntity<?> createActivity(@RequestBody ActivityRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(activityService.createActivity(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/active")
    public ResponseEntity<List<ActivityResponse>> getActiveActivities() {
        return ResponseEntity.ok(activityService.getActiveActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(activityService.getActivityById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Activity not found");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody ActivityRequest request) {
        try {
            return ResponseEntity.ok(activityService.updateActivity(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Activity not found");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        try {
            activityService.deleteActivity(id);
            return ResponseEntity.ok("Activity deleted successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Activity not found");
        }
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivateActivity(@PathVariable Long id) {
        try {
            activityService.deactivateActivity(id);
            return ResponseEntity.ok("Activity deactivated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Activity not found");
        }
    }

    @PutMapping("/{id}/reactivate")
    public ResponseEntity<?> reactivateActivity(@PathVariable Long id) {
        try {
            activityService.reactivateActivity(id);
            return ResponseEntity.ok("Activity reactivated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Activity not found");
        }
    }
}

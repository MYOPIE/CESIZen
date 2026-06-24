package fr.cesizen.api.domain.service;

import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.entity.Information;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.domain.repository.UserRepository;
import fr.cesizen.api.web.dto.CategoryResponse;
import fr.cesizen.api.web.dto.InformationRequest;
import fr.cesizen.api.web.dto.InformationResponse;

@Service
@Transactional
public class InformationService {

    private final InformationRepository informationRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public InformationService(InformationRepository informationRepository, CategoryRepository categoryRepository, UserRepository userRepository) {
        this.informationRepository = informationRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public InformationResponse createInformation(@NonNull InformationRequest request) {
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        Information information = Information.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(category)
                .isPublished(true)
                .readingTime(request.getReadingTime())
                .build();

        Information savedInformation = informationRepository.save(information);
        return mapToResponse(savedInformation);
    }

    public InformationResponse getInformationById(@NonNull Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        return mapToResponse(information);
    }

    public List<InformationResponse> getAllInformations() {
        return informationRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<InformationResponse> getPublishedInformations() {
        return informationRepository.findByIsPublishedTrue().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<InformationResponse> getInformationsByCategory(@NonNull Long categoryId) {
        return informationRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public InformationResponse updateInformation(@NonNull Long id, InformationRequest request) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        }

        information.setTitle(request.getTitle());
        information.setContent(request.getContent());
        information.setCategory(category);
        if(request.getReadingTime() != null) {
            information.setReadingTime(request.getReadingTime());
        }

        Information updatedInformation = informationRepository.save(information);
        return mapToResponse(updatedInformation);
    }

    public void deleteInformation(@NonNull Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        // Supprimer les références de cette information dans les favoris des utilisateurs
        userRepository.findAll().forEach(user -> {
            if (user.getFavoriteInformations() != null && user.getFavoriteInformations().remove(information)) {
                userRepository.save(user);
            }
        });

        informationRepository.delete(information);
    }

    public void publishInformation(@NonNull Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        information.setIsPublished(true);
        informationRepository.save(information);
    }

    public void unpublishInformation(@NonNull Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information non trouvée"));
        information.setIsPublished(false);
        informationRepository.save(information);
    }

    private InformationResponse mapToResponse(Information information) {
        CategoryResponse categoryResponse = null;
        if (information.getCategory() != null) {
             categoryResponse = CategoryResponse.builder()
                 .id(information.getCategory().getId())
                 .name(information.getCategory().getName())
                 .type(information.getCategory().getType())
                 .build();
        }

        return InformationResponse.builder()
                .id(information.getId())
                .title(information.getTitle())
                .content(information.getContent())
                .category(categoryResponse)
                .isPublished(information.getIsPublished())
                .readingTime(information.getReadingTime())
                .createdAt(information.getCreatedAt().format(formatter))
                .updatedAt(information.getUpdatedAt().format(formatter))
                .build();
    }
}

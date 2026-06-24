package fr.cesizen.api.domain.service;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.repository.ActivityRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.web.dto.CategoryRequest;
import fr.cesizen.api.web.dto.CategoryResponse;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ActivityRepository activityRepository;
    private final InformationRepository informationRepository;

    public CategoryService(CategoryRepository categoryRepository, ActivityRepository activityRepository, InformationRepository informationRepository) {
        this.categoryRepository = categoryRepository;
        this.activityRepository = activityRepository;
        this.informationRepository = informationRepository;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameAndType(request.getName(), request.getType())) {
            throw new IllegalArgumentException("Une catégorie avec ce nom et ce type existe déjà");
        }

        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    public CategoryResponse getCategoryById(@NonNull Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        return mapToResponse(category);
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CategoryResponse> getCategoriesByType(String type) {
        return categoryRepository.findByType(type).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CategoryResponse updateCategory(@NonNull Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));

        if ((!category.getName().equals(request.getName()) || !category.getType().equals(request.getType())) && categoryRepository.existsByNameAndType(request.getName(), request.getType())) {
            throw new IllegalArgumentException("Une catégorie avec ce nom et ce type existe déjà");
        }

        category.setName(request.getName());
        category.setType(request.getType());

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    public void deleteCategory(@NonNull Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catégorie non trouvée"));
        // Vérifier si la catégorie est utilisée par au moins une activité ou information
        boolean usedByActivities = activityRepository.existsByCategoryId(id);
        boolean usedByInformations = informationRepository.existsByCategoryId(id);

        if (usedByActivities || usedByInformations) {
            throw new IllegalArgumentException("Impossible de supprimer : la catégorie est utilisée par au moins une activité ou information");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .type(category.getType())
                .build();
    }
}

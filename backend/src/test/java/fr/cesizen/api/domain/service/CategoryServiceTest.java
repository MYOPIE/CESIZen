package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.cesizen.api.domain.entity.Category;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.web.dto.CategoryRequest;
import fr.cesizen.api.web.dto.CategoryResponse;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository repository;

    @InjectMocks
    private CategoryService service;

    @Test
    void createCategory_success() {
        Category category = new Category(1L, "Test Category", "TYPE1");
        when(repository.save(any(Category.class))).thenReturn(category);

        CategoryRequest request = new CategoryRequest();
        request.setName("Test Category");
        request.setType("TYPE1");

        CategoryResponse response = service.createCategory(request);

        assertEquals(1L, response.getId());
        assertEquals("Test Category", response.getName());
    }

    @Test
    void getCategoryById_success() {
        Category category = new Category(1L, "Test Category", "TYPE1");
        when(repository.findById(1L)).thenReturn(Optional.of(category));

        CategoryResponse response = service.getCategoryById(1L);

        assertEquals(1L, response.getId());
        assertEquals("Test Category", response.getName());
    }

    @Test
    void getCategoryById_notFound_throws() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getCategoryById(1L));
    }

    @Test
    void getAllCategories_mapsCorrectly() {
        Category category = new Category(1L, "Test Category", "TYPE1");
        when(repository.findAll()).thenReturn(List.of(category));

        var list = service.getAllCategories();

        assertEquals(1, list.size());
        assertEquals("Test Category", list.get(0).getName());
    }
}
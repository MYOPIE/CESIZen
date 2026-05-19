package fr.cesizen.api.domain.service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import fr.cesizen.api.domain.entity.Information;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.domain.repository.CategoryRepository;
import fr.cesizen.api.web.dto.InformationRequest;
import fr.cesizen.api.web.dto.InformationResponse;

@ExtendWith(MockitoExtension.class)
class InformationServiceTest {

    @Mock
    private InformationRepository informationRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private InformationService service;

    @Test
    void createInformation_success() {
        Information info = new Information(1L, "Test Info", "Content", null, true, 
                                          LocalDateTime.now(), LocalDateTime.now(), 5);
        when(informationRepository.save(any(Information.class))).thenReturn(info);

        InformationRequest request = new InformationRequest();
        request.setTitle("Test Info");
        request.setContent("Content");

        InformationResponse response = service.createInformation(request);

        assertEquals(1L, response.getId());
        assertEquals("Test Info", response.getTitle());
        assertEquals("Content", response.getContent());
    }

    @Test
    void getInformationById_success() {
        Information info = new Information(1L, "Test Info", "Content", null, true, 
                                          LocalDateTime.now(), LocalDateTime.now(), 5);
        when(informationRepository.findById(1L)).thenReturn(Optional.of(info));

        InformationResponse response = service.getInformationById(1L);

        assertEquals(1L, response.getId());
        assertEquals("Test Info", response.getTitle());
        assertEquals("Content", response.getContent());
    }

    @Test
    void getInformationById_notFound_throws() {
        when(informationRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> service.getInformationById(1L));
    }

    @Test
    void getAllInformations_mapsCorrectly() {
        Information info = new Information(1L, "Test Info", "Content", null, true, 
                                          LocalDateTime.now(), LocalDateTime.now(), 5);
        when(informationRepository.findAll()).thenReturn(List.of(info));

        var list = service.getAllInformations();

        assertEquals(1, list.size());
        assertEquals("Test Info", list.get(0).getTitle());
        assertEquals("Content", list.get(0).getContent());
    }
}
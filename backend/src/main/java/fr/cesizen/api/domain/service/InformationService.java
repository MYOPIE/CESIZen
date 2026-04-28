package fr.cesizen.api.domain.service;

import fr.cesizen.api.domain.entity.Information;
import fr.cesizen.api.domain.repository.InformationRepository;
import fr.cesizen.api.web.dto.InformationRequest;
import fr.cesizen.api.web.dto.InformationResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class InformationService {

    private final InformationRepository informationRepository;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public InformationService(InformationRepository informationRepository) {
        this.informationRepository = informationRepository;
    }

    public InformationResponse createInformation(InformationRequest request) {
        Information information = Information.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .isPublished(true)
                .build();

        Information savedInformation = informationRepository.save(information);
        return mapToResponse(savedInformation);
    }

    public InformationResponse getInformationById(Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information not found"));
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

    public List<InformationResponse> getInformationsByCategory(String category) {
        return informationRepository.findByCategory(category).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public InformationResponse updateInformation(Long id, InformationRequest request) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information not found"));

        information.setTitle(request.getTitle());
        information.setContent(request.getContent());
        information.setCategory(request.getCategory());

        Information updatedInformation = informationRepository.save(information);
        return mapToResponse(updatedInformation);
    }

    public void deleteInformation(Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information not found"));
        informationRepository.delete(information);
    }

    public void publishInformation(Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information not found"));
        information.setIsPublished(true);
        informationRepository.save(information);
    }

    public void unpublishInformation(Long id) {
        Information information = informationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Information not found"));
        information.setIsPublished(false);
        informationRepository.save(information);
    }

    private InformationResponse mapToResponse(Information information) {
        return InformationResponse.builder()
                .id(information.getId())
                .title(information.getTitle())
                .content(information.getContent())
                .category(information.getCategory())
                .isPublished(information.getIsPublished())
                .createdAt(information.getCreatedAt().format(formatter))
                .updatedAt(information.getUpdatedAt().format(formatter))
                .build();
    }
}

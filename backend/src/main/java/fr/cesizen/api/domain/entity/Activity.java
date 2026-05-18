package fr.cesizen.api.domain.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Column(nullable = false)
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // TODO : lié cette colonne au front pour afficher la durée de l'activité
    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    // TODO : lié cette colonne avec la table des difficultés (à créer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "difficulty_level")
    private DifficultyLevel difficultyLevel;

    // ── Constructeurs ────────────────────────────────────────────────

    public Activity() {}

    public Activity(Long id, String title, String description, String content,
                    String instructions, Boolean isActive, Category category,
                    LocalDateTime createdAt, LocalDateTime updatedAt, Integer durationMinutes, DifficultyLevel difficultyLevel) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.instructions = instructions;
        this.isActive = isActive;
        this.category = category;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.durationMinutes = durationMinutes;
        this.difficultyLevel = difficultyLevel;
    }

    // ── Getters ────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getTitle()             { return title; }
    public String getDescription()        { return description; }
    public String getContent()           { return content; }
    public String getInstructions()      { return instructions; }
    public Boolean getIsActive()         { return isActive; }
    public Category getCategory()        { return category; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public DifficultyLevel getDifficultyLevel() { return difficultyLevel; }

    // ── Setters ────────────────────────────────────────────────

    public void setId(Long id)                         { this.id = id; }
    public void setTitle(String title)                  { this.title = title; }
    public void setDescription(String description)      { this.description = description; }
    public void setContent(String content)              { this.content = content; }
    public void setInstructions(String instructions)    { this.instructions = instructions; }
    public void setIsActive(Boolean isActive)           { this.isActive = isActive; }
    public void setCategory(Category category)          { this.category = category; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)   { this.updatedAt = updatedAt; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setDifficultyLevel(DifficultyLevel difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    // ── Builder manuel ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, description, content, instructions;
        private Boolean isActive;
        private Category category;
        private LocalDateTime createdAt, updatedAt;
        private Integer durationMinutes;
        private DifficultyLevel difficultyLevel;
        
        public Builder id(Long id)                 { this.id = id; return this; }
        public Builder title(String title)         { this.title = title; return this; }
        public Builder description(String d)       { this.description = d; return this; }
        public Builder content(String c)           { this.content = c; return this; }
        public Builder instructions(String i)      { this.instructions = i; return this; }
        public Builder isActive(Boolean isActive)  { this.isActive = isActive; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder createdAt(LocalDateTime c)  { this.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u)  { this.updatedAt = u; return this; }
        public Builder durationMinutes(Integer d)  { this.durationMinutes = d; return this; }
        public Builder difficultyLevel(DifficultyLevel difficultyLevel) { this.difficultyLevel = difficultyLevel; return this; }

        public Activity build() {
            return new Activity(id, title, description, content, instructions,
                                isActive, category, createdAt, updatedAt, durationMinutes, difficultyLevel);
        }
    }

    // ── Lifecycle JPA ──────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}


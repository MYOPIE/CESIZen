package fr.cesizen.api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Constructeurs ────────────────────────────────────────────────

    public Activity() {}

    public Activity(Long id, String title, String description, String content,
                    String instructions, Boolean isActive,
                    LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.content = content;
        this.instructions = instructions;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ── Getters ────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getTitle()             { return title; }
    public String getDescription()        { return description; }
    public String getContent()           { return content; }
    public String getInstructions()      { return instructions; }
    public Boolean getIsActive()         { return isActive; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }

    // ── Setters ────────────────────────────────────────────────

    public void setId(Long id)                         { this.id = id; }
    public void setTitle(String title)                  { this.title = title; }
    public void setDescription(String description)      { this.description = description; }
    public void setContent(String content)              { this.content = content; }
    public void setInstructions(String instructions)    { this.instructions = instructions; }
    public void setIsActive(Boolean isActive)           { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)   { this.updatedAt = updatedAt; }

    // ── Builder manuel ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, description, content, instructions;
        private Boolean isActive;
        private LocalDateTime createdAt, updatedAt;
        public Builder id(Long id)                 { this.id = id; return this; }
        public Builder title(String title)         { this.title = title; return this; }
        public Builder description(String d)       { this.description = d; return this; }
        public Builder content(String c)           { this.content = c; return this; }
        public Builder instructions(String i)      { this.instructions = i; return this; }
        public Builder isActive(Boolean isActive)  { this.isActive = isActive; return this; }
        public Builder createdAt(LocalDateTime c)  { this.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u)  { this.updatedAt = u; return this; }

        public Activity build() {
            return new Activity(id, title, description, content, instructions,
                                isActive, createdAt, updatedAt);
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


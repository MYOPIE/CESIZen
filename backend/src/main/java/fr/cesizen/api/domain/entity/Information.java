package fr.cesizen.api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "informations")
public class Information {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String category;

    @Column(nullable = false)
    private Boolean isPublished;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // ── Constructeurs ──────────────────────────────────────────

    public Information() {}

    public Information(Long id, String title, String content, String category,
                      Boolean isPublished, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.isPublished = isPublished;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ── Getters ────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getTitle()             { return title; }
    public String getContent()           { return content; }
    public String getCategory()          { return category; }
    public Boolean getIsPublished()      { return isPublished; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }

    // ── Setters ────────────────────────────────────────────────

    public void setId(Long id)                         { this.id = id; }
    public void setTitle(String title)                  { this.title = title; }
    public void setContent(String content)              { this.content = content; }
    public void setCategory(String category)            { this.category = category; }
    public void setIsPublished(Boolean isPublished)    { this.isPublished = isPublished; }
    public void setCreatedAt(LocalDateTime createdAt)   { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)   { this.updatedAt = updatedAt; }

    // ── Builder manuel ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, content, category;
        private Boolean isPublished;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(Long id)                 { this.id = id; return this; }
        public Builder title(String title)         { this.title = title; return this; }
        public Builder content(String c)           { this.content = c; return this; }
        public Builder category(String c)          { this.category = c; return this; }
        public Builder isPublished(Boolean v)      { this.isPublished = v; return this; }
        public Builder createdAt(LocalDateTime c)  { this.createdAt = c; return this; }
        public Builder updatedAt(LocalDateTime u)  { this.updatedAt = u; return this; }

        public Information build() {
            return new Information(id, title, content, category, isPublished,
                                   createdAt, updatedAt);
        }
    }

    // ── Lifecycle JPA ──────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isPublished == null) isPublished = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
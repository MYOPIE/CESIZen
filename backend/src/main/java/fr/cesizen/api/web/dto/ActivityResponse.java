package fr.cesizen.api.web.dto;

import java.util.Set;

public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String instructions;
    private Boolean isActive;
    private CategoryResponse category;
    private DifficultyLevelResponse difficultyLevel;
    private Integer durationMinutes;
    private String createdAt;
    private String updatedAt;
    private Set<ActivityResponse> favoriteActivities;
    private boolean isFavorite;

    public ActivityResponse() {}

    public Long getId()             { return id; }
    public String getTitle()        { return title; }
    public String getDescription()  { return description; }
    public String getContent()      { return content; }
    public String getInstructions() { return instructions; }
    public Boolean getIsActive()    { return isActive; }
    public CategoryResponse getCategory() { return category; }
    public DifficultyLevelResponse getDifficultyLevel() { return difficultyLevel; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public String getCreatedAt()    { return createdAt; }
    public String getUpdatedAt()    { return updatedAt; }
    public Set<ActivityResponse> getFavoriteActivities() { return favoriteActivities; }
    public boolean getIsFavorite()  { return isFavorite; }
    public boolean isFavorite()     { return isFavorite; }

    public void setId(Long id)                       { this.id = id; }
    public void setTitle(String title)               { this.title = title; }
    public void setDescription(String description)   { this.description = description; }
    public void setContent(String content)           { this.content = content; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCategory(CategoryResponse category) { this.category = category; }
    public void setDifficultyLevel(DifficultyLevelResponse difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public void setCreatedAt(String createdAt)       { this.createdAt = createdAt; }
    public void setUpdatedAt(String updatedAt)       { this.updatedAt = updatedAt; }
    public void setFavoriteActivities(Set<ActivityResponse> favoriteActivities) {
        this.favoriteActivities = favoriteActivities;
    }
    public void setFavorite(boolean favorite)        { this.isFavorite = favorite; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, description, content, instructions, createdAt, updatedAt;
        private Boolean isActive;
        private CategoryResponse category;
        private DifficultyLevelResponse difficultyLevel;
        private Integer durationMinutes;
        private Set<ActivityResponse> favoriteActivities;
        private boolean isFavorite;

        public Builder id(Long id)                { this.id = id; return this; }
        public Builder title(String v)            { this.title = v; return this; }
        public Builder description(String v)      { this.description = v; return this; }
        public Builder content(String v)          { this.content = v; return this; }
        public Builder instructions(String v)     { this.instructions = v; return this; }
        public Builder isActive(Boolean v)        { this.isActive = v; return this; }
        public Builder category(CategoryResponse v) { this.category = v; return this; }
        public Builder difficultyLevel(DifficultyLevelResponse v) { this.difficultyLevel = v; return this; }
        public Builder durationMinutes(Integer v) { this.durationMinutes = v; return this; }
        public Builder createdAt(String v)        { this.createdAt = v; return this; }
        public Builder updatedAt(String v)        { this.updatedAt = v; return this; }
        public Builder favoriteActivities(Set<ActivityResponse> v) {
            this.favoriteActivities = v;
            return this;
        }
        public Builder setFavorite(boolean v) { this.isFavorite = v; return this; }

        public ActivityResponse build() {
            ActivityResponse r = new ActivityResponse();
            r.setId(id); r.setTitle(title); r.setDescription(description);
            r.setContent(content); r.setInstructions(instructions);
            r.setIsActive(isActive); r.setCategory(category); 
            r.setDifficultyLevel(difficultyLevel);
            r.setDurationMinutes(durationMinutes);
            r.setCreatedAt(createdAt); r.setUpdatedAt(updatedAt);
            r.setFavoriteActivities(favoriteActivities);
            r.setFavorite(isFavorite);
            return r;
        }
    }
}
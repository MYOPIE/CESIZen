package fr.cesizen.api.web.dto;

public class ActivityResponse {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String instructions;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;

    public ActivityResponse() {}

    public Long getId()             { return id; }
    public String getTitle()        { return title; }
    public String getDescription()  { return description; }
    public String getContent()      { return content; }
    public String getInstructions() { return instructions; }
    public Boolean getIsActive()    { return isActive; }
    public String getCreatedAt()    { return createdAt; }
    public String getUpdatedAt()    { return updatedAt; }

    public void setId(Long id)                       { this.id = id; }
    public void setTitle(String title)               { this.title = title; }
    public void setDescription(String description)   { this.description = description; }
    public void setContent(String content)           { this.content = content; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCreatedAt(String createdAt)       { this.createdAt = createdAt; }
    public void setUpdatedAt(String updatedAt)       { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, description, content, instructions, createdAt, updatedAt;
        private Boolean isActive;

        public Builder id(Long id)                { this.id = id; return this; }
        public Builder title(String v)            { this.title = v; return this; }
        public Builder description(String v)      { this.description = v; return this; }
        public Builder content(String v)          { this.content = v; return this; }
        public Builder instructions(String v)     { this.instructions = v; return this; }
        public Builder isActive(Boolean v)        { this.isActive = v; return this; }
        public Builder createdAt(String v)        { this.createdAt = v; return this; }
        public Builder updatedAt(String v)        { this.updatedAt = v; return this; }

        public ActivityResponse build() {
            ActivityResponse r = new ActivityResponse();
            r.setId(id); r.setTitle(title); r.setDescription(description);
            r.setContent(content); r.setInstructions(instructions);
            r.setIsActive(isActive); r.setCreatedAt(createdAt); r.setUpdatedAt(updatedAt);
            return r;
        }
    }
}
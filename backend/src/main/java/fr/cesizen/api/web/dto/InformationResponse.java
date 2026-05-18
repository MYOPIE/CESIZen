package fr.cesizen.api.web.dto;

public class InformationResponse {
    private Long id;
    private String title;
    private String content;
    private CategoryResponse category;
    private Boolean isPublished;
    private String createdAt;
    private String updatedAt;

    public InformationResponse() {}

    public Long getId()             { return id; }
    public String getTitle()        { return title; }
    public String getContent()      { return content; }
    public CategoryResponse getCategory() { return category; }
    public Boolean getIsPublished() { return isPublished; }
    public String getCreatedAt()    { return createdAt; }
    public String getUpdatedAt()    { return updatedAt; }

    public void setId(Long id)               { this.id = id; }
    public void setTitle(String title)       { this.title = title; }
    public void setContent(String content)   { this.content = content; }
    public void setCategory(CategoryResponse category) { this.category = category; }
    public void setIsPublished(Boolean v)    { this.isPublished = v; }
    public void setCreatedAt(String v)       { this.createdAt = v; }
    public void setUpdatedAt(String v)       { this.updatedAt = v; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String title, content, createdAt, updatedAt;
        private CategoryResponse category;
        private Boolean isPublished;

        public Builder id(Long id)             { this.id = id; return this; }
        public Builder title(String v)         { this.title = v; return this; }
        public Builder content(String v)       { this.content = v; return this; }
        public Builder category(CategoryResponse v) { this.category = v; return this; }
        public Builder isPublished(Boolean v)  { this.isPublished = v; return this; }
        public Builder createdAt(String v)     { this.createdAt = v; return this; }
        public Builder updatedAt(String v)     { this.updatedAt = v; return this; }

        public InformationResponse build() {
            InformationResponse r = new InformationResponse();
            r.setId(id); r.setTitle(title); r.setContent(content);
            r.setCategory(category); r.setIsPublished(isPublished);
            r.setCreatedAt(createdAt); r.setUpdatedAt(updatedAt);
            return r;
        }
    }
}
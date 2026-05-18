package fr.cesizen.api.web.dto;

public class InformationRequest {
    private String title;
    private String content;
    private Long categoryId;
    private Boolean isPublished;
    private Integer readingTime;

    public InformationRequest() {}

    public String getTitle()           { return title; }
    public String getContent()         { return content; }
    public Long getCategoryId()        { return categoryId; }
    public Boolean getIsPublished()    { return isPublished; }
    public Integer getReadingTime()    { return readingTime; }

    public void setTitle(String title)           { this.title = title; }
    public void setContent(String content)       { this.content = content; }
    public void setCategoryId(Long categoryId)   { this.categoryId = categoryId; }
    public void setIsPublished(Boolean v)        { this.isPublished = v; }
    public void setReadingTime(Integer readingTime) { this.readingTime = readingTime; }
}
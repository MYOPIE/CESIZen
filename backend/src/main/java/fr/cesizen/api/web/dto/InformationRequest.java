package fr.cesizen.api.web.dto;

public class InformationRequest {
    private String title;
    private String content;
    private String category;
    private Boolean isPublished;

    public InformationRequest() {}

    public String getTitle()           { return title; }
    public String getContent()         { return content; }
    public String getCategory()        { return category; }
    public Boolean getIsPublished()    { return isPublished; }

    public void setTitle(String title)           { this.title = title; }
    public void setContent(String content)       { this.content = content; }
    public void setCategory(String category)     { this.category = category; }
    public void setIsPublished(Boolean v)        { this.isPublished = v; }
}
package fr.cesizen.api.web.dto;

public class ActivityRequest {
    private String title;
    private String description;
    private String content;
    private String instructions;
    private Boolean isActive;
    private Long categoryId;

    public ActivityRequest() {}

    public String getTitle()          { return title; }
    public String getDescription()    { return description; }
    public String getContent()        { return content; }
    public String getInstructions()   { return instructions; }
    public Boolean getIsActive()      { return isActive; }
    public Long getCategoryId()       { return categoryId; }

    public void setTitle(String title)               { this.title = title; }
    public void setDescription(String description)   { this.description = description; }
    public void setContent(String content)           { this.content = content; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public void setIsActive(Boolean isActive)        { this.isActive = isActive; }
    public void setCategoryId(Long categoryId)       { this.categoryId = categoryId; }
}
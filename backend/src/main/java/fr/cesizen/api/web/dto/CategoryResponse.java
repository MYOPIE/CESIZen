package fr.cesizen.api.web.dto;

public class CategoryResponse {
    private Long id;
    private String name;
    private String type;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String type;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder type(String type) { this.type = type; return this; }

        public CategoryResponse build() {
            CategoryResponse response = new CategoryResponse();
            response.setId(id);
            response.setName(name);
            response.setType(type);
            return response;
        }
    }
}

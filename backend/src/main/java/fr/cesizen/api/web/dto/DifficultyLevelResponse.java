package fr.cesizen.api.web.dto;

public class DifficultyLevelResponse {
    private Long id;
    private String name;

    public DifficultyLevelResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }

        public DifficultyLevelResponse build() {
            DifficultyLevelResponse response = new DifficultyLevelResponse();
            response.setId(id);
            response.setName(name);
            return response;
        }
    }
}

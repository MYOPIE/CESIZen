package fr.cesizen.api.web.dto;

public class UserResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;

    public UserResponse() {}

    public UserResponse(Long id, String email, String firstName, String lastName, String role) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    public Long getId()          { return id; }
    public String getEmail()     { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName()  { return lastName; }
    public String getRole()      { return role; }
    public Boolean getIsActive() { return isActive; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }

    public void setId(Long id)               { this.id = id; }
    public void setEmail(String email)       { this.email = email; }
    public void setFirstName(String v)       { this.firstName = v; }
    public void setLastName(String v)        { this.lastName = v; }
    public void setRole(String role)         { this.role = role; }
    public void setIsActive(Boolean v)       { this.isActive = v; }
    public void setCreatedAt(String v)       { this.createdAt = v; }
    public void setUpdatedAt(String v)       { this.updatedAt = v; }

    public static UserResponseBuilder builder() { return new UserResponseBuilder(); }

    public static class UserResponseBuilder {
        private Long id;
        private String email, firstName, lastName, role, createdAt, updatedAt;
        private Boolean isActive;

        public UserResponseBuilder id(Long id)           { this.id = id; return this; }
        public UserResponseBuilder email(String v)       { this.email = v; return this; }
        public UserResponseBuilder firstName(String v)   { this.firstName = v; return this; }
        public UserResponseBuilder lastName(String v)    { this.lastName = v; return this; }
        public UserResponseBuilder role(String v)        { this.role = v; return this; }
        public UserResponseBuilder isActive(Boolean v)   { this.isActive = v; return this; }
        public UserResponseBuilder createdAt(String v)   { this.createdAt = v; return this; }
        public UserResponseBuilder updatedAt(String v)   { this.updatedAt = v; return this; }

        public UserResponse build() {
            UserResponse r = new UserResponse();
            r.setId(id); r.setEmail(email); r.setFirstName(firstName);
            r.setLastName(lastName); r.setRole(role); r.setIsActive(isActive);
            r.setCreatedAt(createdAt); r.setUpdatedAt(updatedAt);
            return r;
        }
    }
}
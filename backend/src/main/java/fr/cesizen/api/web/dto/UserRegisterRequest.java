package fr.cesizen.api.web.dto;

public class UserRegisterRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String confirmPassword;
    private String currentPassword;

    public UserRegisterRequest() {}
    public UserRegisterRequest(String email, String firstName, String lastName,
                                String password, String confirmPassword) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public String getEmail()           { return email; }
    public String getFirstName()       { return firstName; }
    public String getLastName()        { return lastName; }
    public String getPassword()        { return password; }
    public String getConfirmPassword() { return confirmPassword; }
    public String getCurrentPassword() { return currentPassword; }

    public void setEmail(String email)                   { this.email = email; }
    public void setFirstName(String firstName)           { this.firstName = firstName; }
    public void setLastName(String lastName)             { this.lastName = lastName; }
    public void setPassword(String password)             { this.password = password; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
}
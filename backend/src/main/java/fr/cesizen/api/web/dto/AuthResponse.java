package fr.cesizen.api.web.dto;

public class AuthResponse {
    private String message;
    private String token;
    private UserResponse user;

    public AuthResponse() {}

    public AuthResponse(String message, String token, UserResponse user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public String getMessage() { return message; }
    public String getToken()   { return token; }
    public UserResponse getUser() { return user; }

    public void setMessage(String message) { this.message = message; }
    public void setToken(String token)     { this.token = token; }
    public void setUser(UserResponse u)    { this.user = u; }

    public static AuthResponseBuilder builder() { return new AuthResponseBuilder(); }

    public static class AuthResponseBuilder {
        private String message, token;
        private UserResponse user;

        public AuthResponseBuilder message(String m)   { this.message = m; return this; }
        public AuthResponseBuilder token(String t)     { this.token = t; return this; }
        public AuthResponseBuilder user(UserResponse u){ this.user = u; return this; }

        public AuthResponse build() {
            AuthResponse r = new AuthResponse();
            r.setMessage(message);
            r.setToken(token);
            r.setUser(user);
            return r;
        }
    }
}
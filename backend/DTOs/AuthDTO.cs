namespace backend.DTOs;

public class LoginDTO
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class RegisterDTO
{
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class AuthResponseDTO
{
    public string Token { get; set; } = null!;
    public string RefreshToken { get; set; } = null!;
    public UserDTO User { get; set; } = null!;
}

public class UserDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Role { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
}

public class UpdateProfileDTO
{
    public string? Username { get; set; }
    public string? ProfilePictureUrl { get; set; }
}

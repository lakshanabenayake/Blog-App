using backend.DTOs;
namespace backend.Interfaces;

public interface IauthService
{
    Task<AuthResponseDTO?> LoginAsync(LoginDTO loginDto);
    Task<AuthResponseDTO?> RegisterAsync(RegisterDTO registerDto);
    Task<UserDTO?> UpdateProfileAsync(Guid userId, UpdateProfileDTO dto);
}
using backend.DTOs;
using backend.Interfaces;
using backend.models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace backend.services;

public class AuthService : IauthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _config;

    public AuthService(IUserRepository userRepository, IConfiguration config)
    {
        _userRepository = userRepository;
        _config = config;
    }

    public async Task<AuthResponseDTO?> RegisterAsync(RegisterDTO dto)
    {
        // Check if user exists
        var exists = await _userRepository.ExistsAsync(dto.Email, dto.Username);
        if (exists) return null;

        // Hash password
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        // Create user
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Email = dto.Email,
            Password = hashedPassword,
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDTO?> LoginAsync(LoginDTO dto)
    {
        // Find user
        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user == null) return null;

        // Verify password
        var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.Password);
        if (!isValid) return null;

        return CreateAuthResponse(user);
    }

    public async Task<UserDTO?> GetUserById(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) return null;

        return new UserDTO
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role
        };
    }

    private AuthResponseDTO CreateAuthResponse(User user)
    {
        var token = GenerateJwtToken(user);
        var refreshToken = Guid.NewGuid().ToString();

        return new AuthResponseDTO
        {
            Token = token,
            RefreshToken = refreshToken,
            User = new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            }
        };
    }

    private string GenerateJwtToken(User user)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key missing");
        var issuer = _config["Jwt:Issuer"];
        var audience = _config["Jwt:Audience"];

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
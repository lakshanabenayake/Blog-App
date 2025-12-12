using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/images")]
public class ImageController : ControllerBase
{
    private readonly ImageService _imageService;

    public ImageController(ImageService imageService)
    {
        _imageService = imageService;
    }

    [HttpPost("upload")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded" });
        }

        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };
        if (!allowedTypes.Contains(file.ContentType.ToLower()))
        {
            return BadRequest(new { message = "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." });
        }

        // Validate file size (max 5MB)
        if (file.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "File size exceeds 5MB limit" });
        }

        try
        {
            var result = await _imageService.AddImageAsync(file);

            if (result.Error != null)
            {
                return BadRequest(new { message = result.Error.Message });
            }

            return Ok(new
            {
                url = result.SecureUrl.ToString(),
                publicId = result.PublicId,
                width = result.Width,
                height = result.Height
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to upload image", error = ex.Message });
        }
    }

    [HttpDelete("{publicId}")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> DeleteImage(string publicId)
    {
        try
        {
            // Decode the publicId (it might be URL encoded)
            publicId = Uri.UnescapeDataString(publicId);

            var result = await _imageService.DeleteImageAsync(publicId);

            if (result.Result == "ok")
            {
                return Ok(new { message = "Image deleted successfully" });
            }

            return BadRequest(new { message = "Failed to delete image", result = result.Result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Failed to delete image", error = ex.Message });
        }
    }
}

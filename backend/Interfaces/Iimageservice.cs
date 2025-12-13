using CloudinaryDotNet.Actions;
namespace backend.Interfaces;

public interface IImageService
{
    Task<ImageUploadResult> AddImageAsync(IFormFile file);
    Task<DeletionResult> DeleteImageAsync(string publicId);
}
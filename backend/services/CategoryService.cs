using backend.Interfaces;
using backend.models;

namespace backend.services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<List<Category>> GetAllCategoriesAsync()
    {
        return await _categoryRepository.GetAllAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await _categoryRepository.GetByIdAsync(id);
    }

    public async Task<Category?> GetCategoryBySlugAsync(string slug)
    {
        return await _categoryRepository.GetBySlugAsync(slug);
    }

    public async Task<Category> CreateCategoryAsync(Category category)
    {
        return await _categoryRepository.AddAsync(category);
    }

    public async Task<Category?> UpdateCategoryAsync(int id, Category category)
    {
        var existingCategory = await _categoryRepository.GetByIdAsync(id);
        if (existingCategory == null)
            return null;

        existingCategory.Name = category.Name;
        existingCategory.Description = category.Description;

        await _categoryRepository.UpdateAsync(existingCategory);
        return existingCategory;
    }

    public async Task<(bool success, string message)> DeleteCategoryAsync(int id)
    {
        var exists = await _categoryRepository.ExistsAsync(id);
        if (!exists)
            return (false, "Category not found");

        var postsCount = await _categoryRepository.GetPostsCountAsync(id);
        if (postsCount > 0)
            return (false, $"Cannot delete category. {postsCount} posts are using it.");

        await _categoryRepository.DeleteAsync(id);
        return (true, "Category deleted successfully");
    }
}

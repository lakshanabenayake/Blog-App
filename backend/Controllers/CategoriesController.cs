using backend.data;
using backend.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriesController(AppDbContext context)
    {
        _context = context;
    }

    // Public endpoints
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _context.Categories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(categories);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
            return NotFound(new { message = "Category not found" });

        return Ok(category);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Name.Replace(" ", "-").ToLower() == slug.ToLower());

        if (category == null)
            return NotFound(new { message = "Category not found" });

        return Ok(category);
    }

    // Admin endpoints
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Category category)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        category.CreatedAt = DateTime.UtcNow;
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] Category category)
    {
        if (id != category.Id)
            return BadRequest(new { message = "ID mismatch" });

        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existingCategory = await _context.Categories.FindAsync(id);
        if (existingCategory == null)
            return NotFound(new { message = "Category not found" });

        existingCategory.Name = category.Name;
        existingCategory.Description = category.Description;

        await _context.SaveChangesAsync();

        return Ok(existingCategory);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return NotFound(new { message = "Category not found" });

        // Check if any posts are using this category
        var postsCount = await _context.Posts.CountAsync(p => p.CategoryId == id);
        if (postsCount > 0)
            return BadRequest(new { message = $"Cannot delete category. {postsCount} posts are using it." });

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Category deleted successfully" });
    }
}

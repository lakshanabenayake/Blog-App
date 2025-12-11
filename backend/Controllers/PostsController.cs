using backend.DTOs;
using backend.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class PostsController : ControllerBase
{
    private readonly PostService _postService;

    public PostsController(PostService postService)
    {
        _postService = postService;
    }

    // Public endpoints
    [HttpGet("posts")]
    public async Task<IActionResult> GetPublishedPosts([FromQuery] PostFiltersDTO filters)
    {
        var result = await _postService.GetPublishedPostsAsync(filters);
        return Ok(result);
    }

    [HttpGet("posts/slug/{slug}")]
    public async Task<IActionResult> GetPostBySlug(string slug)
    {
        var post = await _postService.GetPostBySlugAsync(slug);

        if (post == null)
            return NotFound(new { message = "Post not found" });

        return Ok(post);
    }

    [HttpGet("posts/{postId}/related")]
    public async Task<IActionResult> GetRelatedPosts(string postId, [FromQuery] int categoryId, [FromQuery] int limit = 3)
    {
        if (!Guid.TryParse(postId, out var id))
            return BadRequest(new { message = "Invalid post ID" });

        var posts = await _postService.GetRelatedPostsAsync(id, categoryId, limit);
        return Ok(posts);
    }

   
    [HttpPost("/posts")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> CreatePost([FromBody] CreatePostDTO dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userIdClaim == null)
            return Unauthorized();

        var userId = Guid.Parse(userIdClaim);
        var post = await _postService.CreatePostAsync(dto, userId);

        return CreatedAtAction(nameof(GetPostById), new { id = post.Id }, post);
    }

    [HttpPut("/posts/{id}")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> UpdatePost(string id, [FromBody] UpdatePostDTO dto)
    {
        if (!Guid.TryParse(id, out var postId))
            return BadRequest(new { message = "Invalid post ID" });

        var post = await _postService.UpdatePostAsync(postId, dto);

        if (post == null)
            return NotFound(new { message = "Post not found" });

        return Ok(post);
    }

    [HttpDelete("/posts/{id}")]
    [Authorize(Roles = "Admin, User")]
    public async Task<IActionResult> DeletePost(string id)
    {
        if (!Guid.TryParse(id, out var postId))
            return BadRequest(new { message = "Invalid post ID" });

        var success = await _postService.DeletePostAsync(postId);

        if (!success)
            return NotFound(new { message = "Post not found" });

        return Ok(new { message = "Post deleted successfully" });
    }

     // Admin endpoints
    [HttpGet("admin/posts")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllPosts([FromQuery] PostFiltersDTO filters)
    {
        var result = await _postService.GetAllPostsAsync(filters);
        return Ok(result);
    }

    [HttpGet("admin/posts/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetPostById(string id)
    {
        if (!Guid.TryParse(id, out var postId))
            return BadRequest(new { message = "Invalid post ID" });

        var post = await _postService.GetPostByIdAsync(postId);

        if (post == null)
            return NotFound(new { message = "Post not found" });

        return Ok(post);
    }

}

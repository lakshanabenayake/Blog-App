using backend.data;
using backend.models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace backend;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        using var context = serviceProvider.GetRequiredService<AppDbContext>();

        // Ensure database is created
        await context.Database.MigrateAsync();

        // Check if data already exists
        if (await context.Users.AnyAsync() || await context.Categories.AnyAsync() || await context.Posts.AnyAsync())
        {
            Console.WriteLine("Database already seeded.");
            return;
        }

        Console.WriteLine("Seeding database...");

        // Seed Users
        var adminUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@blogspace.com",
            Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        };

        var regularUser = new User
        {
            Id = Guid.NewGuid(),
            Username = "john_doe",
            Email = "john@example.com",
            Password = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        var jane = new User
        {
            Id = Guid.NewGuid(),
            Username = "jane_smith",
            Email = "jane@example.com",
            Password = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = "User",
            CreatedAt = DateTime.UtcNow
        };

        await context.Users.AddRangeAsync(adminUser, regularUser, jane);
        await context.SaveChangesAsync();

        // Seed Categories
        var categories = new[]
        {
            new Category { Name = "Technology", Description = "Latest in tech and innovation", CreatedAt = DateTime.UtcNow },
            new Category { Name = "Travel", Description = "Travel guides and adventures", CreatedAt = DateTime.UtcNow },
            new Category { Name = "Food", Description = "Recipes and culinary experiences", CreatedAt = DateTime.UtcNow },
            new Category { Name = "Lifestyle", Description = "Life tips and personal stories", CreatedAt = DateTime.UtcNow },
            new Category { Name = "Business", Description = "Business insights and entrepreneurship", CreatedAt = DateTime.UtcNow },
            new Category { Name = "Health", Description = "Health and wellness tips", CreatedAt = DateTime.UtcNow }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        // Seed Tags
        var tags = new[]
        {
            new Tags { Name = "ai" },
            new Tags { Name = "web-development" },
            new Tags { Name = "javascript" },
            new Tags { Name = "adventure" },
            new Tags { Name = "recipe" },
            new Tags { Name = "productivity" },
            new Tags { Name = "startup" },
            new Tags { Name = "fitness" },
            new Tags { Name = "photography" },
            new Tags { Name = "coding" }
        };

        await context.Tags.AddRangeAsync(tags);
        await context.SaveChangesAsync();

        // Seed Posts
        var posts = new[]
        {
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "Getting Started with AI and Machine Learning",
                Content = "Artificial Intelligence and Machine Learning are transforming the way we interact with technology. In this comprehensive guide, we'll explore the fundamentals of AI/ML and how you can get started with building your first AI model.\n\nMachine learning is a subset of AI that focuses on training algorithms to learn from data. The more data you provide, the better the model becomes at making predictions or decisions.\n\nTo start your journey, you'll need to understand basic concepts like supervised learning, unsupervised learning, and reinforcement learning. Python is the most popular language for AI/ML development, with libraries like TensorFlow, PyTorch, and scikit-learn making it easier than ever to build powerful models.\n\nWhether you're a beginner or an experienced developer, the world of AI offers endless possibilities for innovation and creativity.",
                UserId = adminUser.Id,
                CategoryId = 1,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-10),
                CreatedAt = DateTime.UtcNow.AddDays(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                Tags = new List<Tags> { tags[0], tags[9] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "Building Modern Web Applications with React and Next.js",
                Content = "React has revolutionized how we build user interfaces, and Next.js takes it to the next level with server-side rendering, static site generation, and more.\n\nIn this article, we'll dive deep into the architecture of modern web applications. We'll explore how React's component-based approach makes it easy to build reusable UI elements, and how Next.js provides built-in routing, API routes, and optimization features.\n\nServer-side rendering (SSR) improves SEO and initial page load times, while static site generation (SSG) offers the best performance for content that doesn't change frequently. Next.js also supports incremental static regeneration (ISR), allowing you to update static content without rebuilding the entire site.\n\nWhether you're building a blog, e-commerce site, or complex web application, the React and Next.js ecosystem provides all the tools you need for success.",
                UserId = regularUser.Id,
                CategoryId = 1,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-8),
                CreatedAt = DateTime.UtcNow.AddDays(-8),
                UpdatedAt = DateTime.UtcNow.AddDays(-8),
                Tags = new List<Tags> { tags[1], tags[2] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "Exploring the Hidden Gems of Southeast Asia",
                Content = "Southeast Asia is a treasure trove of breathtaking landscapes, rich cultures, and unforgettable experiences. From the pristine beaches of Thailand to the ancient temples of Cambodia, this region offers something for every traveler.\n\nMy journey began in Vietnam, where I explored the bustling streets of Hanoi and cruised through the stunning Ha Long Bay. The street food alone is worth the trip – pho, banh mi, and fresh spring rolls that burst with flavor.\n\nNext, I ventured to Laos, where time seems to slow down. The town of Luang Prabang, with its golden temples and French colonial architecture, felt like stepping back in time. Watching the sunrise over the Mekong River is an experience I'll never forget.\n\nIndonesia's diverse islands offer everything from surfing in Bali to diving with manta rays in Komodo. The warmth and hospitality of the local people made every destination feel like home.\n\nSoutheast Asia isn't just a destination – it's an adventure that will change your perspective on life and travel.",
                UserId = jane.Id,
                CategoryId = 2,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-6),
                CreatedAt = DateTime.UtcNow.AddDays(-6),
                UpdatedAt = DateTime.UtcNow.AddDays(-6),
                Tags = new List<Tags> { tags[3], tags[8] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "The Ultimate Guide to Italian Pasta Making",
                Content = "Italian pasta is more than just food – it's an art form passed down through generations. Learning to make authentic pasta from scratch is a rewarding experience that will elevate your cooking skills.\n\nThe foundation of great pasta is simple: flour and eggs. But the technique makes all the difference. Start by creating a well in your flour, crack the eggs in the center, and slowly incorporate the flour using a fork. Knead the dough for about 10 minutes until it's smooth and elastic.\n\nLet the dough rest for at least 30 minutes before rolling it out. Whether you use a rolling pin or a pasta machine, the key is to work the dough gradually, folding and rolling multiple times to develop the gluten structure.\n\nOnce you've mastered basic pasta dough, experiment with different shapes: fettuccine, tagliatelle, pappardelle, or even filled pasta like ravioli and tortellini. Each shape pairs perfectly with specific sauces – long ribbons with creamy sauces, tubes with chunky meat sauces, and filled pasta with light butter and sage.\n\nRemember, the best pasta is always made with love and patience. Buon appetito!",
                UserId = regularUser.Id,
                CategoryId = 3,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-4),
                CreatedAt = DateTime.UtcNow.AddDays(-4),
                UpdatedAt = DateTime.UtcNow.AddDays(-4),
                Tags = new List<Tags> { tags[4] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "10 Productivity Hacks for Remote Workers",
                Content = "Working remotely offers incredible flexibility, but it also requires discipline and effective time management. Here are 10 proven strategies to boost your productivity while working from home.\n\n1. Create a Dedicated Workspace: Set up a specific area for work to mentally separate your professional and personal life.\n\n2. Establish a Morning Routine: Start your day with a consistent routine that signals it's time to work.\n\n3. Use the Pomodoro Technique: Work in focused 25-minute intervals with short breaks in between.\n\n4. Set Clear Boundaries: Communicate your work hours to family and friends to minimize interruptions.\n\n5. Take Regular Breaks: Step away from your desk every hour to stretch, walk, or simply rest your eyes.\n\n6. Use Productivity Tools: Leverage apps like Trello, Notion, or Asana to organize tasks and projects.\n\n7. Minimize Distractions: Turn off notifications, use website blockers, and create a focused environment.\n\n8. Schedule Everything: Block time for meetings, deep work, breaks, and even lunch.\n\n9. Stay Connected: Regular video calls with colleagues help maintain team cohesion and reduce isolation.\n\n10. End Your Day Properly: Have a shutdown ritual that helps you mentally disconnect from work.\n\nRemember, productivity isn't about working longer hours – it's about working smarter and maintaining a healthy work-life balance.",
                UserId = adminUser.Id,
                CategoryId = 4,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-3),
                CreatedAt = DateTime.UtcNow.AddDays(-3),
                UpdatedAt = DateTime.UtcNow.AddDays(-3),
                Tags = new List<Tags> { tags[5] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "From Idea to Launch: Building Your First Startup",
                Content = "Starting a business is both exciting and challenging. Having launched multiple startups over the years, I've learned valuable lessons about what works and what doesn't.\n\nThe journey begins with validating your idea. Don't spend months building a product nobody wants. Instead, talk to potential customers, understand their pain points, and iterate quickly based on feedback.\n\nOnce you've validated your idea, focus on building a minimum viable product (MVP). Your MVP should solve the core problem with the simplest solution possible. Don't get caught up in adding features – launch early and learn from real users.\n\nFunding is often a concern for new entrepreneurs. While venture capital gets a lot of attention, there are many other options: bootstrapping, angel investors, crowdfunding, or small business loans. Choose the path that aligns with your goals and maintains your control over the company.\n\nBuilding a strong team is crucial. Surround yourself with people who complement your skills and share your vision. Culture matters from day one – hire people who are passionate, adaptable, and committed to the mission.\n\nFinally, remember that failure is part of the journey. Every setback is an opportunity to learn and improve. Stay persistent, remain flexible, and never stop believing in your vision.",
                UserId = jane.Id,
                CategoryId = 5,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-2),
                CreatedAt = DateTime.UtcNow.AddDays(-2),
                UpdatedAt = DateTime.UtcNow.AddDays(-2),
                Tags = new List<Tags> { tags[6] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "The Science of Sleep and How to Optimize Your Rest",
                Content = "Sleep is one of the most important aspects of health, yet it's often neglected in our fast-paced world. Understanding the science of sleep can help you optimize your rest and wake up feeling refreshed.\n\nSleep occurs in cycles, each lasting about 90 minutes. During these cycles, you move through different stages: light sleep, deep sleep, and REM sleep. Each stage plays a crucial role in physical recovery, memory consolidation, and emotional regulation.\n\nTo improve your sleep quality, establish a consistent sleep schedule. Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock, making it easier to fall asleep and wake up naturally.\n\nCreate a sleep-friendly environment: keep your bedroom cool (around 65-68°F), dark, and quiet. Invest in a comfortable mattress and pillows. Consider using blackout curtains and white noise machines if needed.\n\nAvoid screens at least an hour before bed. The blue light emitted by phones, tablets, and computers can interfere with melatonin production, making it harder to fall asleep.\n\nLimit caffeine intake, especially in the afternoon and evening. Caffeine has a half-life of about 5-6 hours, meaning it stays in your system long after your last cup of coffee.\n\nPrioritize sleep as you would any other important aspect of health. Your body and mind will thank you.",
                UserId = regularUser.Id,
                CategoryId = 6,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
                Status = "Published",
                PublishedAt = DateTime.UtcNow.AddDays(-1),
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                UpdatedAt = DateTime.UtcNow.AddDays(-1),
                Tags = new List<Tags> { tags[7] }
            },
            new Post
            {
                Id = Guid.NewGuid(),
                Title = "Advanced TypeScript Patterns for Better Code",
                Content = "TypeScript has become the de facto standard for building large-scale JavaScript applications. Beyond basic type annotations, TypeScript offers powerful features that can help you write more maintainable and type-safe code.\n\nGeneric types allow you to write reusable components that work with multiple types. Conditional types enable you to create complex type relationships based on conditions. Mapped types let you transform existing types into new ones.\n\nDiscriminated unions are particularly useful for handling different states in your application. By using a common property to discriminate between union members, TypeScript can narrow types automatically in your code.\n\nUtility types like Partial, Pick, Omit, and Record provide convenient shortcuts for common type transformations. Understanding when and how to use these utilities can significantly improve your code's expressiveness.\n\nThis article explores these advanced patterns with practical examples you can use in your projects today.",
                UserId = adminUser.Id,
                CategoryId = 1,
                FeaturedImageUrl = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
                Status = "Draft",
                PublishedAt = null,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Tags = new List<Tags> { tags[1], tags[2] }
            }
        };

        await context.Posts.AddRangeAsync(posts);
        await context.SaveChangesAsync();

        Console.WriteLine("Database seeded successfully!");
        Console.WriteLine($"Users: {await context.Users.CountAsync()}");
        Console.WriteLine($"Categories: {await context.Categories.CountAsync()}");
        Console.WriteLine($"Posts: {await context.Posts.CountAsync()}");
        Console.WriteLine($"Tags: {await context.Tags.CountAsync()}");
        Console.WriteLine("\nTest Credentials:");
        Console.WriteLine("Admin - Email: admin@blogspace.com, Password: admin123");
        Console.WriteLine("User - Email: john@example.com, Password: password123");
        Console.WriteLine("User - Email: jane@example.com, Password: password123");
    }
}

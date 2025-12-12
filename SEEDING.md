# Seeding the Database

The BlogApp includes a comprehensive database seeding script that populates the database with sample data for testing and development.

## What Gets Seeded

### Users

- **Admin User**
  - Email: `admin@blogspace.com`
  - Password: `admin123`
  - Role: Admin
- **Regular Users**
  - Email: `john@example.com` / Password: `password123`
  - Email: `jane@example.com` / Password: `password123`
  - Role: User

### Categories

- Technology
- Travel
- Food
- Lifestyle
- Business
- Health

### Posts

- 7 published posts across various categories
- 1 draft post
- All posts include:
  - Title, content, and excerpt
  - Featured images from Unsplash
  - Category assignments
  - Tags
  - Realistic publication dates

### Tags

- ai, web-development, javascript, adventure, recipe, productivity, startup, fitness, photography, coding

## How to Seed

The database is automatically seeded when you run the backend application for the first time. The seeding logic is in `backend/SeedData.cs` and is called from `Program.cs`.

### Steps:

1. **Ensure your database connection is configured**

   ```bash
   # Check appsettings.json or appsettings.Development.json
   # Make sure the PostgreSQL connection string is correct
   ```

2. **Run the backend**

   ```bash
   cd backend
   dotnet run
   ```

3. **The seed data will be automatically created** if the database is empty. You'll see console output like:

   ```
   Seeding database...
   Database seeded successfully!
   Users: 3
   Categories: 6
   Posts: 8
   Tags: 10

   Test Credentials:
   Admin - Email: admin@blogspace.com, Password: admin123
   User - Email: john@example.com, Password: password123
   User - Email: jane@example.com, Password: password123
   ```

## Testing the Application

After seeding, you can:

1. **View published posts** - Visit `http://localhost:3000` to see the blog homepage with published posts

2. **Login as admin** - Use `admin@blogspace.com` / `admin123` to access the admin dashboard at `/admin`

3. **Login as user** - Use `john@example.com` / `password123` to:

   - View your posts at `/user/posts`
   - Create new posts at `/user/posts/create`
   - Edit your posts

4. **Test features**:
   - Search functionality
   - Category filtering
   - Related posts
   - Post creation/editing
   - Draft vs Published status

## Resetting the Data

If you want to reset and reseed the database:

1. **Drop the database**

   ```bash
   cd backend
   dotnet ef database drop
   ```

2. **Run the application again**
   ```bash
   dotnet run
   ```
   The database will be recreated and seeded automatically.

## Customizing Seed Data

To customize the seed data, edit `backend/SeedData.cs`:

- Add more users, categories, or posts
- Change credentials
- Modify post content
- Update featured image URLs
- Adjust tags and categories

After making changes, drop and recreate the database to apply the new seed data.

using System.Text;
using System.Text.RegularExpressions;

namespace backend.Utilities;

public static class SlugGenerator
{
    /// <summary>
    /// Generates a URL-friendly slug from a given title
    /// </summary>
    public static string GenerateSlug(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            return string.Empty;

        // Convert to lowercase
        var slug = title.ToLowerInvariant();

        // Remove accents/diacritics
        slug = RemoveDiacritics(slug);

        // Replace spaces and underscores with hyphens
        slug = Regex.Replace(slug, @"[\s_]+", "-");

        // Remove invalid characters (keep only letters, numbers, and hyphens)
        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");

        // Replace multiple consecutive hyphens with single hyphen
        slug = Regex.Replace(slug, @"-+", "-");

        // Trim hyphens from start and end
        slug = slug.Trim('-');

        // Limit length to 100 characters
        if (slug.Length > 100)
            slug = slug.Substring(0, 100).TrimEnd('-');

        return slug;
    }

    /// <summary>
    /// Generates a unique slug by appending a number if the slug already exists
    /// </summary>
    public static string GenerateUniqueSlug(string baseSlug, int counter)
    {
        return counter == 0 ? baseSlug : $"{baseSlug}-{counter}";
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != System.Globalization.UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
    }
}

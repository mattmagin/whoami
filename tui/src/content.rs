//! Content loaded from JSON
//! This will later be replaced with API calls

use once_cell::sync::Lazy;
use serde::Deserialize;

/// Raw JSON content embedded at compile time
const CONTENT_JSON: &str = include_str!("../content.json");

/// Root content structure matching the JSON schema
#[derive(Debug, Deserialize)]
struct ContentData {
    resume: String,
    bio: String,
    logo: String,
    typewriter_phrases: Vec<String>,
    menu_items: Vec<MenuItemData>,
    posts: Vec<PostData>,
    projects: Vec<ProjectData>,
}

/// Menu item from JSON
#[derive(Debug, Deserialize)]
struct MenuItemData {
    key: String,
    label: String,
    desc: String,
}

/// Blog post from JSON
#[derive(Debug, Clone, Deserialize)]
pub struct PostData {
    pub slug: String,
    pub title: String,
    pub excerpt: String,
    pub tags: Vec<String>,
    pub content: String,
    pub published: String,
}

/// Project from JSON
#[derive(Debug, Clone, Deserialize)]
pub struct ProjectData {
    pub slug: String,
    pub name: String,
    #[allow(dead_code)]
    pub excerpt: String,
    pub description: String,
    pub tech_stack: Vec<String>,
    pub url: Option<String>,
    pub github_url: Option<String>,
    pub featured: bool,
}

/// Parsed content data (lazily initialized)
static CONTENT: Lazy<ContentData> = Lazy::new(|| {
    serde_json::from_str(CONTENT_JSON).expect("Failed to parse content.json")
});

// ============================================================================
// Public API - Compatible with existing code
// ============================================================================

/// Resume content in markdown
#[allow(dead_code)]
pub fn resume() -> &'static str {
    &CONTENT.resume
}

/// Bio text for home view
#[allow(dead_code)]
pub fn bio() -> &'static str {
    &CONTENT.bio
}

/// ASCII art logo
#[allow(dead_code)]
pub fn logo() -> &'static str {
    &CONTENT.logo
}

/// Typewriter phrases for the home view
#[allow(dead_code)]
pub fn typewriter_phrases() -> &'static [String] {
    &CONTENT.typewriter_phrases
}

/// Blog posts (raw data)
#[allow(dead_code)]
pub fn posts() -> &'static [PostData] {
    &CONTENT.posts
}

/// Projects (raw data)
#[allow(dead_code)]
pub fn projects() -> &'static [ProjectData] {
    &CONTENT.projects
}

// ============================================================================
// Static compatibility aliases (for code that expects &'static str)
// ============================================================================

/// Resume content (static reference)
pub static RESUME: Lazy<&'static str> = Lazy::new(|| resume());

/// Bio text (static reference)
pub static BIO: Lazy<&'static str> = Lazy::new(|| bio());

/// Logo (static reference)
pub static LOGO: Lazy<&'static str> = Lazy::new(|| logo());

/// Typewriter phrases (static slice reference)
pub static TYPEWRITER_PHRASES: Lazy<Vec<&'static str>> = Lazy::new(|| {
    CONTENT.typewriter_phrases.iter().map(|s| s.as_str()).collect()
});

/// Posts (static slice reference)
pub static POSTS: Lazy<Vec<Post>> = Lazy::new(|| {
    CONTENT.posts.iter().map(|p| Post {
        slug: &p.slug,
        title: &p.title,
        excerpt: &p.excerpt,
        tags: p.tags.iter().map(|t| t.as_str()).collect(),
        content: &p.content,
        published: &p.published,
    }).collect()
});

/// Projects (static slice reference)
pub static PROJECTS: Lazy<Vec<Project>> = Lazy::new(|| {
    CONTENT.projects.iter().map(|p| Project {
        slug: &p.slug,
        name: &p.name,
        excerpt: &p.excerpt,
        description: &p.description,
        tech_stack: p.tech_stack.iter().map(|t| t.as_str()).collect(),
        url: p.url.as_deref(),
        github_url: p.github_url.as_deref(),
        featured: p.featured,
    }).collect()
});

/// Menu items (static slice reference)
pub static MENU_ITEMS: Lazy<Vec<MenuItem>> = Lazy::new(|| {
    CONTENT.menu_items.iter().map(|m| MenuItem {
        key: m.key.chars().next().unwrap_or('?'),
        label: &m.label,
        desc: &m.desc,
    }).collect()
});

// ============================================================================
// Legacy structs for backwards compatibility with existing views
// ============================================================================

/// Blog post structure (references into CONTENT)
#[derive(Clone)]
pub struct Post {
    #[allow(dead_code)]
    pub slug: &'static str,
    pub title: &'static str,
    pub excerpt: &'static str,
    pub tags: Vec<&'static str>,
    pub content: &'static str,
    pub published: &'static str,
}

/// Project structure (references into CONTENT)
#[derive(Clone)]
pub struct Project {
    #[allow(dead_code)]
    pub slug: &'static str,
    pub name: &'static str,
    #[allow(dead_code)]
    pub excerpt: &'static str,
    pub description: &'static str,
    pub tech_stack: Vec<&'static str>,
    pub url: Option<&'static str>,
    pub github_url: Option<&'static str>,
    pub featured: bool,
}

/// Menu item for the home view
pub struct MenuItem {
    pub key: char,
    pub label: &'static str,
    pub desc: &'static str,
}

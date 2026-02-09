//! Color palette and styling - Tokyo Night theme

use ratatui::style::{Color, Modifier, Style};

// Tokyo Night color palette
pub const COLOR_PRIMARY: Color = Color::Rgb(122, 162, 247);    // Soft blue #7aa2f7
pub const COLOR_SECONDARY: Color = Color::Rgb(187, 154, 247);  // Purple #bb9af7
pub const COLOR_ACCENT: Color = Color::Rgb(158, 206, 106);     // Green #9ece6a
pub const COLOR_WARNING: Color = Color::Rgb(224, 175, 104);    // Yellow/Orange #e0af68
pub const COLOR_ERROR: Color = Color::Rgb(247, 118, 142);      // Red/Pink #f7768e
pub const COLOR_MUTED: Color = Color::Rgb(86, 95, 137);        // Muted gray-blue #565f89
pub const COLOR_TEXT: Color = Color::Rgb(192, 202, 245);       // Light text #c0caf5
pub const COLOR_SUBTLE: Color = Color::Rgb(65, 72, 104);       // Subtle borders #414868
pub const COLOR_BACKGROUND: Color = Color::Rgb(26, 27, 38);    // Dark background #1a1b26

/// Title style - bold primary color
pub fn title() -> Style {
    Style::default()
        .fg(COLOR_PRIMARY)
        .add_modifier(Modifier::BOLD)
}

/// Subtitle style - italic secondary color
pub fn subtitle() -> Style {
    Style::default()
        .fg(COLOR_SECONDARY)
        .add_modifier(Modifier::ITALIC)
}

/// Regular text style
pub fn text() -> Style {
    Style::default().fg(COLOR_TEXT)
}

/// Muted/help text style
pub fn muted() -> Style {
    Style::default().fg(COLOR_MUTED)
}

/// Selected/highlighted item style
pub fn selected() -> Style {
    Style::default()
        .fg(COLOR_BACKGROUND)
        .bg(COLOR_PRIMARY)
        .add_modifier(Modifier::BOLD)
}

/// Normal menu item style
pub fn menu_item() -> Style {
    Style::default().fg(COLOR_TEXT)
}

/// Accent text style (links, highlights)
pub fn accent() -> Style {
    Style::default().fg(COLOR_ACCENT)
}

/// Warning style
pub fn warning() -> Style {
    Style::default().fg(COLOR_WARNING)
}

/// Error style
pub fn error() -> Style {
    Style::default().fg(COLOR_ERROR)
}

/// Tag/badge style
pub fn tag() -> Style {
    Style::default()
        .fg(COLOR_BACKGROUND)
        .bg(COLOR_SECONDARY)
}

/// Cursor/pointer style
pub fn cursor() -> Style {
    Style::default()
        .fg(COLOR_ACCENT)
        .add_modifier(Modifier::BOLD)
}

/// Border style
pub fn border() -> Style {
    Style::default().fg(COLOR_SUBTLE)
}

/// Header border style  
pub fn header_border() -> Style {
    Style::default().fg(COLOR_PRIMARY)
}

/// Generate a horizontal divider string
pub fn divider(width: u16) -> String {
    "─".repeat(width as usize)
}

/// Code block style - distinct background
pub fn code() -> Style {
    Style::default()
        .fg(COLOR_TEXT)
        .bg(Color::Rgb(36, 40, 59))  // Slightly lighter than background
}

/// Code block language label
pub fn code_lang() -> Style {
    Style::default()
        .fg(COLOR_MUTED)
        .bg(Color::Rgb(36, 40, 59))
        .add_modifier(Modifier::ITALIC)
}

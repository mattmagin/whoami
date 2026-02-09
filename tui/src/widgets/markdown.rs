//! Markdown rendering widget - renders markdown text with styled output

use ratatui::{
    style::Modifier,
    text::{Line, Span},
};

use super::wrap_text;
use crate::styles;

/// Render a single markdown line with appropriate styling
///
/// Handles:
/// - `# `, `## `, `### ` headings
/// - `- ` list items
/// - `- **` bold list items
/// - `1. `, `2. `, `3. ` numbered lists
/// - `**Label:** value` bold labels
/// - `*italic*` text
/// - `---` horizontal dividers
pub fn render_line(line: &str) -> Line<'static> {
    let text = line.to_string();

    if text.starts_with("# ") {
        Line::from(Span::styled(text[2..].to_string(), styles::title()))
    } else if text.starts_with("## ") {
        Line::from(Span::styled(text[3..].to_string(), styles::subtitle()))
    } else if text.starts_with("### ") {
        Line::from(Span::styled(text[4..].to_string(), styles::accent()))
    } else if text.starts_with("- **") {
        // List item with bold start
        Line::from(vec![
            Span::styled("  • ", styles::accent()),
            Span::styled(text[4..].to_string(), styles::text()),
        ])
    } else if text.starts_with("- ") {
        Line::from(vec![
            Span::styled("  • ", styles::accent()),
            Span::styled(text[2..].to_string(), styles::text()),
        ])
    } else if text.starts_with("1. ") || text.starts_with("2. ") || text.starts_with("3. ") {
        Line::from(vec![
            Span::styled(format!("  {}. ", &text[0..1]), styles::accent()),
            Span::styled(text[3..].to_string(), styles::text()),
        ])
    } else if text.starts_with("**") && text.contains(":**") {
        // Bold label like "**Languages:** ..."
        if let Some(idx) = text.find(":**") {
            let label = &text[2..idx];
            let rest = text[idx + 3..].trim_end_matches("**");
            Line::from(vec![
                Span::styled(
                    format!("{}:", label),
                    styles::text().add_modifier(Modifier::BOLD),
                ),
                Span::styled(rest.to_string(), styles::text()),
            ])
        } else {
            Line::from(Span::styled(text, styles::text()))
        }
    } else if text.starts_with('*') && text.ends_with('*') && !text.starts_with("**") && text.len() > 2
    {
        // Italic text
        Line::from(Span::styled(
            text[1..text.len() - 1].to_string(),
            styles::muted().add_modifier(Modifier::ITALIC),
        ))
    } else if text == "---" {
        Line::from(Span::styled(
            "────────────────────────────────────────",
            styles::border(),
        ))
    } else {
        Line::from(Span::styled(text, styles::text()))
    }
}

/// Render multiple markdown lines
#[allow(dead_code)]
pub fn render_lines(content: &str) -> Vec<Line<'static>> {
    content.lines().map(render_line).collect()
}

/// Markdown content holder for rendering with word wrapping support
pub struct Markdown {
    lines: Vec<String>,
    wrap_width: Option<usize>,
}

impl Markdown {
    /// Create from raw markdown content (no wrapping)
    pub fn new(content: &str) -> Self {
        Self {
            lines: content.lines().map(|s| s.to_string()).collect(),
            wrap_width: None,
        }
    }

    /// Create with word wrapping at specified width
    pub fn wrapped(content: &str, width: usize) -> Self {
        let wrapped = wrap_text(content, width);
        Self {
            lines: wrapped,
            wrap_width: Some(width),
        }
    }

    /// Get total line count (after wrapping if applicable)
    pub fn len(&self) -> usize {
        self.lines.len()
    }

    /// Check if empty
    #[allow(dead_code)]
    pub fn is_empty(&self) -> bool {
        self.lines.is_empty()
    }

    /// Get current wrap width
    #[allow(dead_code)]
    pub fn wrap_width(&self) -> Option<usize> {
        self.wrap_width
    }

    /// Render a range of lines (for viewport scrolling)
    pub fn render_range(&self, start: usize, end: usize) -> Vec<Line<'static>> {
        self.lines[start.min(self.lines.len())..end.min(self.lines.len())]
            .iter()
            .map(|s| render_line(s))
            .collect()
    }

    /// Render all lines
    #[allow(dead_code)]
    pub fn render_all(&self) -> Vec<Line<'static>> {
        self.lines.iter().map(|s| render_line(s)).collect()
    }
}

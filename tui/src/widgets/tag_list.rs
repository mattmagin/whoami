//! TagList widget - renders a row of styled tag badges

use ratatui::text::{Line, Span};

use crate::styles;

/// A list of tags rendered as styled badges
///
/// # Example
/// ```
/// let tags = TagList::new(&["Go", "TUI", "CLI"]);
/// let line = tags.to_line();
/// ```
pub struct TagList<'a> {
    tags: Vec<&'a str>,
    prefix: Option<Span<'static>>,
}

impl<'a> TagList<'a> {
    /// Create a new tag list from a slice of string slices
    #[allow(dead_code)]
    pub fn new(tags: &[&'a str]) -> Self {
        Self {
            tags: tags.to_vec(),
            prefix: None,
        }
    }

    /// Create from a Vec of static strings (common for content loaded from JSON)
    pub fn from_vec(tags: &[&'a str]) -> Self {
        Self {
            tags: tags.to_vec(),
            prefix: None,
        }
    }

    /// Add a prefix span before the tags (e.g., indentation)
    pub fn prefix(mut self, prefix: Span<'static>) -> Self {
        self.prefix = Some(prefix);
        self
    }

    /// Add indentation before the tags
    pub fn indent(self, spaces: usize) -> Self {
        self.prefix(Span::raw(" ".repeat(spaces)))
    }

    /// Convert to a Line for rendering
    pub fn to_line(&self) -> Line<'static> {
        let mut spans = Vec::new();

        if let Some(prefix) = &self.prefix {
            spans.push(prefix.clone());
        }

        for tag in &self.tags {
            spans.push(Span::styled(format!(" {} ", tag), styles::tag()));
            spans.push(Span::raw(" "));
        }

        Line::from(spans)
    }

    /// Convert to spans (useful when combining with other content)
    pub fn to_spans(&self) -> Vec<Span<'static>> {
        let mut spans = Vec::new();

        for tag in &self.tags {
            spans.push(Span::styled(format!(" {} ", tag), styles::tag()));
            spans.push(Span::raw(" "));
        }

        spans
    }
}

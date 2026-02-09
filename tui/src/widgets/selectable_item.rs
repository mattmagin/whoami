//! SelectableItem widget - a list item with cursor selection styling

use ratatui::{
    style::{Modifier, Style},
    text::{Line, Span},
};

use crate::styles;

/// A selectable list item with cursor and highlight styling
///
/// # Example
/// ```
/// SelectableItem::new("Blog Post Title")
///     .selected(is_selected)
///     .suffix(Span::styled("2026-02-05", styles::muted()))
///     .to_line()
/// ```
pub struct SelectableItem {
    text: String,
    selected: bool,
    suffix: Option<Span<'static>>,
    badge: Option<Span<'static>>,
    unselected_style: Option<Style>,
}

impl SelectableItem {
    /// Create a new selectable item
    pub fn new(text: impl Into<String>) -> Self {
        Self {
            text: text.into(),
            selected: false,
            suffix: None,
            badge: None,
            unselected_style: None,
        }
    }

    /// Set whether this item is currently selected
    pub fn selected(mut self, selected: bool) -> Self {
        self.selected = selected;
        self
    }

    /// Add a suffix span after the main text (e.g., date, count)
    pub fn suffix(mut self, suffix: Span<'static>) -> Self {
        self.suffix = Some(suffix);
        self
    }

    /// Add a badge/icon after the text (e.g., featured star)
    pub fn badge(mut self, badge: Span<'static>) -> Self {
        self.badge = Some(badge);
        self
    }

    /// Set custom style for unselected state (default is text style)
    pub fn unselected_style(mut self, style: Style) -> Self {
        self.unselected_style = Some(style);
        self
    }

    /// Convert to a Line for rendering
    pub fn to_line(&self) -> Line<'static> {
        let mut spans = Vec::new();

        if self.selected {
            // Selected: ▸ [highlighted text] [badge] [suffix]
            spans.push(Span::styled("▸ ", styles::cursor()));
            spans.push(Span::styled(
                format!(" {} ", self.text),
                styles::selected(),
            ));
        } else {
            // Unselected: "  " [text] [badge] [suffix]
            spans.push(Span::raw("  "));
            let text_style = self.unselected_style.unwrap_or_else(styles::text);
            spans.push(Span::styled(self.text.clone(), text_style));
        }

        // Badge (e.g., featured star)
        if let Some(badge) = &self.badge {
            spans.push(badge.clone());
        }

        // Suffix (e.g., date)
        if let Some(suffix) = &self.suffix {
            spans.push(Span::raw("  "));
            spans.push(suffix.clone());
        }

        Line::from(spans)
    }
}

/// Helper to create a menu item with hotkey display
pub struct MenuItem {
    key: char,
    label: String,
    description: String,
    selected: bool,
}

impl MenuItem {
    /// Create a new menu item
    pub fn new(key: char, label: impl Into<String>, description: impl Into<String>) -> Self {
        Self {
            key,
            label: label.into(),
            description: description.into(),
            selected: false,
        }
    }

    /// Set whether this item is selected
    pub fn selected(mut self, selected: bool) -> Self {
        self.selected = selected;
        self
    }

    /// Convert to a Line for rendering
    pub fn to_line(&self) -> Line<'static> {
        if self.selected {
            Line::from(vec![
                Span::styled("▸ ", styles::cursor()),
                Span::styled(format!(" {} ", self.label), styles::selected()),
                Span::styled(format!(" {}", self.description), styles::muted()),
            ])
        } else {
            Line::from(vec![
                Span::raw("  "),
                Span::styled(format!("[{}]", self.key), styles::accent()),
                Span::styled(format!(" {}", self.label), styles::menu_item()),
                Span::styled(format!(" {}", self.description), styles::muted()),
            ])
        }
    }
}

/// Create a featured badge span
pub fn featured_badge() -> Span<'static> {
    Span::styled(" ★", styles::warning())
}

/// Create an accent-bold style for unselected project names
pub fn accent_bold() -> Style {
    styles::accent().add_modifier(Modifier::BOLD)
}

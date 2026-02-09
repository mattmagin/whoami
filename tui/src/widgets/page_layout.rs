//! PageLayout widget - standard page structure with header, dividers, content, and help text

use ratatui::{
    layout::{Constraint, Layout, Rect},
    style::Style,
    widgets::{Paragraph, Scrollbar, ScrollbarOrientation, ScrollbarState},
    Frame,
};

use crate::styles::{self, COLOR_PRIMARY, COLOR_SUBTLE};

/// A standard page layout with header, dividers, content area, and help text
///
/// # Example
/// ```
/// PageLayout::new("📝 Blog")
///     .help("↑/k up • ↓/j down • esc back")
///     .scroll_state(viewport, content_length, viewport_height)
///     .render(frame, area, |f, content_area| {
///         // Render content here
///     });
/// ```
pub struct PageLayout {
    title: String,
    help_text: String,
    scroll_state: Option<ScrollState>,
}

/// Scroll state for rendering scrollbar
struct ScrollState {
    position: usize,
    content_length: usize,
    viewport_height: usize,
}

impl PageLayout {
    /// Create a new page layout with the given title
    pub fn new(title: impl Into<String>) -> Self {
        Self {
            title: title.into(),
            help_text: String::new(),
            scroll_state: None,
        }
    }

    /// Set the help text shown at the bottom
    pub fn help(mut self, text: impl Into<String>) -> Self {
        self.help_text = text.into();
        self
    }

    /// Set scroll info to display percentage indicator (legacy API)
    #[allow(dead_code)]
    pub fn scroll_info(mut self, info: Option<(usize, usize)>) -> Self {
        if let Some((viewport, max_scroll)) = info {
            self.scroll_state = Some(ScrollState {
                position: viewport,
                content_length: max_scroll + 1, // Convert max_scroll to content_length
                viewport_height: 1,
            });
        }
        self
    }

    /// Set scroll state for scrollbar rendering
    pub fn scroll_state(mut self, position: usize, content_length: usize, viewport_height: usize) -> Self {
        if content_length > viewport_height {
            self.scroll_state = Some(ScrollState {
                position,
                content_length,
                viewport_height,
            });
        }
        self
    }

    /// Render the page layout with a content callback
    pub fn render<F>(self, frame: &mut Frame, area: Rect, content_fn: F)
    where
        F: FnOnce(&mut Frame, Rect),
    {
        let chunks = Layout::vertical([
            Constraint::Length(1), // Title
            Constraint::Length(1), // Divider
            Constraint::Min(1),    // Content
            Constraint::Length(1), // Divider
            Constraint::Length(1), // Help
        ])
        .split(area);

        // Header
        let header = Paragraph::new(self.title).style(styles::title());
        frame.render_widget(header, chunks[0]);

        // Top divider
        let divider = Paragraph::new(styles::divider(area.width)).style(styles::border());
        frame.render_widget(divider, chunks[1]);

        // Content area - reserve 1 column for scrollbar if scrollable
        let content_area = if self.scroll_state.is_some() {
            Rect::new(
                chunks[2].x,
                chunks[2].y,
                chunks[2].width.saturating_sub(1),
                chunks[2].height,
            )
        } else {
            chunks[2]
        };

        // Call user's render function
        content_fn(frame, content_area);

        // Scrollbar (if content is scrollable)
        if let Some(scroll) = &self.scroll_state {
            let scrollbar = Scrollbar::new(ScrollbarOrientation::VerticalRight)
                .begin_symbol(Some("▲"))
                .end_symbol(Some("▼"))
                .track_symbol(Some("│"))
                .thumb_symbol("█")
                .track_style(Style::default().fg(COLOR_SUBTLE))
                .thumb_style(Style::default().fg(COLOR_PRIMARY))
                .begin_style(Style::default().fg(COLOR_SUBTLE))
                .end_style(Style::default().fg(COLOR_SUBTLE));

            // Calculate max scroll range (how far we can scroll)
            let max_scroll = scroll.content_length.saturating_sub(scroll.viewport_height);
            
            // ScrollbarState expects:
            // - content_length: the maximum scrollable range (not total content)
            // - position: current scroll position within that range
            let mut scrollbar_state = ScrollbarState::new(max_scroll.max(1))
                .position(scroll.position);

            // Scrollbar area is the right edge of the content chunk
            let scrollbar_area = Rect::new(
                chunks[2].x + chunks[2].width.saturating_sub(1),
                chunks[2].y,
                1,
                chunks[2].height,
            );

            frame.render_stateful_widget(scrollbar, scrollbar_area, &mut scrollbar_state);
        }

        // Bottom divider
        let divider2 = Paragraph::new(styles::divider(area.width)).style(styles::border());
        frame.render_widget(divider2, chunks[3]);

        // Help text with optional scroll percentage
        let help_with_scroll = if let Some(scroll) = &self.scroll_state {
            let max_scroll = scroll.content_length.saturating_sub(scroll.viewport_height);
            if max_scroll > 0 {
                let percentage = (scroll.position * 100) / max_scroll;
                format!("{} [{}%]", self.help_text, percentage.min(100))
            } else {
                self.help_text
            }
        } else {
            self.help_text
        };

        let help = Paragraph::new(help_with_scroll).style(styles::muted());
        frame.render_widget(help, chunks[4]);
    }

    /// Get the content area rect without rendering (useful for calculating scroll bounds)
    pub fn content_area(area: Rect) -> Rect {
        let chunks = Layout::vertical([
            Constraint::Length(1), // Title
            Constraint::Length(1), // Divider
            Constraint::Min(1),    // Content
            Constraint::Length(1), // Divider
            Constraint::Length(1), // Help
        ])
        .split(area);
        chunks[2]
    }
}

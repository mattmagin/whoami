//! Resume view with markdown rendering and scrolling

use ratatui::{
    layout::Rect,
    widgets::Paragraph,
    Frame,
};

use crate::content::RESUME;
use crate::widgets::{Markdown, PageLayout};

/// Resume view model
pub struct ResumeView {
    viewport: usize,
    max_scroll: usize,
    last_width: u16,
    markdown: Markdown,
}

impl ResumeView {
    pub fn new() -> Self {
        Self {
            viewport: 0,
            max_scroll: 0,
            last_width: 0,
            markdown: Markdown::new(&RESUME),
        }
    }

    pub fn scroll_up(&mut self) {
        if self.viewport > 0 {
            self.viewport -= 1;
        }
    }

    pub fn scroll_down(&mut self) {
        if self.viewport < self.max_scroll {
            self.viewport += 1;
        }
    }

    pub fn page_up(&mut self) {
        self.viewport = self.viewport.saturating_sub(10);
    }

    pub fn page_down(&mut self) {
        self.viewport = (self.viewport + 10).min(self.max_scroll);
    }

    /// Re-wrap content if terminal width changed
    fn update_wrap(&mut self, width: u16) {
        if width != self.last_width && width > 0 {
            // Account for scrollbar
            let wrap_width = width.saturating_sub(2) as usize;
            self.markdown = Markdown::wrapped(&RESUME, wrap_width);
            self.last_width = width;
            // Reset viewport to avoid being past the end
            self.viewport = 0;
        }
    }

    pub fn render(&mut self, frame: &mut Frame, area: Rect) {
        let content_area = PageLayout::content_area(area);
        
        // Re-wrap if width changed
        self.update_wrap(content_area.width);
        
        let viewable_height = content_area.height as usize;
        let content_length = self.markdown.len();
        
        // Calculate and store scroll bounds for use in scroll methods
        self.max_scroll = content_length.saturating_sub(viewable_height);
        
        // Clamp viewport to valid range
        self.viewport = self.viewport.min(self.max_scroll);

        PageLayout::new("📄 Resume")
            .help("↑/k up • ↓/j down • u/d page up/down • esc back")
            .scroll_state(self.viewport, content_length, viewable_height)
            .render(frame, area, |f, content_rect| {
                let end = (self.viewport + viewable_height).min(content_length);
                let visible_lines = self.markdown.render_range(self.viewport, end);
                let content = Paragraph::new(visible_lines);
                f.render_widget(content, content_rect);
            });
    }
}

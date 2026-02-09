//! Projects view with project cards

use ratatui::{
    layout::Rect,
    text::{Line, Span},
    widgets::Paragraph,
    Frame,
};

use crate::content::PROJECTS;
use crate::styles;
use crate::widgets::{accent_bold, featured_badge, PageLayout, SelectableItem, TagList};

/// Projects view model
pub struct ProjectsView {
    cursor: usize,
}

impl ProjectsView {
    pub fn new() -> Self {
        Self { cursor: 0 }
    }

    pub fn cursor_up(&mut self) {
        if self.cursor > 0 {
            self.cursor -= 1;
        }
    }

    pub fn cursor_down(&mut self) {
        if self.cursor < PROJECTS.len() - 1 {
            self.cursor += 1;
        }
    }

    pub fn render(&self, frame: &mut Frame, area: Rect) {
        PageLayout::new("🚀 Projects")
            .help("↑/k up • ↓/j down • esc back")
            .render(frame, area, |f, content_area| {
                // Sort projects: featured first, then others
                let mut featured: Vec<_> = PROJECTS.iter().filter(|p| p.featured).collect();
                let mut other: Vec<_> = PROJECTS.iter().filter(|p| !p.featured).collect();
                featured.append(&mut other);

                // Build project list
                let mut lines: Vec<Line> = Vec::new();
                for (i, project) in featured.iter().enumerate() {
                    let is_selected = i == self.cursor;

                    // Name line with featured badge
                    let mut item = SelectableItem::new(project.name)
                        .selected(is_selected)
                        .unselected_style(accent_bold());

                    if project.featured {
                        item = item.badge(featured_badge());
                    }

                    lines.push(item.to_line());

                    // Description
                    lines.push(Line::from(vec![
                        Span::raw("    "),
                        Span::styled(project.description.to_string(), styles::text()),
                    ]));

                    // Tech stack tags
                    lines.push(TagList::from_vec(&project.tech_stack).indent(4).to_line());

                    // Links
                    let mut link_parts = Vec::new();
                    if let Some(github) = project.github_url {
                        link_parts.push(format!("GitHub: {}", github));
                    }
                    if let Some(url) = project.url {
                        link_parts.push(format!("Live: {}", url));
                    }
                    if !link_parts.is_empty() {
                        lines.push(Line::from(vec![
                            Span::raw("    "),
                            Span::styled(link_parts.join(" • "), styles::muted()),
                        ]));
                    }

                    lines.push(Line::from(""));
                }

                let content = Paragraph::new(lines);
                f.render_widget(content, content_area);
            });
    }
}

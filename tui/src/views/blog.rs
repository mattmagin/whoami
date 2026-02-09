//! Blog view with list and detail modes

use crossterm::event::{KeyCode, KeyEvent};
use ratatui::{
    layout::Rect,
    style::Modifier,
    text::{Line, Span},
    widgets::Paragraph,
    Frame,
};

use crate::keymap::{self, Action};
use crate::view::{View, ViewResult};
use crate::content::{Post, POSTS};
use crate::styles;
use crate::widgets::{
    render_markdown_line, wrap_text, CodeBlock, PageLayout, SelectableItem, TagList,
};

/// Blog display mode
#[derive(Clone, Copy, PartialEq)]
pub enum BlogMode {
    List,
    Detail,
}

/// Blog view model
pub struct BlogView {
    mode: BlogMode,
    cursor: usize,
    selected_idx: Option<usize>,
    viewport: usize,
    max_scroll: usize,
}

impl BlogView {
    pub fn new() -> Self {
        Self {
            mode: BlogMode::List,
            cursor: 0,
            selected_idx: None,
            viewport: 0,
            max_scroll: 0,
        }
    }

    pub fn cursor_up(&mut self) {
        match self.mode {
            BlogMode::List => {
                if self.cursor > 0 {
                    self.cursor -= 1;
                }
            }
            BlogMode::Detail => {
                if self.viewport > 0 {
                    self.viewport -= 1;
                }
            }
        }
    }

    pub fn cursor_down(&mut self) {
        match self.mode {
            BlogMode::List => {
                if self.cursor < POSTS.len() - 1 {
                    self.cursor += 1;
                }
            }
            BlogMode::Detail => {
                if self.viewport < self.max_scroll {
                    self.viewport += 1;
                }
            }
        }
    }

    pub fn select(&mut self) {
        if self.mode == BlogMode::List && !POSTS.is_empty() {
            self.selected_idx = Some(self.cursor);
            self.mode = BlogMode::Detail;
            self.viewport = 0;
            self.max_scroll = 0;
        }
    }

    pub fn back(&mut self) -> bool {
        if self.mode == BlogMode::Detail {
            self.mode = BlogMode::List;
            self.selected_idx = None;
            self.viewport = 0;
            self.max_scroll = 0;
            true
        } else {
            false
        }
    }

    /// Handle key input for the blog view
    pub fn handle_key(&mut self, key: KeyEvent) -> ViewResult {
        // Check for navigation shortcuts (only in list mode)
        if self.mode == BlogMode::List {
            if let KeyCode::Char(c) = key.code {
                if let Some(view) = View::from_shortcut(c) {
                    return ViewResult::NavigateTo(view);
                }
            }
        }

        // Check list keys
        if let Some(action) = keymap::match_key(key, keymap::LIST_KEYS) {
            return match action {
                Action::Back => {
                    if self.back() {
                        ViewResult::Handled
                    } else {
                        ViewResult::Back
                    }
                }
                Action::CursorUp => {
                    self.cursor_up();
                    ViewResult::Handled
                }
                Action::CursorDown => {
                    self.cursor_down();
                    ViewResult::Handled
                }
                Action::Select => {
                    self.select();
                    ViewResult::Handled
                }
                _ => ViewResult::Ignored,
            };
        }

        ViewResult::Ignored
    }

    pub fn render(&mut self, frame: &mut Frame, area: Rect) {
        match self.mode {
            BlogMode::List => self.render_list(frame, area),
            BlogMode::Detail => self.render_post(frame, area),
        }
    }

    fn render_list(&self, frame: &mut Frame, area: Rect) {
        PageLayout::new("📝 Blog")
            .help("↑/k up • ↓/j down • enter read • esc back")
            .render(frame, area, |f, content_area| {
                let mut lines: Vec<Line> = Vec::new();

                for (i, post) in POSTS.iter().enumerate() {
                    // Title line with date suffix
                    let item = SelectableItem::new(post.title)
                        .selected(i == self.cursor)
                        .suffix(Span::styled(post.published.to_string(), styles::muted()));
                    lines.push(item.to_line());

                    // Excerpt line
                    lines.push(Line::from(vec![
                        Span::raw("    "),
                        Span::styled(post.excerpt.to_string(), styles::muted()),
                    ]));
                    lines.push(Line::from(""));
                }

                let content = Paragraph::new(lines);
                f.render_widget(content, content_area);
            });
    }

    fn render_post(&mut self, frame: &mut Frame, area: Rect) {
        let post = match self.selected_idx {
            Some(idx) if idx < POSTS.len() => &POSTS[idx],
            _ => return,
        };

        let content_area = PageLayout::content_area(area);
        // Account for scrollbar (1 col) when calculating wrap width
        let wrap_width = content_area.width.saturating_sub(2) as usize;

        // Parse and wrap content with code blocks
        let content_lines = render_post_content(post, wrap_width);

        // Adjust for the extra header line (date + tags)
        let viewable_height = content_area.height.saturating_sub(1) as usize;
        let content_length = content_lines.len();

        // Calculate and store scroll bounds
        self.max_scroll = content_length.saturating_sub(viewable_height);
        
        // Clamp viewport to valid range
        self.viewport = self.viewport.min(self.max_scroll);

        PageLayout::new(format!("📝 {}", post.title))
            .help("↑/k up • ↓/j down • esc back to list")
            .scroll_state(self.viewport, content_length, viewable_height)
            .render(frame, area, |f, content_rect| {
                // Date and tags on first line
                let mut meta_spans = vec![
                    Span::styled(
                        format!("Published: {}", post.published),
                        styles::muted().add_modifier(Modifier::ITALIC),
                    ),
                    Span::raw("  "),
                ];
                meta_spans.extend(TagList::from_vec(&post.tags).to_spans());

                let meta = Paragraph::new(Line::from(meta_spans));
                let meta_area = Rect::new(content_rect.x, content_rect.y, content_rect.width, 1);
                f.render_widget(meta, meta_area);

                // Content with scrolling
                let text_area = Rect::new(
                    content_rect.x,
                    content_rect.y + 1,
                    content_rect.width,
                    content_rect.height.saturating_sub(1),
                );

                let end = (self.viewport + viewable_height).min(content_length);
                let visible_lines: Vec<Line> = content_lines[self.viewport.min(content_length)..end]
                    .iter()
                    .map(content_line_to_line)
                    .collect();

                let content = Paragraph::new(visible_lines);
                f.render_widget(content, text_area);
            });
    }
}

/// Represents a processed content line - either regular text or part of a code block
enum ContentLine {
    Text(String),
    CodeBlockLine(Line<'static>),
}

/// Parse markdown content, wrap text, and render code blocks
fn render_post_content(post: &Post, wrap_width: usize) -> Vec<ContentLine> {
    let mut result = Vec::new();
    let mut in_code_block = false;
    let mut code_buffer = String::new();
    let mut code_lang = String::new();

    for line in post.content.lines() {
        if line.starts_with("```") {
            if in_code_block {
                // End of code block - render it using CodeBlock widget
                let block = CodeBlock::new(&code_buffer)
                    .language(&code_lang)
                    .width((wrap_width as u16).min(72));

                for rendered_line in block.to_lines() {
                    result.push(ContentLine::CodeBlockLine(rendered_line));
                }

                code_buffer.clear();
                code_lang.clear();
                in_code_block = false;
            } else {
                // Start of code block
                code_lang = line.trim_start_matches("```").to_string();
                if code_lang.is_empty() {
                    code_lang = "code".to_string();
                }
                in_code_block = true;
            }
        } else if in_code_block {
            // Accumulate code lines (no wrapping for code)
            if !code_buffer.is_empty() {
                code_buffer.push('\n');
            }
            code_buffer.push_str(line);
        } else {
            // Regular markdown line - wrap it
            let wrapped = wrap_text(line, wrap_width);
            for wrapped_line in wrapped {
                result.push(ContentLine::Text(wrapped_line));
            }
        }
    }

    result
}

/// Convert ContentLine to a renderable Line
fn content_line_to_line(line: &ContentLine) -> Line<'static> {
    match line {
        ContentLine::Text(text) => render_markdown_line(text),
        ContentLine::CodeBlockLine(line) => line.clone(),
    }
}

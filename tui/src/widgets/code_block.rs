//! Code block widget - renders code with syntax-highlighted box styling

use ratatui::{
    buffer::Buffer,
    layout::Rect,
    text::{Line, Span},
    widgets::Widget,
};
use unicode_width::UnicodeWidthStr;

use crate::styles;

/// A styled code block widget with borders and background
/// 
/// # Example
/// ```
/// use crate::widgets::CodeBlock;
/// 
/// let code = CodeBlock::new("fn main() {\n    println!(\"Hello\");\n}")
///     .language("rust")
///     .width(60);
/// 
/// frame.render_widget(code, area);
/// ```
pub struct CodeBlock {
    code: String,
    language: Option<String>,
    width: u16,
}

impl CodeBlock {
    /// Create a new code block with the given code content
    pub fn new(code: impl Into<String>) -> Self {
        Self {
            code: code.into(),
            language: None,
            width: 70,
        }
    }

    /// Set the language label (displayed in header)
    pub fn language(mut self, lang: impl Into<String>) -> Self {
        self.language = Some(lang.into());
        self
    }

    /// Set the width of the code block
    pub fn width(mut self, width: u16) -> Self {
        self.width = width;
        self
    }

    /// Render the header line: ┌─ lang ─────────────────────────────────┐
    fn render_header(&self) -> Line<'static> {
        let w = self.width as usize;
        let lang_display = self.language.as_deref().unwrap_or("code");
        
        // Build: ┌─ lang ─...─┐
        // Use display width for accurate terminal rendering
        let prefix = format!("┌─ {} ", lang_display);
        let prefix_width = prefix.width();
        let suffix = "┐";
        let suffix_width = suffix.width();
        let remaining = w.saturating_sub(prefix_width + suffix_width);
        let header = format!("{}{}{}", prefix, "─".repeat(remaining), suffix);
        
        Line::from(Span::styled(header, styles::code_lang()))
    }

    /// Render a code line: │ code content                            │
    fn render_code_line(&self, line: &str) -> Line<'static> {
        let w = self.width as usize;
        // "│ " = 2 chars, " │" = 2 chars, so content = w - 4
        let content_width = w.saturating_sub(4);
        let padded = format!("{:<width$}", line, width = content_width);
        Line::from(vec![
            Span::styled("│ ", styles::code_lang()),
            Span::styled(padded, styles::code()),
            Span::styled(" │", styles::code_lang()),
        ])
    }

    /// Render the footer line: └────────────────────────────────────────┘
    fn render_footer(&self) -> Line<'static> {
        let w = self.width as usize;
        let prefix = "└";
        let suffix = "┘";
        let border_width = w.saturating_sub(prefix.width() + suffix.width());
        let border = "─".repeat(border_width);
        Line::from(Span::styled(format!("{}{}{}", prefix, border, suffix), styles::code_lang()))
    }

    /// Convert to lines for rendering
    pub fn to_lines(&self) -> Vec<Line<'static>> {
        let mut lines = Vec::new();
        
        lines.push(self.render_header());
        
        for code_line in self.code.lines() {
            lines.push(self.render_code_line(code_line));
        }
        
        lines.push(self.render_footer());
        
        lines
    }
}

impl Widget for CodeBlock {
    fn render(self, area: Rect, buf: &mut Buffer) {
        let lines = self.to_lines();
        
        for (i, line) in lines.iter().enumerate() {
            if i >= area.height as usize {
                break;
            }
            
            let y = area.y + i as u16;
            let mut x = area.x;
            
            for span in line.spans.iter() {
                let width = span.content.chars().count() as u16;
                buf.set_string(x, y, &span.content, span.style);
                x += width;
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_code_block_creates_lines() {
        let block = CodeBlock::new("let x = 1;")
            .language("rust")
            .width(40);
        
        let lines = block.to_lines();
        assert_eq!(lines.len(), 3); // header + 1 code line + footer
    }
}

//! TextInput widget - a form input field with label and focus state

use ratatui::{
    layout::Rect,
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::styles;

/// A styled text input field with label
///
/// # Example
/// ```
/// TextInput::new("Email", &self.email)
///     .focused(self.focused_field == ContactField::Email)
///     .render(frame, area);
/// ```
pub struct TextInput<'a> {
    label: &'a str,
    value: &'a str,
    focused: bool,
    label_width: u16,
    input_width: u16,
}

impl<'a> TextInput<'a> {
    /// Create a new text input
    pub fn new(label: &'a str, value: &'a str) -> Self {
        Self {
            label,
            value,
            focused: false,
            label_width: 12,
            input_width: 50,
        }
    }

    /// Set whether this input is focused
    pub fn focused(mut self, focused: bool) -> Self {
        self.focused = focused;
        self
    }

    /// Set custom label width
    #[allow(dead_code)]
    pub fn label_width(mut self, width: u16) -> Self {
        self.label_width = width;
        self
    }

    /// Set custom input width
    #[allow(dead_code)]
    pub fn input_width(mut self, width: u16) -> Self {
        self.input_width = width;
        self
    }

    /// Render the input field
    pub fn render(&self, frame: &mut Frame, area: Rect) {
        let border_style = if self.focused {
            styles::header_border()
        } else {
            styles::border()
        };

        let display_value = if self.focused {
            format!("{}█", self.value)
        } else if self.value.is_empty() {
            "(empty)".to_string()
        } else {
            self.value.to_string()
        };

        let display_style = if self.value.is_empty() && !self.focused {
            styles::muted()
        } else {
            styles::text()
        };

        // Label
        let label_line = Line::from(vec![
            Span::raw("  "),
            Span::styled(format!("{}:", self.label), styles::subtitle()),
        ]);
        let label_widget = Paragraph::new(label_line);
        let label_area = Rect::new(area.x, area.y, self.label_width, 1);
        frame.render_widget(label_widget, label_area);

        // Input box
        let input_block = Block::default()
            .borders(Borders::ALL)
            .border_type(ratatui::widgets::BorderType::Rounded)
            .border_style(border_style);

        let input = Paragraph::new(display_value)
            .style(display_style)
            .block(input_block);

        let input_area = Rect::new(
            area.x + self.label_width,
            area.y,
            self.input_width.min(area.width.saturating_sub(self.label_width + 2)),
            3,
        );
        frame.render_widget(input, input_area);
    }
}

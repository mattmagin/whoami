//! Contact form view

use crossterm::event::{KeyCode, KeyEvent};
use ratatui::{
    layout::{Alignment, Constraint, Layout, Rect},
    style::Modifier,
    text::{Line, Span},
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::keymap::{self, Action};
use crate::view::ViewResult;
use crate::styles;
use crate::widgets::{PageLayout, TextInput};

/// Form field enum
#[derive(Clone, Copy, PartialEq)]
pub enum ContactField {
    Name,
    Email,
    Message,
    Submit,
}

/// Contact form view model
pub struct ContactView {
    focused_field: ContactField,
    name: String,
    email: String,
    message: String,
    submitted: bool,
    error: Option<String>,
}

impl ContactView {
    pub fn new() -> Self {
        Self {
            focused_field: ContactField::Name,
            name: String::new(),
            email: String::new(),
            message: String::new(),
            submitted: false,
            error: None,
        }
    }

    pub fn focus_next(&mut self) {
        self.focused_field = match self.focused_field {
            ContactField::Name => ContactField::Email,
            ContactField::Email => ContactField::Message,
            ContactField::Message => ContactField::Submit,
            ContactField::Submit => ContactField::Submit,
        };
    }

    pub fn focus_prev(&mut self) {
        self.focused_field = match self.focused_field {
            ContactField::Name => ContactField::Name,
            ContactField::Email => ContactField::Name,
            ContactField::Message => ContactField::Email,
            ContactField::Submit => ContactField::Message,
        };
    }

    pub fn type_char(&mut self, c: char) {
        match self.focused_field {
            ContactField::Name => self.name.push(c),
            ContactField::Email => self.email.push(c),
            ContactField::Message => self.message.push(c),
            ContactField::Submit => {}
        }
    }

    pub fn backspace(&mut self) {
        match self.focused_field {
            ContactField::Name => { self.name.pop(); }
            ContactField::Email => { self.email.pop(); }
            ContactField::Message => { self.message.pop(); }
            ContactField::Submit => {}
        }
    }

    pub fn submit(&mut self) -> bool {
        if self.name.is_empty() {
            self.error = Some("Name is required".to_string());
            self.focused_field = ContactField::Name;
            return false;
        }
        if self.email.is_empty() || !self.email.contains('@') {
            self.error = Some("Valid email is required".to_string());
            self.focused_field = ContactField::Email;
            return false;
        }
        if self.message.is_empty() {
            self.error = Some("Message is required".to_string());
            self.focused_field = ContactField::Message;
            return false;
        }

        self.submitted = true;
        self.error = None;
        true
    }

    pub fn reset(&mut self) {
        self.name.clear();
        self.email.clear();
        self.message.clear();
        self.submitted = false;
        self.error = None;
        self.focused_field = ContactField::Name;
    }

    #[allow(dead_code)]
    fn is_submitted(&self) -> bool {
        self.submitted
    }

    /// Handle key input for the contact view
    pub fn handle_key(&mut self, key: KeyEvent) -> ViewResult {
        // If submitted, only allow going back
        if self.submitted {
            if let Some(action) = keymap::match_key(key, keymap::SUBMITTED_KEYS) {
                if action == Action::Back {
                    self.reset();
                    return ViewResult::Back;
                }
            }
            return ViewResult::Ignored;
        }

        // Check form keys
        if let Some(action) = keymap::match_key(key, keymap::FORM_KEYS) {
            return match action {
                Action::Back => ViewResult::Back,
                Action::FocusNext => {
                    self.focus_next();
                    ViewResult::Handled
                }
                Action::FocusPrev => {
                    self.focus_prev();
                    ViewResult::Handled
                }
                Action::Submit => {
                    self.submit();
                    ViewResult::Handled
                }
                Action::Backspace => {
                    self.backspace();
                    ViewResult::Handled
                }
                _ => ViewResult::Ignored,
            };
        }

        // Handle text input (any character)
        if let KeyCode::Char(c) = key.code {
            self.type_char(c);
            return ViewResult::Handled;
        }

        ViewResult::Ignored
    }

    pub fn render(&self, frame: &mut Frame, area: Rect) {
        if self.submitted {
            self.render_success(frame, area);
            return;
        }

        PageLayout::new("📧 Contact")
            .help("tab next • shift+tab prev • enter submit • esc back")
            .render(frame, area, |f, content_area| {
                let chunks = Layout::vertical([
                    Constraint::Length(2),  // Intro
                    Constraint::Length(2),  // Error (if any)
                    Constraint::Length(3),  // Name field
                    Constraint::Length(3),  // Email field
                    Constraint::Length(3),  // Message field
                    Constraint::Length(2),  // Submit button
                    Constraint::Min(1),     // Spacer
                ])
                .split(content_area);

                // Intro
                let intro = Paragraph::new("Have a question or want to work together? Send me a message!")
                    .style(styles::text());
                f.render_widget(intro, chunks[0]);

                // Error message
                if let Some(err) = &self.error {
                    let error_msg = Paragraph::new(format!("⚠ {}", err)).style(styles::error());
                    f.render_widget(error_msg, chunks[1]);
                }

                // Form fields using TextInput widget
                TextInput::new("Name", &self.name)
                    .focused(self.focused_field == ContactField::Name)
                    .render(f, chunks[2]);

                TextInput::new("Email", &self.email)
                    .focused(self.focused_field == ContactField::Email)
                    .render(f, chunks[3]);

                TextInput::new("Message", &self.message)
                    .focused(self.focused_field == ContactField::Message)
                    .render(f, chunks[4]);

                // Submit button
                let submit_style = if self.focused_field == ContactField::Submit {
                    styles::selected()
                } else {
                    ratatui::style::Style::default()
                        .fg(styles::COLOR_BACKGROUND)
                        .bg(styles::COLOR_ACCENT)
                };
                let submit = Paragraph::new("  Submit  ")
                    .style(submit_style)
                    .alignment(Alignment::Left);
                let submit_area = Rect::new(chunks[5].x + 2, chunks[5].y, 12, 1);
                f.render_widget(submit, submit_area);
            });
    }

    fn render_success(&self, frame: &mut Frame, area: Rect) {
        PageLayout::new("📧 Contact")
            .help("esc back to menu")
            .render(frame, area, |f, content_area| {
                // Success box
                let success_block = Block::default()
                    .borders(Borders::ALL)
                    .border_type(ratatui::widgets::BorderType::Rounded)
                    .border_style(ratatui::style::Style::default().fg(styles::COLOR_ACCENT));

                let success_lines = vec![
                    Line::from(""),
                    Line::from(vec![
                        Span::styled("✓ ", styles::accent().add_modifier(Modifier::BOLD)),
                        Span::styled("Message Sent!", styles::accent().add_modifier(Modifier::BOLD)),
                    ]),
                    Line::from(""),
                    Line::from(Span::styled(
                        format!("Thanks for reaching out, {}!", self.name),
                        styles::text(),
                    )),
                    Line::from(Span::styled(
                        format!("I'll get back to you at {} soon.", self.email),
                        styles::text(),
                    )),
                    Line::from(""),
                ];

                let success = Paragraph::new(success_lines)
                    .block(success_block)
                    .alignment(Alignment::Center);

                let success_width = 60.min(content_area.width.saturating_sub(4));
                let success_x = content_area.x + (content_area.width.saturating_sub(success_width)) / 2;
                let success_area = Rect::new(
                    success_x,
                    content_area.y + 2,
                    success_width,
                    8.min(content_area.height),
                );
                f.render_widget(success, success_area);
            });
    }
}

//! Contact form component with input fields and submission

use ratatui::layout::{Alignment, Constraint, Layout, Rect};
use ratatui::style::Modifier;
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, BorderType, Borders, Paragraph};
use tuirealm::command::{Cmd, CmdResult, Direction};
use tuirealm::event::{Key, KeyEvent, KeyModifiers};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::msg::Msg;
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

/// Contact MockComponent - handles the visual representation
pub struct ContactMock {
    props: Props,
    focused_field: ContactField,
    name: String,
    email: String,
    message: String,
    submitted: bool,
    error: Option<String>,
}

impl Default for ContactMock {
    fn default() -> Self {
        Self::new()
    }
}

impl ContactMock {
    pub fn new() -> Self {
        Self {
            props: Props::default(),
            focused_field: ContactField::Name,
            name: String::new(),
            email: String::new(),
            message: String::new(),
            submitted: false,
            error: None,
        }
    }

    fn focus_next(&mut self) {
        self.focused_field = match self.focused_field {
            ContactField::Name => ContactField::Email,
            ContactField::Email => ContactField::Message,
            ContactField::Message => ContactField::Submit,
            ContactField::Submit => ContactField::Submit,
        };
    }

    fn focus_prev(&mut self) {
        self.focused_field = match self.focused_field {
            ContactField::Name => ContactField::Name,
            ContactField::Email => ContactField::Name,
            ContactField::Message => ContactField::Email,
            ContactField::Submit => ContactField::Message,
        };
    }

    fn type_char(&mut self, c: char) {
        match self.focused_field {
            ContactField::Name => self.name.push(c),
            ContactField::Email => self.email.push(c),
            ContactField::Message => self.message.push(c),
            ContactField::Submit => {}
        }
    }

    fn backspace(&mut self) {
        match self.focused_field {
            ContactField::Name => {
                self.name.pop();
            }
            ContactField::Email => {
                self.email.pop();
            }
            ContactField::Message => {
                self.message.pop();
            }
            ContactField::Submit => {}
        }
    }

    fn submit(&mut self) -> bool {
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

    fn reset(&mut self) {
        self.name.clear();
        self.email.clear();
        self.message.clear();
        self.submitted = false;
        self.error = None;
        self.focused_field = ContactField::Name;
    }

    fn render_form(&self, frame: &mut Frame, area: Rect) {
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
                let intro =
                    Paragraph::new("Have a question or want to work together? Send me a message!")
                        .style(styles::text());
                f.render_widget(intro, chunks[0]);

                // Error message
                if let Some(err) = &self.error {
                    let error_msg =
                        Paragraph::new(format!("⚠ {}", err)).style(styles::error());
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
                    .border_type(BorderType::Rounded)
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
                let success_x =
                    content_area.x + (content_area.width.saturating_sub(success_width)) / 2;
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

impl MockComponent for ContactMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        if self.submitted {
            self.render_success(frame, area);
        } else {
            self.render_form(frame, area);
        }
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
        State::One(StateValue::Bool(self.submitted))
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Move(Direction::Down) => {
                self.focus_next();
                CmdResult::Changed(self.state())
            }
            Cmd::Move(Direction::Up) => {
                self.focus_prev();
                CmdResult::Changed(self.state())
            }
            Cmd::Submit => {
                self.submit();
                CmdResult::Changed(self.state())
            }
            Cmd::Cancel => {
                self.reset();
                CmdResult::Changed(self.state())
            }
            Cmd::Type(c) => {
                self.type_char(c);
                CmdResult::Changed(self.state())
            }
            Cmd::Delete => {
                self.backspace();
                CmdResult::Changed(self.state())
            }
            _ => CmdResult::None,
        }
    }
}

/// Contact Component - bridges MockComponent to application messages
pub struct Contact {
    component: ContactMock,
}

impl Default for Contact {
    fn default() -> Self {
        Self::new()
    }
}

impl Contact {
    pub fn new() -> Self {
        Self {
            component: ContactMock::new(),
        }
    }
}

impl Component<Msg, NoUserEvent> for Contact {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        // If submitted, only allow going back
        if self.component.submitted {
            match ev {
                Event::Keyboard(KeyEvent {
                    code: Key::Char('c'),
                    modifiers,
                }) if modifiers.contains(KeyModifiers::CONTROL) => Some(Msg::Quit),
                Event::Keyboard(KeyEvent { code: Key::Esc, .. })
                | Event::Keyboard(KeyEvent {
                    code: Key::Char('q'),
                    ..
                }) => {
                    self.component.reset();
                    Some(Msg::GoBack)
                }
                _ => None,
            }
        } else {
            match ev {
                Event::Keyboard(KeyEvent {
                    code: Key::Char('c'),
                    modifiers,
                }) if modifiers.contains(KeyModifiers::CONTROL) => Some(Msg::Quit),
                Event::Keyboard(KeyEvent { code: Key::Esc, .. }) => Some(Msg::GoBack),
                Event::Keyboard(KeyEvent { code: Key::Tab, .. }) => {
                    self.component.perform(Cmd::Move(Direction::Down));
                    Some(Msg::None)
                }
                Event::Keyboard(KeyEvent {
                    code: Key::BackTab,
                    ..
                }) => {
                    self.component.perform(Cmd::Move(Direction::Up));
                    Some(Msg::None)
                }
                Event::Keyboard(KeyEvent {
                    code: Key::Enter, ..
                }) => {
                    self.component.perform(Cmd::Submit);
                    Some(Msg::None)
                }
                Event::Keyboard(KeyEvent {
                    code: Key::Backspace,
                    ..
                }) => {
                    self.component.perform(Cmd::Delete);
                    Some(Msg::None)
                }
                Event::Keyboard(KeyEvent {
                    code: Key::Char(c),
                    modifiers,
                }) if modifiers.is_empty() || modifiers.contains(KeyModifiers::SHIFT) => {
                    self.component.perform(Cmd::Type(c));
                    Some(Msg::None)
                }
                _ => None,
            }
        }
    }
}

impl MockComponent for Contact {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        self.component.view(frame, area);
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.component.query(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.component.attr(attr, value);
    }

    fn state(&self) -> State {
        self.component.state()
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        self.component.perform(cmd)
    }
}

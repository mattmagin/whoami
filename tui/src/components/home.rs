//! Home view component with ASCII logo, typewriter animation, and navigation menu

use std::time::{Duration, Instant};

use ratatui::layout::{Alignment, Constraint, Layout, Rect};
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::{Block, BorderType, Borders, Paragraph};
use tuirealm::command::{Cmd, CmdResult, Direction};
use tuirealm::event::{Key, KeyEvent, KeyModifiers};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::content::{BIO, LOGO, TYPEWRITER_PHRASES};
use crate::msg::{Msg, ViewId};
use crate::styles;

/// Menu item configuration
struct MenuConfig {
    view: ViewId,
    shortcut: char,
    label: &'static str,
    description: &'static str,
}

const MENU_ITEMS: &[MenuConfig] = &[
    MenuConfig {
        view: ViewId::Home,
        shortcut: 'h',
        label: "Home",
        description: "You are here",
    },
    MenuConfig {
        view: ViewId::Resume,
        shortcut: 'r',
        label: "Resume",
        description: "View my professional experience",
    },
    MenuConfig {
        view: ViewId::Blog,
        shortcut: 'b',
        label: "Blog",
        description: "Read my technical articles",
    },
    MenuConfig {
        view: ViewId::Projects,
        shortcut: 'p',
        label: "Projects",
        description: "Explore my work",
    },
    MenuConfig {
        view: ViewId::Contact,
        shortcut: 'c',
        label: "Contact",
        description: "Get in touch",
    },
];

/// Typewriter animation state
enum TypewriterState {
    Typing,
    PausedAfterType,
    Deleting,
    PausedAfterDelete,
}

/// Home MockComponent - handles the visual representation
pub struct HomeMock {
    props: Props,
    cursor: usize,
    // Typewriter state
    typewriter_state: TypewriterState,
    phrase_idx: usize,
    char_idx: usize,
    display_text: String,
    last_tick: Instant,
}

impl Default for HomeMock {
    fn default() -> Self {
        Self::new()
    }
}

impl HomeMock {
    pub fn new() -> Self {
        Self {
            props: Props::default(),
            cursor: 0,
            typewriter_state: TypewriterState::Typing,
            phrase_idx: 0,
            char_idx: 0,
            display_text: String::new(),
            last_tick: Instant::now(),
        }
    }

    fn cursor_up(&mut self) {
        if self.cursor > 0 {
            self.cursor -= 1;
        }
    }

    fn cursor_down(&mut self) {
        if self.cursor < MENU_ITEMS.len() - 1 {
            self.cursor += 1;
        }
    }

    fn selected_view(&self) -> ViewId {
        MENU_ITEMS[self.cursor].view
    }

    fn tick_typewriter(&mut self) {
        let phrases = &*TYPEWRITER_PHRASES;
        if phrases.is_empty() {
            return;
        }

        let delay = match self.typewriter_state {
            TypewriterState::Typing => Duration::from_millis(50),
            TypewriterState::Deleting => Duration::from_millis(30),
            TypewriterState::PausedAfterType => Duration::from_secs(2),
            TypewriterState::PausedAfterDelete => Duration::from_millis(300),
        };

        if self.last_tick.elapsed() < delay {
            return;
        }

        self.last_tick = Instant::now();

        let current_phrase = phrases[self.phrase_idx];

        match self.typewriter_state {
            TypewriterState::Typing => {
                if self.char_idx < current_phrase.chars().count() {
                    self.char_idx += 1;
                    self.display_text = current_phrase.chars().take(self.char_idx).collect();
                } else {
                    self.typewriter_state = TypewriterState::PausedAfterType;
                }
            }
            TypewriterState::PausedAfterType => {
                self.typewriter_state = TypewriterState::Deleting;
            }
            TypewriterState::Deleting => {
                if self.char_idx > 0 {
                    self.char_idx -= 1;
                    self.display_text = current_phrase.chars().take(self.char_idx).collect();
                } else {
                    self.typewriter_state = TypewriterState::PausedAfterDelete;
                }
            }
            TypewriterState::PausedAfterDelete => {
                self.phrase_idx = (self.phrase_idx + 1) % phrases.len();
                self.typewriter_state = TypewriterState::Typing;
            }
        }
    }

    fn render_menu_item(&self, config: &MenuConfig, selected: bool) -> Line<'static> {
        let pointer = if selected { "▶ " } else { "  " };
        let shortcut = format!("[{}] ", config.shortcut);
        let label = config.label.to_string();
        let desc = format!(" - {}", config.description);

        if selected {
            Line::from(vec![
                Span::styled(pointer, styles::cursor()),
                Span::styled(shortcut, styles::selected()),
                Span::styled(label, styles::selected()),
                Span::styled(desc, styles::selected()),
            ])
        } else {
            Line::from(vec![
                Span::raw(pointer),
                Span::styled(shortcut, styles::accent()),
                Span::styled(label, styles::menu_item()),
                Span::styled(desc, styles::muted()),
            ])
        }
    }
}

impl MockComponent for HomeMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        let chunks = Layout::vertical([
            Constraint::Length(8),  // Logo
            Constraint::Length(2),  // Typewriter
            Constraint::Length(6),  // Bio
            Constraint::Min(10),    // Menu
            Constraint::Length(2),  // Help
        ])
        .split(area);

        // Logo
        let logo = Paragraph::new(*LOGO)
            .style(Style::default().fg(styles::COLOR_PRIMARY).add_modifier(Modifier::BOLD))
            .alignment(Alignment::Center);
        frame.render_widget(logo, chunks[0]);

        // Typewriter tagline
        let typewriter_line = Line::from(vec![
            Span::styled(
                self.display_text.clone(),
                Style::default()
                    .fg(styles::COLOR_SECONDARY)
                    .add_modifier(Modifier::BOLD),
            ),
            Span::styled("█", Style::default().fg(styles::COLOR_PRIMARY)),
        ]);
        let typewriter = Paragraph::new(typewriter_line).alignment(Alignment::Center);
        frame.render_widget(typewriter, chunks[1]);

        // Bio
        let bio = Paragraph::new(*BIO)
            .style(styles::text())
            .alignment(Alignment::Center);
        frame.render_widget(bio, chunks[2]);

        // Menu
        let menu_block = Block::default()
            .borders(Borders::ALL)
            .border_type(BorderType::Rounded)
            .border_style(styles::border());

        let menu_lines: Vec<Line> = MENU_ITEMS
            .iter()
            .enumerate()
            .map(|(i, config)| self.render_menu_item(config, i == self.cursor))
            .collect();

        let menu = Paragraph::new(menu_lines)
            .block(menu_block)
            .alignment(Alignment::Left);

        // Center the menu horizontally
        let menu_width = 60.min(area.width.saturating_sub(4));
        let menu_x = (area.width.saturating_sub(menu_width)) / 2;
        let menu_area = Rect::new(
            menu_x,
            chunks[3].y + 1,
            menu_width,
            (MENU_ITEMS.len() as u16 + 2).min(chunks[3].height),
        );
        frame.render_widget(menu, menu_area);

        // Help text
        let help = Paragraph::new("↑/k up • ↓/j down • enter select • q quit")
            .style(styles::muted())
            .alignment(Alignment::Center);
        frame.render_widget(help, chunks[4]);
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
        State::One(StateValue::Usize(self.cursor))
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Move(Direction::Up) => {
                self.cursor_up();
                CmdResult::Changed(self.state())
            }
            Cmd::Move(Direction::Down) => {
                self.cursor_down();
                CmdResult::Changed(self.state())
            }
            Cmd::Tick => {
                self.tick_typewriter();
                CmdResult::Changed(self.state())
            }
            _ => CmdResult::None,
        }
    }
}

/// Home Component - bridges MockComponent to application messages
pub struct Home {
    component: HomeMock,
}

impl Default for Home {
    fn default() -> Self {
        Self::new()
    }
}

impl Home {
    pub fn new() -> Self {
        Self {
            component: HomeMock::new(),
        }
    }
}

impl Component<Msg, NoUserEvent> for Home {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Tick => {
                self.component.perform(Cmd::Tick);
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Char('c'),
                modifiers,
            }) if modifiers.contains(KeyModifiers::CONTROL) => Some(Msg::Quit),
            Event::Keyboard(KeyEvent {
                code: Key::Char('q'),
                ..
            }) => Some(Msg::Quit),
            Event::Keyboard(KeyEvent {
                code: Key::Up, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('k'),
                ..
            }) => {
                self.component.perform(Cmd::Move(Direction::Up));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Down, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('j'),
                ..
            }) => {
                self.component.perform(Cmd::Move(Direction::Down));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Enter, ..
            }) => {
                let view = self.component.selected_view();
                Some(Msg::NavigateTo(view))
            }
            Event::Keyboard(KeyEvent {
                code: Key::Char(c),
                ..
            }) => {
                // Check for navigation shortcuts
                if let Some(view) = ViewId::from_shortcut(c) {
                    Some(Msg::NavigateTo(view))
                } else {
                    None
                }
            }
            _ => None,
        }
    }
}

impl MockComponent for Home {
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

//! Resume view component with markdown rendering and scrolling

use ratatui::layout::Rect;
use ratatui::widgets::Paragraph;
use tuirealm::command::{Cmd, CmdResult, Direction};
use tuirealm::event::{Key, KeyEvent, KeyModifiers};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::content::RESUME;
use crate::msg::{Msg, ViewId};
use crate::widgets::{Markdown, PageLayout};

/// Resume MockComponent - handles the visual representation
pub struct ResumeMock {
    props: Props,
    viewport: usize,
    max_scroll: usize,
    last_width: u16,
    markdown: Markdown,
}

impl Default for ResumeMock {
    fn default() -> Self {
        Self::new()
    }
}

impl ResumeMock {
    pub fn new() -> Self {
        Self {
            props: Props::default(),
            viewport: 0,
            max_scroll: 0,
            last_width: 0,
            markdown: Markdown::new(&RESUME),
        }
    }

    fn scroll_up(&mut self) {
        if self.viewport > 0 {
            self.viewport -= 1;
        }
    }

    fn scroll_down(&mut self) {
        if self.viewport < self.max_scroll {
            self.viewport += 1;
        }
    }

    fn page_up(&mut self) {
        self.viewport = self.viewport.saturating_sub(10);
    }

    fn page_down(&mut self) {
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
}

impl MockComponent for ResumeMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
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

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
        State::One(StateValue::Usize(self.viewport))
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Scroll(Direction::Up) => {
                self.scroll_up();
                CmdResult::Changed(self.state())
            }
            Cmd::Scroll(Direction::Down) => {
                self.scroll_down();
                CmdResult::Changed(self.state())
            }
            Cmd::GoTo(tuirealm::command::Position::Begin) => {
                self.page_up();
                CmdResult::Changed(self.state())
            }
            Cmd::GoTo(tuirealm::command::Position::End) => {
                self.page_down();
                CmdResult::Changed(self.state())
            }
            _ => CmdResult::None,
        }
    }
}

/// Resume Component - bridges MockComponent to application messages
pub struct Resume {
    component: ResumeMock,
}

impl Default for Resume {
    fn default() -> Self {
        Self::new()
    }
}

impl Resume {
    pub fn new() -> Self {
        Self {
            component: ResumeMock::new(),
        }
    }
}

impl Component<Msg, NoUserEvent> for Resume {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Keyboard(KeyEvent {
                code: Key::Char('c'),
                modifiers,
            }) if modifiers.contains(KeyModifiers::CONTROL) => Some(Msg::Quit),
            Event::Keyboard(KeyEvent { code: Key::Esc, .. })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('q'),
                ..
            }) => Some(Msg::GoBack),
            Event::Keyboard(KeyEvent {
                code: Key::Up, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('k'),
                ..
            }) => {
                self.component.perform(Cmd::Scroll(Direction::Up));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Down, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('j'),
                ..
            }) => {
                self.component.perform(Cmd::Scroll(Direction::Down));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::PageUp, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('u'),
                ..
            }) => {
                self.component
                    .perform(Cmd::GoTo(tuirealm::command::Position::Begin));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::PageDown,
                ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('d'),
                ..
            }) => {
                self.component
                    .perform(Cmd::GoTo(tuirealm::command::Position::End));
                Some(Msg::None)
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

impl MockComponent for Resume {
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

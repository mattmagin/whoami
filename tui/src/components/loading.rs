//! Loading screen component with bouncing animation

use std::time::{Duration, Instant};

use ratatui::layout::Rect;
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use tuirealm::command::{Cmd, CmdResult};
use tuirealm::event::{Key, KeyEvent};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::msg::Msg;
use crate::styles::{COLOR_PRIMARY, COLOR_SECONDARY};

/// Bouncy ball animation frames
const BOUNCY_FRAMES: &[&str] = &[
    "( ●    )",
    "(  ●   )",
    "(   ●  )",
    "(    ● )",
    "(     ●)",
    "(    ● )",
    "(   ●  )",
    "(  ●   )",
    "( ●    )",
    "(●     )",
];

/// Loading MockComponent - handles the visual representation
pub struct LoadingMock {
    props: Props,
    frame_idx: usize,
    last_tick: Instant,
    start_time: Instant,
    duration: Duration,
    tick_speed: Duration,
    message: String,
}

impl Default for LoadingMock {
    fn default() -> Self {
        Self::new("Loading", Duration::from_secs(3))
    }
}

impl LoadingMock {
    pub fn new(message: impl Into<String>, duration: Duration) -> Self {
        let now = Instant::now();
        Self {
            props: Props::default(),
            frame_idx: 0,
            last_tick: now,
            start_time: now,
            duration,
            tick_speed: Duration::from_millis(100),
            message: message.into(),
        }
    }

    /// Check if loading duration has elapsed
    pub fn is_complete(&self) -> bool {
        self.start_time.elapsed() >= self.duration
    }

    /// Advance animation frame
    fn tick(&mut self) {
        if self.last_tick.elapsed() >= self.tick_speed {
            self.frame_idx = (self.frame_idx + 1) % BOUNCY_FRAMES.len();
            self.last_tick = Instant::now();
        }
    }

    fn current_frame(&self) -> &'static str {
        BOUNCY_FRAMES[self.frame_idx % BOUNCY_FRAMES.len()]
    }
}

impl MockComponent for LoadingMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        let text_style = ratatui::style::Style::default()
            .fg(COLOR_PRIMARY)
            .add_modifier(ratatui::style::Modifier::BOLD);

        let animation_style = ratatui::style::Style::default()
            .fg(COLOR_SECONDARY)
            .add_modifier(ratatui::style::Modifier::BOLD);

        let anim_frame = self.current_frame();

        let line = Line::from(vec![
            Span::styled(self.message.clone(), text_style),
            Span::raw(" "),
            Span::styled(anim_frame, animation_style),
        ]);

        // Calculate vertical centering
        let y_offset = area.height.saturating_sub(1) / 2;
        let text_area = Rect::new(area.x, area.y + y_offset, area.width, 1);

        let paragraph = Paragraph::new(line).alignment(ratatui::layout::Alignment::Center);
        frame.render_widget(paragraph, text_area);
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
        // Return whether loading is complete
        State::One(StateValue::Bool(self.is_complete()))
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Tick => {
                self.tick();
                CmdResult::Changed(self.state())
            }
            _ => CmdResult::None,
        }
    }
}

/// Loading Component - bridges MockComponent to application messages
pub struct Loading {
    component: LoadingMock,
}

impl Default for Loading {
    fn default() -> Self {
        Self::new()
    }
}

impl Loading {
    pub fn new() -> Self {
        Self {
            component: LoadingMock::default(),
        }
    }

    pub fn with_message(message: impl Into<String>) -> Self {
        Self {
            component: LoadingMock::new(message, Duration::from_secs(3)),
        }
    }
}

impl Component<Msg, NoUserEvent> for Loading {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Tick => {
                self.component.perform(Cmd::Tick);
                if self.component.is_complete() {
                    // Loading complete, navigate to home
                    Some(Msg::NavigateTo(crate::msg::ViewId::Home))
                } else {
                    Some(Msg::Tick)
                }
            }
            Event::Keyboard(KeyEvent {
                code: Key::Char('c'),
                modifiers,
            }) if modifiers.contains(tuirealm::event::KeyModifiers::CONTROL) => Some(Msg::Quit),
            _ => None,
        }
    }
}

impl MockComponent for Loading {
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

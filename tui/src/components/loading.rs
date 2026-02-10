//! Loading screen component with staggered boot-sequence animation

use std::time::{Duration, Instant};

use ratatui::layout::{Alignment, Rect};
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use tuirealm::command::{Cmd, CmdResult};
use tuirealm::event::{Key, KeyEvent};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::msg::Msg;
use crate::styles::{COLOR_ACCENT, COLOR_MUTED, COLOR_PRIMARY, COLOR_SECONDARY};

/// Boot sequence messages — context-aware for the SSH TUI
const BOOT_MESSAGES: &[&str] = &[
    "Establishing SSH session...",
    "Loading content from API...",
    "Initializing terminal UI...",
    "Rendering viewport...",
    "All systems nominal.",
];

/// Bouncy ball animation frames (kept as a subtle running indicator)
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

/// How often to reveal a new boot line
const REVEAL_INTERVAL: Duration = Duration::from_millis(600);

/// Pause after all lines are shown before transitioning to Home
const POST_DELAY: Duration = Duration::from_secs(3);

/// Bouncy-ball animation tick speed
const ANIM_TICK: Duration = Duration::from_millis(100);

// ---------------------------------------------------------------------------
// MockComponent — visual representation
// ---------------------------------------------------------------------------

/// Boot-sequence loading screen with bouncing animation.
pub struct LoadingMock {
    props: Props,
    /// How many boot lines have been revealed so far
    visible_count: usize,
    /// When the most recent line was revealed
    last_reveal: Instant,
    /// Timestamp when *all* lines became visible (`None` while still revealing)
    all_shown_at: Option<Instant>,
    /// Current bouncy-ball animation frame
    anim_idx: usize,
    /// Last animation tick
    last_anim_tick: Instant,
}

impl Default for LoadingMock {
    fn default() -> Self {
        let now = Instant::now();
        Self {
            props: Props::default(),
            visible_count: 0,
            last_reveal: now,
            all_shown_at: None,
            anim_idx: 0,
            last_anim_tick: now,
        }
    }
}

impl LoadingMock {
    /// Returns `true` once the full boot sequence *and* the post-delay have
    /// elapsed, signalling that the app should transition to the Home view.
    pub fn is_complete(&self) -> bool {
        match self.all_shown_at {
            Some(t) => t.elapsed() >= POST_DELAY,
            None => false,
        }
    }

    /// Advance animation frames and reveal the next boot line when due.
    fn tick(&mut self) {
        // Advance bouncy animation
        if self.last_anim_tick.elapsed() >= ANIM_TICK {
            self.anim_idx = (self.anim_idx + 1) % BOUNCY_FRAMES.len();
            self.last_anim_tick = Instant::now();
        }

        // Reveal next boot line on schedule
        if self.visible_count < BOOT_MESSAGES.len() && self.last_reveal.elapsed() >= REVEAL_INTERVAL
        {
            self.visible_count += 1;
            self.last_reveal = Instant::now();

            if self.visible_count == BOOT_MESSAGES.len() {
                self.all_shown_at = Some(Instant::now());
            }
        }
    }
}

impl MockComponent for LoadingMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        let ok_style = Style::default()
            .fg(COLOR_ACCENT)
            .add_modifier(Modifier::BOLD);
        let bracket_style = Style::default().fg(COLOR_MUTED);
        let msg_style = Style::default().fg(COLOR_PRIMARY);
        let anim_style = Style::default()
            .fg(COLOR_SECONDARY)
            .add_modifier(Modifier::BOLD);

        // Build the block of lines: boot messages + blank + bouncy animation
        let total_lines = BOOT_MESSAGES.len() as u16 + 2;
        let y_start = area.y + area.height.saturating_sub(total_lines) / 2;

        let mut lines: Vec<Line> = Vec::with_capacity((total_lines) as usize);

        for (i, &message) in BOOT_MESSAGES.iter().enumerate() {
            if i < self.visible_count {
                lines.push(Line::from(vec![
                    Span::styled("[ ", bracket_style),
                    Span::styled("OK", ok_style),
                    Span::styled(" ] ", bracket_style),
                    Span::styled(message, msg_style),
                ]));
            } else {
                // Keep empty placeholder so the block height stays constant
                lines.push(Line::from(""));
            }
        }

        // Blank separator
        lines.push(Line::from(""));

        // Bouncy animation below the boot lines
        lines.push(Line::from(Span::styled(
            BOUNCY_FRAMES[self.anim_idx],
            anim_style,
        )));

        let block_area = Rect::new(area.x, y_start, area.width, total_lines);
        let paragraph = Paragraph::new(lines).alignment(Alignment::Center);
        frame.render_widget(paragraph, block_area);
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
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

// ---------------------------------------------------------------------------
// Component wrapper — bridges MockComponent to application messages
// ---------------------------------------------------------------------------

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
}

impl Component<Msg, NoUserEvent> for Loading {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Tick => {
                self.component.perform(Cmd::Tick);
                if self.component.is_complete() {
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

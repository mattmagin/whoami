//! Loading animation widget with bouncing dots

use std::time::{Duration, Instant};

use ratatui::{
    buffer::Buffer,
    layout::{Alignment, Rect},
    style::{Modifier, Style},
    text::{Line, Span},
    widgets::{Paragraph, StatefulWidget, Widget},
};

use crate::styles::{COLOR_PRIMARY, COLOR_SECONDARY};

/// Bouncing dot animation frames
const BOUNCE_FRAMES: &[&str] = &[
    "●    ",
    " ●   ",
    "  ●  ",
    "   ● ",
    "    ●",
    "   ● ",
    "  ●  ",
    " ●   ",
];

/// Multi-dot bounce frames (dots bouncing at different heights)
const MULTI_BOUNCE: &[&str] = &[
    "●   ○   ○",
    "○   ●   ○",
    "○   ○   ●",
    "○   ●   ○",
];

/// Wave dots frames
const WAVE_FRAMES: &[&str] = &[
    "⠁ ⠂ ⠄",
    "⠂ ⠄ ⠂",
    "⠄ ⠂ ⠁",
    "⠂ ⠁ ⠂",
];

/// Spinner frames using braille
const SPINNER_FRAMES: &[&str] = &["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

/// Bouncy ball frames
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

/// Loading animation style
#[derive(Clone, Copy, Default)]
#[allow(dead_code)]
pub enum LoadingStyle {
    #[default]
    Bounce,
    MultiBounce,
    Wave,
    Spinner,
    Bouncy,
}

impl LoadingStyle {
    fn frames(&self) -> &'static [&'static str] {
        match self {
            LoadingStyle::Bounce => BOUNCE_FRAMES,
            LoadingStyle::MultiBounce => MULTI_BOUNCE,
            LoadingStyle::Wave => WAVE_FRAMES,
            LoadingStyle::Spinner => SPINNER_FRAMES,
            LoadingStyle::Bouncy => BOUNCY_FRAMES,
        }
    }
}

/// Loading animation state
pub struct LoadingState {
    frame_idx: usize,
    last_tick: Instant,
    start_time: Instant,
    duration: Option<Duration>,
    tick_speed: Duration,
    style: LoadingStyle,
}

impl LoadingState {
    /// Create a new loading state with the given duration
    pub fn new(duration: Duration) -> Self {
        let now = Instant::now();
        Self {
            frame_idx: 0,
            last_tick: now,
            start_time: now,
            duration: Some(duration),
            tick_speed: Duration::from_millis(100),
            style: LoadingStyle::Bouncy,
        }
    }

    /// Create an indefinite loading state (no timeout)
    #[allow(dead_code)]
    pub fn indefinite() -> Self {
        let now = Instant::now();
        Self {
            frame_idx: 0,
            last_tick: now,
            start_time: now,
            duration: None,
            tick_speed: Duration::from_millis(100),
            style: LoadingStyle::Bouncy,
        }
    }

    /// Set animation style
    #[allow(dead_code)]
    pub fn style(mut self, style: LoadingStyle) -> Self {
        self.style = style;
        self
    }

    /// Set custom tick speed
    #[allow(dead_code)]
    pub fn with_tick_speed(mut self, speed: Duration) -> Self {
        self.tick_speed = speed;
        self
    }

    /// Check if loading is complete (always false for indefinite)
    pub fn is_complete(&self) -> bool {
        match self.duration {
            Some(d) => self.start_time.elapsed() >= d,
            None => false,
        }
    }

    /// Mark loading as complete
    #[allow(dead_code)]
    pub fn complete(&mut self) {
        self.duration = Some(Duration::ZERO);
    }

    /// Advance the animation
    pub fn tick(&mut self) {
        if self.last_tick.elapsed() >= self.tick_speed {
            let frames = self.style.frames();
            self.frame_idx = (self.frame_idx + 1) % frames.len();
            self.last_tick = Instant::now();
        }
    }

    /// Get current frame
    fn current_frame(&self) -> &'static str {
        let frames = self.style.frames();
        frames[self.frame_idx % frames.len()]
    }
}

/// Loading widget - displays animated loading text with bouncing dots
///
/// # Example
/// ```
/// // Create indefinite loading (for API calls)
/// loading: LoadingState::indefinite(),
///
/// // Or with timeout
/// loading: LoadingState::new(Duration::from_secs(5)),
///
/// // In tick():
/// loading.tick();
///
/// // When API completes:
/// loading.complete();
///
/// // In render():
/// frame.render_stateful_widget(LoadingWidget::new("Loading"), area, &mut loading);
/// ```
pub struct LoadingWidget {
    message: String,
    alignment: Alignment,
    text_style: Option<Style>,
    animation_style: Option<Style>,
}

impl LoadingWidget {
    /// Create a new loading widget with the given message
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            alignment: Alignment::Center,
            text_style: None,
            animation_style: None,
        }
    }

    /// Set text alignment
    #[allow(dead_code)]
    pub fn alignment(mut self, alignment: Alignment) -> Self {
        self.alignment = alignment;
        self
    }

    /// Set custom text style
    #[allow(dead_code)]
    pub fn text_style(mut self, style: Style) -> Self {
        self.text_style = Some(style);
        self
    }

    /// Set custom animation style
    #[allow(dead_code)]
    pub fn animation_style(mut self, style: Style) -> Self {
        self.animation_style = Some(style);
        self
    }
}

impl StatefulWidget for LoadingWidget {
    type State = LoadingState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        let text_style = self.text_style.unwrap_or_else(|| {
            Style::default()
                .fg(COLOR_PRIMARY)
                .add_modifier(Modifier::BOLD)
        });

        let animation_style = self.animation_style.unwrap_or_else(|| {
            Style::default()
                .fg(COLOR_SECONDARY)
                .add_modifier(Modifier::BOLD)
        });

        // Get current animation frame
        let frame = state.current_frame();

        let line = Line::from(vec![
            Span::styled(self.message.clone(), text_style),
            Span::raw(" "),
            Span::styled(frame, animation_style),
        ]);

        // Calculate vertical centering
        let y_offset = area.height.saturating_sub(1) / 2;
        let text_area = Rect::new(area.x, area.y + y_offset, area.width, 1);

        let paragraph = Paragraph::new(line).alignment(self.alignment);
        paragraph.render(text_area, buf);
    }
}

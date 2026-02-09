//! Typewriter animation widget
//! Types out phrases character by character, pauses, then deletes them.

use std::time::{Duration, Instant};

use ratatui::{
    buffer::Buffer,
    layout::{Alignment, Rect},
    style::{Modifier, Style},
    text::{Line, Span},
    widgets::{Paragraph, StatefulWidget, Widget},
};

use crate::styles::{COLOR_PRIMARY, COLOR_SECONDARY};

/// Animation state
#[derive(Clone, Copy, PartialEq)]
pub enum AnimationState {
    Typing,
    PausedAfterType,
    Deleting,
    PausedAfterDelete,
}

/// Timing configuration
pub struct Config {
    pub type_speed: Duration,
    pub delete_speed: Duration,
    pub pause_after_type: Duration,
    pub pause_after_delete: Duration,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            type_speed: Duration::from_millis(50),
            delete_speed: Duration::from_millis(30),
            pause_after_type: Duration::from_secs(2),
            pause_after_delete: Duration::from_millis(300),
        }
    }
}

/// Typewriter animation state (used with TypewriterWidget)
pub struct TypewriterState {
    phrases: Vec<String>,
    config: Config,
    animation_state: AnimationState,
    phrase_idx: usize,
    char_idx: usize,
    display_text: String,
    last_tick: Instant,
}

impl TypewriterState {
    /// Create a new typewriter state with the given phrases
    pub fn new(phrases: &[&str]) -> Self {
        Self {
            phrases: phrases.iter().map(|s| s.to_string()).collect(),
            config: Config::default(),
            animation_state: AnimationState::Typing,
            phrase_idx: 0,
            char_idx: 0,
            display_text: String::new(),
            last_tick: Instant::now(),
        }
    }

    /// Get the current display text
    #[allow(dead_code)]
    pub fn display_text(&self) -> &str {
        &self.display_text
    }

    /// Advance the animation based on elapsed time
    pub fn tick(&mut self) {
        if self.phrases.is_empty() {
            return;
        }

        let delay = match self.animation_state {
            AnimationState::Typing => self.config.type_speed,
            AnimationState::Deleting => self.config.delete_speed,
            AnimationState::PausedAfterType => self.config.pause_after_type,
            AnimationState::PausedAfterDelete => self.config.pause_after_delete,
        };

        if self.last_tick.elapsed() < delay {
            return;
        }

        self.last_tick = Instant::now();
        self.advance();
    }

    fn advance(&mut self) {
        let current_phrase = &self.phrases[self.phrase_idx];

        match self.animation_state {
            AnimationState::Typing => {
                if self.char_idx < current_phrase.chars().count() {
                    self.char_idx += 1;
                    self.display_text = current_phrase.chars().take(self.char_idx).collect();
                } else {
                    self.animation_state = AnimationState::PausedAfterType;
                }
            }
            AnimationState::PausedAfterType => {
                self.animation_state = AnimationState::Deleting;
            }
            AnimationState::Deleting => {
                if self.char_idx > 0 {
                    self.char_idx -= 1;
                    self.display_text = current_phrase.chars().take(self.char_idx).collect();
                } else {
                    self.animation_state = AnimationState::PausedAfterDelete;
                }
            }
            AnimationState::PausedAfterDelete => {
                self.phrase_idx = (self.phrase_idx + 1) % self.phrases.len();
                self.animation_state = AnimationState::Typing;
            }
        }
    }
}

/// Typewriter widget - renders animated text with a blinking cursor
///
/// # Example
/// ```
/// // In your view struct:
/// typewriter_state: TypewriterState,
///
/// // In tick():
/// self.typewriter_state.tick();
///
/// // In render():
/// frame.render_stateful_widget(
///     TypewriterWidget::default(),
///     area,
///     &mut self.typewriter_state,
/// );
/// ```
pub struct TypewriterWidget {
    alignment: Alignment,
    text_style: Option<Style>,
    cursor_style: Option<Style>,
    cursor_char: char,
}

impl TypewriterWidget {
    /// Create a new typewriter widget with default styling
    pub fn new() -> Self {
        Self::default()
    }

    /// Set text alignment
    pub fn alignment(mut self, alignment: Alignment) -> Self {
        self.alignment = alignment;
        self
    }

    /// Set custom text style (default: secondary color, bold)
    #[allow(dead_code)]
    pub fn text_style(mut self, style: Style) -> Self {
        self.text_style = Some(style);
        self
    }

    /// Set custom cursor style (default: primary color)
    #[allow(dead_code)]
    pub fn cursor_style(mut self, style: Style) -> Self {
        self.cursor_style = Some(style);
        self
    }

    /// Set cursor character (default: █)
    #[allow(dead_code)]
    pub fn cursor(mut self, c: char) -> Self {
        self.cursor_char = c;
        self
    }
}

impl Default for TypewriterWidget {
    fn default() -> Self {
        Self {
            alignment: Alignment::Center,
            text_style: None,
            cursor_style: None,
            cursor_char: '█',
        }
    }
}

impl StatefulWidget for TypewriterWidget {
    type State = TypewriterState;

    fn render(self, area: Rect, buf: &mut Buffer, state: &mut Self::State) {
        let text_style = self.text_style.unwrap_or_else(|| {
            Style::default()
                .fg(COLOR_SECONDARY)
                .add_modifier(Modifier::BOLD)
        });

        let cursor_style = self
            .cursor_style
            .unwrap_or_else(|| Style::default().fg(COLOR_PRIMARY));

        let line = Line::from(vec![
            Span::styled(state.display_text.clone(), text_style),
            Span::styled(self.cursor_char.to_string(), cursor_style),
        ]);

        let paragraph = Paragraph::new(line).alignment(self.alignment);
        paragraph.render(area, buf);
    }
}

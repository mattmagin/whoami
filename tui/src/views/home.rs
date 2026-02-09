//! Home view with ASCII logo, typewriter animation, and navigation menu

use crossterm::event::{KeyCode, KeyEvent};
use ratatui::{
    layout::{Alignment, Constraint, Layout, Rect},
    style::{Modifier, Style},
    text::Line,
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::keymap::{self, Action};
use crate::view::{View, ViewResult, VIEWS};
use crate::content::{BIO, LOGO, TYPEWRITER_PHRASES};
use crate::styles;
use crate::widgets::{MenuItem, TypewriterState, TypewriterWidget};

/// Home view model
pub struct HomeView {
    cursor: usize,
    typewriter: TypewriterState,
}

impl HomeView {
    pub fn new() -> Self {
        Self {
            cursor: 0,
            typewriter: TypewriterState::new(&TYPEWRITER_PHRASES),
        }
    }

    pub fn cursor_up(&mut self) {
        if self.cursor > 0 {
            self.cursor -= 1;
        }
    }

    pub fn cursor_down(&mut self) {
        if self.cursor < VIEWS.len() - 1 {
            self.cursor += 1;
        }
    }

    pub fn selected_view(&self) -> Option<View> {
        VIEWS.get(self.cursor).map(|config| config.view)
    }

    /// Handle key input for the home view
    pub fn handle_key(&mut self, key: KeyEvent) -> ViewResult {
        // Check for navigation shortcuts first
        if let KeyCode::Char(c) = key.code {
            if let Some(view) = View::from_shortcut(c) {
                return ViewResult::NavigateTo(view);
            }
        }

        // Check home-specific keys
        if let Some(action) = keymap::match_key(key, keymap::HOME_KEYS) {
            return match action {
                Action::Quit => ViewResult::Quit,
                Action::CursorUp => {
                    self.cursor_up();
                    ViewResult::Handled
                }
                Action::CursorDown => {
                    self.cursor_down();
                    ViewResult::Handled
                }
                Action::Select => {
                    if let Some(view) = self.selected_view() {
                        ViewResult::NavigateTo(view)
                    } else {
                        ViewResult::Handled
                    }
                }
                _ => ViewResult::Ignored,
            };
        }

        ViewResult::Ignored
    }

    pub fn tick(&mut self) {
        self.typewriter.tick();
    }

    pub fn render(&mut self, frame: &mut Frame, area: Rect) {
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

        // Typewriter tagline (using the widget)
        frame.render_stateful_widget(
            TypewriterWidget::new().alignment(Alignment::Center),
            chunks[1],
            &mut self.typewriter,
        );

        // Bio
        let bio = Paragraph::new(*BIO)
            .style(styles::text())
            .alignment(Alignment::Center);
        frame.render_widget(bio, chunks[2]);

        // Menu using MenuItem widget - driven by VIEWS config
        let menu_block = Block::default()
            .borders(Borders::ALL)
            .border_type(ratatui::widgets::BorderType::Rounded)
            .border_style(styles::border());

        let menu_lines: Vec<Line> = VIEWS
            .iter()
            .enumerate()
            .map(|(i, config)| {
                MenuItem::new(config.shortcut, config.label, config.description)
                    .selected(i == self.cursor)
                    .to_line()
            })
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
            (VIEWS.len() as u16 + 2).min(chunks[3].height),
        );
        frame.render_widget(menu, menu_area);

        // Help text
        let help = Paragraph::new("↑/k up • ↓/j down • enter select • q quit")
            .style(styles::muted())
            .alignment(Alignment::Center);
        frame.render_widget(help, chunks[4]);
    }
}

//! Home view with ASCII logo, typewriter animation, and navigation menu

use ratatui::{
    layout::{Alignment, Constraint, Layout, Rect},
    style::{Modifier, Style},
    text::Line,
    widgets::{Block, Borders, Paragraph},
    Frame,
};

use crate::app::View;
use crate::content::{BIO, LOGO, MENU_ITEMS, TYPEWRITER_PHRASES};
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
        if self.cursor < MENU_ITEMS.len() - 1 {
            self.cursor += 1;
        }
    }

    pub fn selected_view(&self) -> Option<View> {
        match MENU_ITEMS[self.cursor].key {
            'r' => Some(View::Resume),
            'b' => Some(View::Blog),
            'p' => Some(View::Projects),
            'c' => Some(View::Contact),
            _ => None,
        }
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

        // Menu using MenuItem widget
        let menu_block = Block::default()
            .borders(Borders::ALL)
            .border_type(ratatui::widgets::BorderType::Rounded)
            .border_style(styles::border());

        let menu_lines: Vec<Line> = MENU_ITEMS
            .iter()
            .enumerate()
            .map(|(i, item)| {
                MenuItem::new(item.key, item.label, item.desc)
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
            (MENU_ITEMS.len() as u16 + 2).min(chunks[3].height),
        );
        frame.render_widget(menu, menu_area);

        // Help text
        let help = Paragraph::new("↑/k up • ↓/j down • enter select • q quit")
            .style(styles::muted())
            .alignment(Alignment::Center);
        frame.render_widget(help, chunks[4]);
    }
}

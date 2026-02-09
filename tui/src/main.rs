//! TUI Portfolio Application
//!
//! A terminal-based portfolio viewer built with tui-realm for
//! event-driven, component-based architecture.

mod components;
mod content;
mod model;
mod msg;
mod styles;
mod ui;
mod widgets;

use std::io;
use std::time::Duration;

use ratatui::backend::CrosstermBackend;
use ratatui::Terminal;
use tuirealm::application::PollStrategy;
use tuirealm::{Application, EventListenerCfg, Update};

use model::Model;
use msg::{Msg, ViewId};
use ui::{mount_view, App};

fn main() -> io::Result<()> {
    // Setup terminal
    crossterm::terminal::enable_raw_mode()?;
    let mut stdout = io::stdout();
    crossterm::execute!(
        stdout,
        crossterm::terminal::EnterAlternateScreen,
        crossterm::event::EnableMouseCapture
    )?;
    let backend = CrosstermBackend::new(stdout);
    let mut terminal = Terminal::new(backend)?;

    // Run the application
    let result = run_app(&mut terminal);

    // Restore terminal
    crossterm::terminal::disable_raw_mode()?;
    crossterm::execute!(
        terminal.backend_mut(),
        crossterm::terminal::LeaveAlternateScreen,
        crossterm::event::DisableMouseCapture
    )?;
    terminal.show_cursor()?;

    if let Err(err) = result {
        eprintln!("Error: {err:?}");
    }

    Ok(())
}

fn run_app<B: ratatui::backend::Backend>(
    terminal: &mut Terminal<B>,
) -> Result<(), Box<dyn std::error::Error>> {
    // Create the application model
    let mut model = Model::new();

    // Create the tui-realm Application with event configuration
    let mut app: App = Application::init(
        EventListenerCfg::default()
            .crossterm_input_listener(Duration::from_millis(50), 3)
            .poll_timeout(Duration::from_millis(50))
            .tick_interval(Duration::from_millis(50)),
    );

    // Mount initial loading view
    mount_view(&mut app, ViewId::Loading)?;
    let mut current_view = ViewId::Loading;

    // Main event loop
    while !model.quit {
        // Render current view
        terminal.draw(|frame| {
            let area = frame.area();
            // Render the active component
            app.view(&current_view, frame, area);
        })?;

        // Poll for events and get messages
        let messages = match app.tick(PollStrategy::UpTo(3)) {
            Ok(msgs) => msgs,
            Err(_) => vec![],
        };

        // Process messages through the model
        for msg in messages {
            // Check for navigation before updating model
            let new_view = match &msg {
                Msg::NavigateTo(view_id) => Some(*view_id),
                Msg::GoBack => Some(ViewId::Home),
                _ => None,
            };

            // Update model state
            model.update(Some(msg));

            // Handle view transitions
            if let Some(view_id) = new_view {
                if view_id != current_view {
                    mount_view(&mut app, view_id)?;
                    current_view = view_id;
                }
            }
        }
    }

    Ok(())
}

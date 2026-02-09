//! Main application state and view routing

use std::time::Duration;

use crossterm::event::KeyEvent;
use ratatui::Frame;

use crate::keymap::{self, Action};
use crate::view::{View, ViewResult};
use crate::views::{BlogView, ContactView, HomeView, ProjectsView, ResumeView};
use crate::widgets::{LoadingState, LoadingWidget};

/// Main application model
pub struct App {
    pub current_view: View,
    pub width: u16,
    pub height: u16,

    // Loading state
    pub loading: LoadingState,

    // Sub-views
    pub home: HomeView,
    pub resume: ResumeView,
    pub blog: BlogView,
    pub projects: ProjectsView,
    pub contact: ContactView,
}

impl App {
    /// Create a new application
    pub fn new() -> Self {
        Self {
            current_view: View::Loading,
            width: 80,
            height: 24,
            loading: LoadingState::new(Duration::from_secs(5)),
            home: HomeView::new(),
            resume: ResumeView::new(),
            blog: BlogView::new(),
            projects: ProjectsView::new(),
            contact: ContactView::new(),
        }
    }

    /// Update terminal dimensions
    pub fn set_size(&mut self, width: u16, height: u16) {
        self.width = width;
        self.height = height;
    }

    /// Update animations (typewriter, loading, etc.)
    pub fn tick(&mut self) {
        // Update loading animation
        if self.current_view == View::Loading {
            self.loading.tick();
            if self.loading.is_complete() {
                self.current_view = View::Home;
            }
        }

        // Update home animations
        self.home.tick();
    }

    /// Handle key input, returns true if app should quit
    pub fn handle_key(&mut self, key: KeyEvent) -> bool {
        // No input during loading
        if self.current_view == View::Loading {
            return false;
        }

        // Check global keys first (Ctrl+C)
        if let Some(Action::Quit) = keymap::match_key(key, keymap::GLOBAL_KEYS) {
            return true;
        }

        // Dispatch to current view's key handler
        let result = match self.current_view {
            View::Loading => ViewResult::Ignored,
            View::Home => self.home.handle_key(key),
            View::Resume => self.resume.handle_key(key),
            View::Blog => self.blog.handle_key(key),
            View::Projects => self.projects.handle_key(key),
            View::Contact => self.contact.handle_key(key),
        };

        // Handle the result
        match result {
            ViewResult::Quit => true,
            ViewResult::Back => {
                self.current_view = View::Home;
                false
            }
            ViewResult::NavigateTo(view) => {
                self.current_view = view;
                false
            }
            ViewResult::Handled | ViewResult::Ignored => false,
        }
    }

    /// Render the current view
    pub fn render(&mut self, frame: &mut Frame) {
        let area = frame.area();

        match self.current_view {
            View::Loading => {
                frame.render_stateful_widget(
                    LoadingWidget::new("Loading"),
                    area,
                    &mut self.loading,
                );
            }
            View::Home => self.home.render(frame, area),
            View::Resume => self.resume.render(frame, area),
            View::Blog => self.blog.render(frame, area),
            View::Projects => self.projects.render(frame, area),
            View::Contact => self.contact.render(frame, area),
        }
    }
}

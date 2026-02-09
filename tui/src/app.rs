//! Main application state and view routing

use std::time::Duration;

use crossterm::event::{KeyCode, KeyEvent, KeyModifiers};
use ratatui::Frame;

use crate::views::{BlogView, ContactView, HomeView, ProjectsView, ResumeView};
use crate::widgets::{LoadingState, LoadingWidget};

/// Which view is currently active
#[derive(Clone, Copy, PartialEq)]
pub enum View {
    Loading,
    Home,
    Resume,
    Blog,
    Projects,
    Contact,
}

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
        match self.current_view {
            View::Loading => false, // No input during loading
            View::Home => self.handle_home_keys(key),
            View::Resume => self.handle_resume_keys(key),
            View::Blog => self.handle_blog_keys(key),
            View::Projects => self.handle_projects_keys(key),
            View::Contact => self.handle_contact_keys(key),
        }
    }

    fn handle_home_keys(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Char('q') => return true,
            KeyCode::Up | KeyCode::Char('k') => self.home.cursor_up(),
            KeyCode::Down | KeyCode::Char('j') => self.home.cursor_down(),
            KeyCode::Enter => {
                if let Some(view) = self.home.selected_view() {
                    self.current_view = view;
                }
            }
            // Direct navigation hotkeys
            KeyCode::Char('r') => self.current_view = View::Resume,
            KeyCode::Char('b') => self.current_view = View::Blog,
            KeyCode::Char('p') => self.current_view = View::Projects,
            KeyCode::Char('c') => self.current_view = View::Contact,
            _ => {}
        }
        false
    }

    fn handle_resume_keys(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Esc | KeyCode::Char('q') => self.current_view = View::Home,
            KeyCode::Up | KeyCode::Char('k') => self.resume.scroll_up(),
            KeyCode::Down | KeyCode::Char('j') => self.resume.scroll_down(),
            KeyCode::Char('u') | KeyCode::PageUp => self.resume.page_up(),
            KeyCode::Char('d') | KeyCode::PageDown => self.resume.page_down(),
            _ => {}
        }
        false
    }

    fn handle_blog_keys(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Up | KeyCode::Char('k') => self.blog.cursor_up(),
            KeyCode::Down | KeyCode::Char('j') => self.blog.cursor_down(),
            KeyCode::Enter => self.blog.select(),
            KeyCode::Esc | KeyCode::Char('q') => {
                if !self.blog.back() {
                    self.current_view = View::Home;
                }
            }
            _ => {}
        }
        false
    }

    fn handle_projects_keys(&mut self, key: KeyEvent) -> bool {
        match key.code {
            KeyCode::Esc | KeyCode::Char('q') => self.current_view = View::Home,
            KeyCode::Up | KeyCode::Char('k') => self.projects.cursor_up(),
            KeyCode::Down | KeyCode::Char('j') => self.projects.cursor_down(),
            _ => {}
        }
        false
    }

    fn handle_contact_keys(&mut self, key: KeyEvent) -> bool {
        // If submitted, only allow going back
        if self.contact.is_submitted() {
            match key.code {
                KeyCode::Esc | KeyCode::Char('q') => {
                    self.contact.reset();
                    self.current_view = View::Home;
                }
                _ => {}
            }
            return false;
        }

        match key.code {
            KeyCode::Tab => {
                if key.modifiers.contains(KeyModifiers::SHIFT) {
                    self.contact.focus_prev();
                } else {
                    self.contact.focus_next();
                }
            }
            KeyCode::BackTab => self.contact.focus_prev(),
            KeyCode::Enter => {
                self.contact.submit();
            }
            KeyCode::Esc => self.current_view = View::Home,
            KeyCode::Backspace => self.contact.backspace(),
            KeyCode::Char(c) => self.contact.type_char(c),
            _ => {}
        }
        false
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

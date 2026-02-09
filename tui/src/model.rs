//! Application model with state management via Update trait

use std::time::Duration;

use tuirealm::Update;

use crate::msg::{Msg, ViewId};
use crate::widgets::LoadingState;

/// Main application state model
pub struct Model {
    /// Whether the application should quit
    pub quit: bool,
    /// Currently active view
    pub current_view: ViewId,
    /// Whether a redraw is needed
    pub redraw: bool,
    /// Loading animation state
    pub loading: LoadingState,
    /// Terminal dimensions
    pub width: u16,
    pub height: u16,
}

impl Model {
    /// Create a new model with default state
    pub fn new() -> Self {
        Self {
            quit: false,
            current_view: ViewId::Loading,
            redraw: true,
            loading: LoadingState::new(Duration::from_secs(3)),
            width: 80,
            height: 24,
        }
    }

    /// Update terminal dimensions
    pub fn set_size(&mut self, width: u16, height: u16) {
        self.width = width;
        self.height = height;
        self.redraw = true;
    }

    /// Check if loading is complete and transition to Home
    pub fn check_loading_complete(&mut self) {
        if self.current_view == ViewId::Loading && self.loading.is_complete() {
            self.current_view = ViewId::Home;
            self.redraw = true;
        }
    }
}

impl Default for Model {
    fn default() -> Self {
        Self::new()
    }
}

impl Update<Msg> for Model {
    fn update(&mut self, msg: Option<Msg>) -> Option<Msg> {
        self.redraw = true;

        match msg {
            Some(Msg::Quit) => {
                self.quit = true;
                None
            }
            Some(Msg::NavigateTo(view_id)) => {
                self.current_view = view_id;
                None
            }
            Some(Msg::GoBack) => {
                self.current_view = ViewId::Home;
                None
            }
            Some(Msg::Tick) => {
                // Update loading animation
                if self.current_view == ViewId::Loading {
                    self.loading.tick();
                    self.check_loading_complete();
                }
                None
            }
            Some(Msg::None) => {
                // No-op, but still trigger redraw
                None
            }
            _ => None,
        }
    }
}

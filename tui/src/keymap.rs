//! Declarative keymap configuration
//!
//! All keyboard shortcuts are defined here as data structures.

use crossterm::event::{KeyCode, KeyEvent, KeyModifiers};

use crate::view::View;

/// All possible actions triggered by key presses
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Action {
    Quit,
    Back,
    #[allow(dead_code)]
    NavigateTo(View),
    CursorUp,
    CursorDown,
    ScrollUp,
    ScrollDown,
    PageUp,
    PageDown,
    Select,
    Submit,
    FocusNext,
    FocusPrev,
    Backspace,
    #[allow(dead_code)]
    TypeChar(char),
}

/// A key binding maps a key (with optional modifiers) to an action
#[derive(Clone, Copy)]
pub struct KeyBinding {
    pub code: KeyCode,
    pub modifiers: KeyModifiers,
    pub action: Action,
}

impl KeyBinding {
    /// Create a binding with no modifiers
    pub const fn new(code: KeyCode, action: Action) -> Self {
        Self {
            code,
            modifiers: KeyModifiers::NONE,
            action,
        }
    }

    /// Create a binding with Ctrl modifier
    pub const fn ctrl(code: KeyCode, action: Action) -> Self {
        Self {
            code,
            modifiers: KeyModifiers::CONTROL,
            action,
        }
    }

    /// Create a binding with Shift modifier
    pub const fn shift(code: KeyCode, action: Action) -> Self {
        Self {
            code,
            modifiers: KeyModifiers::SHIFT,
            action,
        }
    }
}

/// Match a key event against a keymap, returning the first matching action
pub fn match_key(key: KeyEvent, keymap: &[KeyBinding]) -> Option<Action> {
    keymap.iter().find_map(|binding| {
        if binding.code == key.code && key.modifiers.contains(binding.modifiers) {
            Some(binding.action)
        } else {
            None
        }
    })
}

// =============================================================================
// Keymap Definitions
// =============================================================================

/// Global keys that work everywhere (highest priority)
pub const GLOBAL_KEYS: &[KeyBinding] = &[
    KeyBinding::ctrl(KeyCode::Char('c'), Action::Quit),
];

/// Keys for the home view (quit works differently here)
pub const HOME_KEYS: &[KeyBinding] = &[
    KeyBinding::new(KeyCode::Up, Action::CursorUp),
    KeyBinding::new(KeyCode::Char('k'), Action::CursorUp),
    KeyBinding::new(KeyCode::Down, Action::CursorDown),
    KeyBinding::new(KeyCode::Char('j'), Action::CursorDown),
    KeyBinding::new(KeyCode::Enter, Action::Select),
    KeyBinding::new(KeyCode::Char('q'), Action::Quit),
];

/// Keys for list-style views (cursor navigation + back)
pub const LIST_KEYS: &[KeyBinding] = &[
    KeyBinding::new(KeyCode::Up, Action::CursorUp),
    KeyBinding::new(KeyCode::Char('k'), Action::CursorUp),
    KeyBinding::new(KeyCode::Down, Action::CursorDown),
    KeyBinding::new(KeyCode::Char('j'), Action::CursorDown),
    KeyBinding::new(KeyCode::Enter, Action::Select),
    KeyBinding::new(KeyCode::Esc, Action::Back),
    KeyBinding::new(KeyCode::Char('q'), Action::Back),
];

/// Keys for scrollable views (scroll navigation + back)
pub const SCROLL_KEYS: &[KeyBinding] = &[
    KeyBinding::new(KeyCode::Up, Action::ScrollUp),
    KeyBinding::new(KeyCode::Char('k'), Action::ScrollUp),
    KeyBinding::new(KeyCode::Down, Action::ScrollDown),
    KeyBinding::new(KeyCode::Char('j'), Action::ScrollDown),
    KeyBinding::new(KeyCode::PageUp, Action::PageUp),
    KeyBinding::new(KeyCode::Char('u'), Action::PageUp),
    KeyBinding::new(KeyCode::PageDown, Action::PageDown),
    KeyBinding::new(KeyCode::Char('d'), Action::PageDown),
    KeyBinding::new(KeyCode::Esc, Action::Back),
    KeyBinding::new(KeyCode::Char('q'), Action::Back),
];

/// Keys for form views (field navigation)
pub const FORM_KEYS: &[KeyBinding] = &[
    KeyBinding::new(KeyCode::Tab, Action::FocusNext),
    KeyBinding::new(KeyCode::BackTab, Action::FocusPrev),
    KeyBinding::shift(KeyCode::Tab, Action::FocusPrev),
    KeyBinding::new(KeyCode::Enter, Action::Submit),
    KeyBinding::new(KeyCode::Esc, Action::Back),
    KeyBinding::new(KeyCode::Backspace, Action::Backspace),
];

/// Keys for submitted form state (only back allowed)
pub const SUBMITTED_KEYS: &[KeyBinding] = &[
    KeyBinding::new(KeyCode::Esc, Action::Back),
    KeyBinding::new(KeyCode::Char('q'), Action::Back),
];

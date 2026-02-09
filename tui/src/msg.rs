//! Message protocol for inter-component communication

/// Application messages for component communication
#[derive(Debug, PartialEq, Clone)]
pub enum Msg {
    // Navigation
    NavigateTo(ViewId),
    GoBack,

    // Application lifecycle
    Quit,
    Tick,

    // Scroll/selection
    ScrollUp,
    ScrollDown,
    PageUp,
    PageDown,
    CursorUp,
    CursorDown,
    Select,

    // Form-specific
    FocusNext,
    FocusPrev,
    TypeChar(char),
    Backspace,
    Submit,

    // Status
    UpdateStatus(String),
    ShowError(String),

    // No-op (event handled internally)
    None,
}

/// Identifiers for each view/component in the application
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ViewId {
    Loading,
    Home,
    Resume,
    Blog,
    Projects,
    Contact,
}

impl ViewId {
    /// Get the shortcut key for this view
    pub fn shortcut(&self) -> Option<char> {
        match self {
            ViewId::Home => Some('h'),
            ViewId::Resume => Some('r'),
            ViewId::Blog => Some('b'),
            ViewId::Projects => Some('p'),
            ViewId::Contact => Some('c'),
            ViewId::Loading => None,
        }
    }

    /// Look up a view by its shortcut key
    pub fn from_shortcut(c: char) -> Option<ViewId> {
        match c {
            'h' => Some(ViewId::Home),
            'r' => Some(ViewId::Resume),
            'b' => Some(ViewId::Blog),
            'p' => Some(ViewId::Projects),
            'c' => Some(ViewId::Contact),
            _ => None,
        }
    }
}

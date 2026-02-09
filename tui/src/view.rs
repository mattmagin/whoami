/// Which view is currently active
#[derive(Clone, Copy, PartialEq, Debug)]
pub enum View {
    Loading,
    Home,
    Resume,
    Blog,
    Projects,
    Contact,
}

/// Result of a view handling a key event
#[derive(Clone, Copy, PartialEq, Debug)]
pub enum ViewResult {
    /// Key was handled internally, no navigation needed
    Handled,
    /// Key was not handled by this view
    Ignored,
    /// Navigate back (to home, or previous state within view)
    Back,
    /// Navigate to a specific view
    NavigateTo(View),
    /// Quit the application
    Quit,
}

#[derive(Clone, Copy)]
pub struct ViewConfig {
    pub view: View,
    pub shortcut: char,
    pub label: &'static str,
    pub description: &'static str,
}

// TODO: we are likely going to use the menu on other pages, the home currently shows on home, but we are going to want to filter out the current page
pub const VIEWS: &[ViewConfig] = &[
    ViewConfig {
        view: View::Home,
        shortcut: 'h',
        label: "Home",
        description: "You are here",
    },
    ViewConfig {
        view: View::Resume,
        shortcut: 'r',
        label: "Resume",
        description: "View my professional experience",
    },
    ViewConfig {
        view: View::Blog,
        shortcut: 'b',
        label: "Blog",
        description: "Read my technical articles",
    },
    ViewConfig {
        view: View::Projects,
        shortcut: 'p',
        label: "Projects",
        description: "Explore my work",
    },
    ViewConfig {
        view: View::Contact,
        shortcut: 'c',
        label: "Contact",
        description: "Get in touch",
    },
];

impl View {
    /// Look up a view by its shortcut key
    pub fn from_shortcut(c: char) -> Option<View> {
        VIEWS.iter()
            .find(|config| config.shortcut == c)
            .map(|config| config.view)
    }

    /// Get the config for this view (if it's a navigable view)
    #[allow(dead_code)]
    pub fn config(self) -> Option<&'static ViewConfig> {
        VIEWS.iter().find(|config| config.view == self)
    }
}

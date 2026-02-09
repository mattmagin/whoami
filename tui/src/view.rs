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

#[derive(Clone, Copy)]
pub struct ViewConfig {
    pub view: View,
    pub shortcut: char,
    pub label: &'static str,
    pub description: &'static str,
}

pub const VIEWS: &[ViewConfig] = &[
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

//! Projects view component with project cards and list selection

use ratatui::layout::Rect;
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use tuirealm::command::{Cmd, CmdResult, Direction};
use tuirealm::event::{Key, KeyEvent, KeyModifiers};
use tuirealm::props::{AttrValue, Attribute, Props};
use tuirealm::{Component, Event, Frame, MockComponent, NoUserEvent, State, StateValue};

use crate::content::PROJECTS;
use crate::msg::{Msg, ViewId};
use crate::styles;
use crate::widgets::{accent_bold, featured_badge, PageLayout, SelectableItem, TagList};

/// Projects MockComponent - handles the visual representation
pub struct ProjectsMock {
    props: Props,
    cursor: usize,
}

impl Default for ProjectsMock {
    fn default() -> Self {
        Self::new()
    }
}

impl ProjectsMock {
    pub fn new() -> Self {
        Self {
            props: Props::default(),
            cursor: 0,
        }
    }

    fn cursor_up(&mut self) {
        if self.cursor > 0 {
            self.cursor -= 1;
        }
    }

    fn cursor_down(&mut self) {
        if self.cursor < PROJECTS.len().saturating_sub(1) {
            self.cursor += 1;
        }
    }
}

impl MockComponent for ProjectsMock {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        PageLayout::new("🚀 Projects")
            .help("↑/k up • ↓/j down • esc back")
            .render(frame, area, |f, content_area| {
                // Sort projects: featured first, then others
                let mut featured: Vec<_> = PROJECTS.iter().filter(|p| p.featured).collect();
                let mut other: Vec<_> = PROJECTS.iter().filter(|p| !p.featured).collect();
                featured.append(&mut other);

                // Build project list
                let mut lines: Vec<Line> = Vec::new();
                for (i, project) in featured.iter().enumerate() {
                    let is_selected = i == self.cursor;

                    // Name line with featured badge
                    let mut item = SelectableItem::new(project.name)
                        .selected(is_selected)
                        .unselected_style(accent_bold());

                    if project.featured {
                        item = item.badge(featured_badge());
                    }

                    lines.push(item.to_line());

                    // Description
                    lines.push(Line::from(vec![
                        Span::raw("    "),
                        Span::styled(project.description.to_string(), styles::text()),
                    ]));

                    // Tech stack tags
                    lines.push(TagList::from_vec(&project.tech_stack).indent(4).to_line());

                    // Links
                    let mut link_parts = Vec::new();
                    if let Some(github) = project.github_url {
                        link_parts.push(format!("GitHub: {}", github));
                    }
                    if let Some(url) = project.url {
                        link_parts.push(format!("Live: {}", url));
                    }
                    if !link_parts.is_empty() {
                        lines.push(Line::from(vec![
                            Span::raw("    "),
                            Span::styled(link_parts.join(" • "), styles::muted()),
                        ]));
                    }

                    lines.push(Line::from(""));
                }

                let content = Paragraph::new(lines);
                f.render_widget(content, content_area);
            });
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.props.get(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.props.set(attr, value);
    }

    fn state(&self) -> State {
        State::One(StateValue::Usize(self.cursor))
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        match cmd {
            Cmd::Move(Direction::Up) => {
                self.cursor_up();
                CmdResult::Changed(self.state())
            }
            Cmd::Move(Direction::Down) => {
                self.cursor_down();
                CmdResult::Changed(self.state())
            }
            _ => CmdResult::None,
        }
    }
}

/// Projects Component - bridges MockComponent to application messages
pub struct Projects {
    component: ProjectsMock,
}

impl Default for Projects {
    fn default() -> Self {
        Self::new()
    }
}

impl Projects {
    pub fn new() -> Self {
        Self {
            component: ProjectsMock::new(),
        }
    }
}

impl Component<Msg, NoUserEvent> for Projects {
    fn on(&mut self, ev: Event<NoUserEvent>) -> Option<Msg> {
        match ev {
            Event::Keyboard(KeyEvent {
                code: Key::Char('c'),
                modifiers,
            }) if modifiers.contains(KeyModifiers::CONTROL) => Some(Msg::Quit),
            Event::Keyboard(KeyEvent { code: Key::Esc, .. })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('q'),
                ..
            }) => Some(Msg::GoBack),
            Event::Keyboard(KeyEvent {
                code: Key::Up, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('k'),
                ..
            }) => {
                self.component.perform(Cmd::Move(Direction::Up));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Down, ..
            })
            | Event::Keyboard(KeyEvent {
                code: Key::Char('j'),
                ..
            }) => {
                self.component.perform(Cmd::Move(Direction::Down));
                Some(Msg::None)
            }
            Event::Keyboard(KeyEvent {
                code: Key::Char(c),
                ..
            }) => {
                // Check for navigation shortcuts
                if let Some(view) = ViewId::from_shortcut(c) {
                    Some(Msg::NavigateTo(view))
                } else {
                    None
                }
            }
            _ => None,
        }
    }
}

impl MockComponent for Projects {
    fn view(&mut self, frame: &mut Frame, area: Rect) {
        self.component.view(frame, area);
    }

    fn query(&self, attr: Attribute) -> Option<AttrValue> {
        self.component.query(attr)
    }

    fn attr(&mut self, attr: Attribute, value: AttrValue) {
        self.component.attr(attr, value);
    }

    fn state(&self) -> State {
        self.component.state()
    }

    fn perform(&mut self, cmd: Cmd) -> CmdResult {
        self.component.perform(cmd)
    }
}

//! View orchestration - mounting/unmounting components and layout management

use tuirealm::application::PollStrategy;
use tuirealm::{Application, NoUserEvent};

use crate::components::{Blog, Contact, Home, Loading, Projects, Resume};
use crate::msg::{Msg, ViewId};

/// Type alias for our Application
pub type App = Application<ViewId, Msg, NoUserEvent>;

/// Mount a component for the given view ID
pub fn mount_view(app: &mut App, view_id: ViewId) -> Result<(), Box<dyn std::error::Error>> {
    // Unmount all existing components first
    let _ = app.umount(&ViewId::Loading);
    let _ = app.umount(&ViewId::Home);
    let _ = app.umount(&ViewId::Resume);
    let _ = app.umount(&ViewId::Blog);
    let _ = app.umount(&ViewId::Projects);
    let _ = app.umount(&ViewId::Contact);

    // Mount the new component
    match view_id {
        ViewId::Loading => {
            app.mount(view_id, Box::new(Loading::new()), vec![])?;
        }
        ViewId::Home => {
            app.mount(view_id, Box::new(Home::new()), vec![])?;
        }
        ViewId::Resume => {
            app.mount(view_id, Box::new(Resume::new()), vec![])?;
        }
        ViewId::Blog => {
            app.mount(view_id, Box::new(Blog::new()), vec![])?;
        }
        ViewId::Projects => {
            app.mount(view_id, Box::new(Projects::new()), vec![])?;
        }
        ViewId::Contact => {
            app.mount(view_id, Box::new(Contact::new()), vec![])?;
        }
    }

    // Set it as active
    app.active(&view_id)?;

    Ok(())
}

/// Poll for events and collect messages
pub fn poll_messages(app: &mut App) -> Vec<Msg> {
    match app.tick(PollStrategy::UpTo(3)) {
        Ok(messages) => messages,
        Err(_) => vec![],
    }
}

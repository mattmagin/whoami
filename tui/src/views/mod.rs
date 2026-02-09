//! View modules for the TUI

mod home;
mod resume;
mod blog;
mod projects;
mod contact;

pub use home::HomeView;
pub use resume::ResumeView;
pub use blog::BlogView;
pub use projects::ProjectsView;
pub use contact::ContactView;

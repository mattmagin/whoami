//! tui-realm component implementations
//!
//! Each component wraps a MockComponent and bridges to the application
//! via the Event→Message system.

mod blog;
mod contact;
mod home;
mod loading;
mod projects;
mod resume;

pub use blog::Blog;
pub use contact::Contact;
pub use home::Home;
pub use loading::Loading;
pub use projects::Projects;
pub use resume::Resume;

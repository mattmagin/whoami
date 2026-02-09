//! Reusable widget components

mod code_block;
mod loading;
mod markdown;
mod page_layout;
mod selectable_item;
mod tag_list;
mod text_input;
mod text_wrap;
mod typewriter;

pub use code_block::CodeBlock;
pub use loading::{LoadingState, LoadingWidget};
pub use markdown::{render_line as render_markdown_line, Markdown};
pub use page_layout::PageLayout;
pub use selectable_item::{accent_bold, featured_badge, MenuItem, SelectableItem};
pub use tag_list::TagList;
pub use text_input::TextInput;
pub use text_wrap::wrap_text;
pub use typewriter::{TypewriterState, TypewriterWidget};

Typelizer.configure do |config|
  config.output_dir = Rails.root.join("../web/src/types/generated")
  config.types_import_path = nil # No imports needed for standalone types
  config.verbatim_module_syntax = true # Compatible with TypeScript verbatimModuleSyntax
end

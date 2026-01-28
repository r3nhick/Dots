require("nvchad.configs.lspconfig").defaults()

local servers = { "html", "cssls", "pyright", "clangd"}
vim.lsp.enable(servers)

vim.lsp.config.qmlls = {
  cmd = { "qmlls6" },
  filetypes = { "qml" },
  root_markers = { ".git", "CMakeLists.txt", "qmldir" },
}

vim.lsp.enable("qmlls")

-- read :h vim.lsp.config for changing options of lsp servers 

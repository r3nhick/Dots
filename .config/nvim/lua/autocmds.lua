require "nvchad.autocmds"


-- Автоматичне збереження сесії при закритті Neovim
vim.api.nvim_create_autocmd("VimLeavePre", {
  callback = function()
    require("persistence").save()
  end,
})


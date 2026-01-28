require "nvchad.options"

-- add yours here!
vim.opt.swapfile = false

-- Зсув виділення вправо / вліво
vim.keymap.set("v", "<Tab>", ">gv", { noremap = true, silent = true })
vim.keymap.set("v", "<S-Tab>", "<gv", { noremap = true, silent = true })


vim.opt.clipboard = "unnamedplus"

-- local o = vim.o
-- o.cursorlineopt ='both' -- to enable cursorline!

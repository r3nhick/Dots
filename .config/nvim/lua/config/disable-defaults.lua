-- Видалити вбудовані бінди Neovim 0.12
-- Викликається з init.lua перед завантаженням плагінів

-- Видалити gc/gcc (вбудовані коментарі)
pcall(vim.keymap.del, { "n", "x" }, "gc")
pcall(vim.keymap.del, "n", "gcc")
pcall(vim.keymap.del, "o", "gc")

-- Видалити діагностичні бінди
pcall(vim.keymap.del, "n", "<C-W>d")
pcall(vim.keymap.del, "n", "<C-W><C-D>")
pcall(vim.keymap.del, "n", "[d")
pcall(vim.keymap.del, "n", "]d")
pcall(vim.keymap.del, "n", "[D")
pcall(vim.keymap.del, "n", "]D")

-- Видалити LSP-дефолти (gra, grn, grr, gri, grt, grx, gO)
pcall(vim.keymap.del, "n", "gra")
pcall(vim.keymap.del, "n", "grn")
pcall(vim.keymap.del, "n", "grr")
pcall(vim.keymap.del, "n", "gri")
pcall(vim.keymap.del, "n", "grt")
pcall(vim.keymap.del, "n", "grx")
pcall(vim.keymap.del, "n", "gO")

-- Видалити K (hover)
pcall(vim.keymap.del, "n", "K")

-- Видалити gd/gD/gr
pcall(vim.keymap.del, "n", "gd")
pcall(vim.keymap.del, "n", "gD")
pcall(vim.keymap.del, "n", "gr")

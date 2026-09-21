local map = vim.keymap.set

local function arrow_hint()
  vim.notify(" Стрілки вимкнені — використовуй h / j / k / l", vim.log.levels.WARN)
end

for _, key in ipairs({ "Up", "Down", "Left", "Right" }) do
  map({ "n", "v", "i" }, "<" .. key .. ">", arrow_hint, { desc = "Arrow " .. key .. " disabled" })
end

map("n", "<C-s>", "<cmd>w<CR>", { desc = "Save file" })
map("n", "<leader>q", "<cmd>q<CR>", { desc = "Quit" })
map("n", "<leader>rl", "<cmd>source $MYVIMRC<CR>", { desc = "Reload init.lua" })

map("n", "<C-h>", "<C-w>h", { desc = "Go to left window" })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window" })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window" })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window" })

map("n", "<C-Up>", "<cmd>resize +2<CR>", { desc = "Increase window height" })
map("n", "<C-Down>", "<cmd>resize -2<CR>", { desc = "Decrease window height" })
map("n", "<C-Left>", "<cmd>vertical resize -2<CR>", { desc = "Decrease window width" })
map("n", "<C-Right>", "<cmd>vertical resize +2<CR>", { desc = "Increase window width" })

map("v", "<A-j>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<A-k>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })

map("n", "<leader>bn", "<cmd>enew<CR>", { desc = "New buffer" })
map("n", "<leader>bd", "<cmd>bd<CR>", { desc = "Delete buffer" })
map("n", "<leader>bl", "<cmd>ls<CR>", { desc = "List buffers" })

map("n", "<Tab>", ">>", { desc = "Indent line" })
map("n", "<S-Tab>", "<<", { desc = "Outdent line" })
map("v", "<Tab>", ">gv", { desc = "Indent selection" })
map("v", "<S-Tab>", "<gv", { desc = "Outdent selection" })

map("n", "<leader>]", function() require("nvchad.tabufline").next() end, { desc = "Next buffer" })
map("n", "<leader>[", function() require("nvchad.tabufline").prev() end, { desc = "Prev buffer" })
map("n", "<leader>x", function() require("nvchad.tabufline").close_buffer() end, { desc = "Close buffer" })

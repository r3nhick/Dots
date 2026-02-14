local status_ok, alpha = pcall(require, "alpha")
if not status_ok then
  return
end

local dashboard = require("alpha.themes.dashboard")


dashboard.section.header.val = { "Lets go / " }


dashboard.section.buttons.val = {
  dashboard.button("e", "  New file", ":ene <BAR> startinsert <CR>"),
  dashboard.button("f", "  Find file", ":Telescope find_files hidden=true no_ignore=true<CR>"),
  dashboard.button("g", "󰱼  Live grep", ":Telescope live_grep<CR>"),
  dashboard.button("r", "  Recent files", ":Telescope oldfiles<CR>"),
  -- dashboard.button("t", "  File tree", ":NvimTreeToggle<CR>"),
  dashboard.button("s", "󰁯  Restore session", ":lua require('persistence').load({ last = true })<CR>"),
  dashboard.button("l", "󰒲  Lazy", ":Lazy<CR>"),
  dashboard.button("q", "  Quit", ":qa<CR>"),
}

--
-- dashboard.section.buttons.val = {
--   dashboard.button("t", "  File tree", ":NvimTreeToggle<CR>"),
--   dashboard.button("e", "  Open file", ":NvimTreeToggle <BAR> startinsert <CR>"),
--   dashboard.button("f", " Find file", ":Telescope find_files<CR>"),
--   dashboard.button("g", "󰥨 Live grep", ":Telescope live_grep<CR>"),
--   dashboard.button("s", "  Load last session", ":lua require('persistence').load({ last = true })<CR>"),
--   dashboard.button("r", "  Recent files", ":Telescope oldfiles <CR>"),
--   dashboard.button("q", "  Quit NVIM", ":qa<CR>"),
-- }

alpha.setup(dashboard.opts)


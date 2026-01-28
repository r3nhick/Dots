-- This file needs to have same structure as nvconfig.lua 
-- https://github.com/NvChad/ui/blob/v3.0/lua/nvconfig.lua
-- Please read that file to know all available options :( 

---@type ChadrcConfig
local M = {}

M.base46 = {
	theme = "vscode_dark",
  transparency = false,
  dashboard = true
	-- hl_override = {
	-- 	Comment = { italic = true },
	-- 	["@comment"] = { italic = true },
	-- },
}
vim.api.nvim_create_autocmd("BufEnter", {
  callback = function()
    local path = vim.fn.expand("%:p:h")
    if path ~= "" then
      vim.cmd("lcd " .. path)
    end
  end,
})

-- M.nvdash = { load_on_startup = true }
-- M.ui = {
--       tabufline = {
--          lazyload = false
--      }
-- }

return M

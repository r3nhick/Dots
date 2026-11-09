-- Load serpantinium colors
local colors_file = vim.fn.expand("~/.local/state/serpantinum/qs_colors.json")
local serpantinum = {}

if vim.fn.filereadable(colors_file) == 1 then
  local file = io.open(colors_file, "r")
  if file then
    local content = file:read("*all")
    file:close()
    serpantinum = vim.fn.json_decode(content) or {}
  end
end

-- Map colors from serpantinium theme
local colors = {
  black = serpantinum.surface0 or "#1d211a",
  black2 = serpantinum.crust or "#11140e",
  one_bg2 = serpantinum.surface1 or "#282b24",
  one_bg3 = serpantinum.surface1 or "#282b24",
  white = serpantinum.text or "#e1e4d9",
  light_grey = serpantinum.subtext1 or "#8d9286",
  red = serpantinum.red or "#ffb4ab",
  green = serpantinum.blue or "#aad291",  -- serpantinium's blue is actually green
  nord_blue = serpantinum.teal or "#bdcbb0",
  blue = serpantinum.blue or "#aad291",
}

vim.api.nvim_set_hl(0, "TbFill", { bg = colors.black2 })

vim.api.nvim_set_hl(0, "TbBufOn", { fg = colors.white, bg = colors.black })
vim.api.nvim_set_hl(0, "TbBufOff", { fg = colors.light_grey, bg = colors.black2 })
vim.api.nvim_set_hl(0, "TbBufOnModified", { fg = colors.green, bg = colors.black })
vim.api.nvim_set_hl(0, "TbBufOffModified", { fg = colors.red, bg = colors.black2 })
vim.api.nvim_set_hl(0, "TbBufOnClose", { fg = colors.red, bg = colors.black })
vim.api.nvim_set_hl(0, "TbBufOffClose", { fg = colors.light_grey, bg = colors.black2 })

vim.api.nvim_set_hl(0, "TbTabNewBtn", { fg = colors.white, bg = colors.one_bg2 })
vim.api.nvim_set_hl(0, "TbTabOn", { fg = colors.red })
vim.api.nvim_set_hl(0, "TbTabOff", { fg = colors.white, bg = colors.black2 })
vim.api.nvim_set_hl(0, "TbTabCloseBtn", { fg = colors.black, bg = colors.nord_blue })
vim.api.nvim_set_hl(0, "TBTabTitle", { fg = colors.black, bg = colors.blue })
vim.api.nvim_set_hl(0, "TbThemeToggleBtn", { bold = true, fg = colors.white, bg = colors.one_bg3 })
vim.api.nvim_set_hl(0, "TbCloseAllBufsBtn", { bold = true, bg = colors.red, fg = colors.black })

vim.api.nvim_set_hl(0, "DevIconDefault", { fg = colors.light_grey, bg = "NONE" })

return colors

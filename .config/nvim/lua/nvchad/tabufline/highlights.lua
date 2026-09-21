local colors = {
  black = "#2e2e32",
  black2 = "#1e1e1e",
  one_bg2 = "#2e2e32",
  one_bg3 = "#2e2e32",
  white = "#abb2bf",
  light_grey = "#5c6370",
  red = "#e86671",
  green = "#98c379",
  nord_blue = "#81a2be",
  blue = "#81a2be",
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
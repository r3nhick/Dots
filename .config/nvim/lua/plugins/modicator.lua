return {
  "mawkler/modicator.nvim",
  event = "VeryLazy",
  init = function()
    vim.opt.cursorline = true
  end,
  opts = {
    show_warnings = false,
    integration = {
      lualine = {
        enabled = true,
      },
    },
  },
}
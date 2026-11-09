return {
  "folke/zen-mode.nvim",
  cmd = "ZenMode",
  keys = {
    { "<leader>tz", "<cmd>ZenMode<cr>", desc = "Zen Mode" },
  },
  opts = {
    window = {
      backdrop = 0.95, -- затемнення фону поза центральним вікном
      width = 120, -- ширина центрального вікна
      options = {
        signcolumn = "no",
        number = false,
        relativenumber = false,
        cursorline = false,
      },
    },
    plugins = {
      -- лишити оновлення в фоні для цих плагінів
      gitsigns = { enabled = true },
    },
  },
}
-- gitsigns.nvim: індикація змін (знаки), робота з ханками, blame
return {
  "lewis6991/gitsigns.nvim",
  event = { "BufReadPre", "BufNewFile" },
  opts = {
    signs = {
      add = { text = "▎" },
      change = { text = "▎" },
      delete = { text = "" },
      topdelete = { text = "" },
      changedelete = { text = "▎" },
      untracked = { text = "▎" },
    },
    signcolumn = true,
    current_line_blame = false,
    current_line_blame_opts = {
      virt_text = true,
      virt_text_pos = "eol",
      delay = 500,
    },
    current_line_blame_formatter = "<author>, <author_time:%Y-%m-%d> • <summary>",
    preview_config = { border = "rounded" },
  },
  keys = {
    -- Навігація по ханках
    { "]c", function() require("gitsigns").nav_hunk("next") end, desc = "Наступний ханк" },
    { "[c", function() require("gitsigns").nav_hunk("prev") end, desc = "Попередній ханк" },
    -- Дії з ханками (<leader>h)
    { "<leader>hs", function() require("gitsigns").stage_hunk() end, desc = "Stage ханк" },
    { "<leader>hr", function() require("gitsigns").reset_hunk() end, desc = "Reset ханк" },
    { "<leader>hs", function() require("gitsigns").stage_hunk() end, mode = "v", desc = "Stage ханк" },
    { "<leader>hr", function() require("gitsigns").reset_hunk() end, mode = "v", desc = "Reset ханк" },
    { "<leader>hS", function() require("gitsigns").stage_buffer() end, desc = "Stage весь буфер" },
    { "<leader>hR", function() require("gitsigns").reset_buffer() end, desc = "Reset весь буфер" },
    { "<leader>hp", function() require("gitsigns").preview_hunk() end, desc = "Перегляд ханка" },
    { "<leader>hb", function() require("gitsigns").blame_line({ full = true }) end, desc = "Blame рядка" },
    { "<leader>hd", function() require("gitsigns").diffthis() end, desc = "Diff цього файлу" },
    { "<leader>hu", function() require("gitsigns").undo_stage_hunk() end, desc = "Скасувати stage ханка" },
    -- Toggle у групі Toggle
    { "<leader>tb", function() require("gitsigns").toggle_current_line_blame() end, desc = "Toggle blame рядка" },
  },
}

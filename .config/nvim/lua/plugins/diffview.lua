-- diffview.nvim: сучасні діфи, історія файлів і вирішення конфліктів (3-way)
return {
  "sindrets/diffview.nvim",
  cmd = { "DiffviewOpen", "DiffviewClose", "DiffviewFileHistory", "DiffviewToggleFiles" },
  keys = {
    { "<leader>gd", "<cmd>DiffviewOpen<CR>", desc = "Відкрити діфи" },
    { "<leader>gD", "<cmd>DiffviewClose<CR>", desc = "Закрити діфи" },
    { "<leader>gh", "<cmd>DiffviewFileHistory %<CR>", desc = "Історія файлу" },
    { "<leader>gH", "<cmd>DiffviewFileHistory<CR>", desc = "Історія репозиторію" },
  },
  opts = {
    enhanced_diff_hl = true,
    view = {
      -- Вирішення конфліктів: 3-панельний режим
      merge_tool = {
        layout = "diff3_mixed",
        disable_diagnostics = true,
        winbar_info = true,
      },
    },
  },
}

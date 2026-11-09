-- Neogit: сучасний Git-UI (як Magit) — гілки, stage, коміти, push/pull
return {
  "NeogitOrg/neogit",
  dependencies = {
    "nvim-lua/plenary.nvim",
    "sindrets/diffview.nvim",
    "nvim-telescope/telescope.nvim",
  },
  cmd = "Neogit",
  keys = {
    { "<leader>gg", "<cmd>Neogit<CR>", desc = "Git UI (Neogit)" },
    { "<leader>gC", "<cmd>Neogit commit<CR>", desc = "Commit" },
    { "<leader>gp", "<cmd>Neogit push<CR>", desc = "Push" },
    { "<leader>gP", "<cmd>Neogit pull<CR>", desc = "Pull" },
  },
  opts = {
    graph_style = "unicode", -- сучасний графік комітів
    kind = "split",
    integrations = {
      diffview = true, -- інтеграція з diffview для діфів
      telescope = true, -- інтеграція з telescope для пікерів
    },
    commit_editor = { kind = "split" },
  },
}

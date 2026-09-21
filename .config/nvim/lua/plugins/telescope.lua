return {
  "nvim-telescope/telescope.nvim",
  cmd = "Telescope",
  dependencies = {
    "nvim-lua/plenary.nvim",
    { "nvim-telescope/telescope-fzf-native.nvim", build = "make" },
  },
  keys = {
    { "<leader>ff", "<cmd>Telescope find_files<CR>", desc = "Find files" },
    { "<leader>fa", "<cmd>Telescope find_files follow=true no_ignore=true hidden=true<CR>", desc = "Find all files" },
    { "<leader>fw", "<cmd>Telescope live_grep<CR>", desc = "Live grep" },
    { "<leader>fb", "<cmd>Telescope buffers<CR>", desc = "Find buffers" },
    { "<leader>fh", "<cmd>Telescope help_tags<CR>", desc = "Help tags" },
    { "<leader>fz", "<cmd>Telescope current_buffer_fuzzy_find<CR>", desc = "Find in current buffer" },
    { "<leader>fo", "<cmd>Telescope oldfiles<CR>", desc = "Find oldfiles" },
    { "<leader>ma", "<cmd>Telescope marks<CR>", desc = "Find marks" },
    { "<leader>cm", "<cmd>Telescope git_commits<CR>", desc = "Git commits" },
    { "<leader>gt", "<cmd>Telescope git_status<CR>", desc = "Git status" },
  },
  config = function()
    local telescope = require("telescope")
    telescope.setup({
      defaults = {
        sorting_strategy = "ascending",
        layout_config = {
          horizontal = { prompt_position = "top" },
        },
        mappings = {
          i = {
            ["<Up>"] = false,
            ["<Down>"] = false,
            ["<Left>"] = false,
            ["<Right>"] = false,
            ["<C-j>"] = "move_selection_next",
            ["<C-k>"] = "move_selection_previous",
          },
          n = {
            ["<Up>"] = false,
            ["<Down>"] = false,
            ["<Left>"] = false,
            ["<Right>"] = false,
            ["<C-j>"] = "move_selection_next",
            ["<C-k>"] = "move_selection_previous",
          },
        },
        file_ignore_patterns = {
          "node_modules",
          ".git",
          "build",
          "dist",
        },
      },
      pickers = {
        live_grep = {
          layout_config = { horizontal = { preview_width = 0.7 } },
        },
        grep_string = {
          layout_config = { horizontal = { preview_width = 0.7 } },
        },
      },
    })
    pcall(telescope.load_extension, "fzf")
  end,
}
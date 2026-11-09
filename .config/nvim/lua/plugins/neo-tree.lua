return {
  "nvim-neo-tree/neo-tree.nvim",
  cmd = "Neotree",
  keys = {
    { "<leader>e", "<cmd>Neotree toggle<CR>", desc = "Explorer NeoTree" },
  },
  dependencies = {
    "nvim-lua/plenary.nvim",
    "nvim-tree/nvim-web-devicons",
    "MunifTanjim/nui.nvim",
  },
  opts = {
    popup_border_style = "rounded",
    sources = { "filesystem", "buffers", "git_status" },
    open_files_do_not_replace_types = { "terminal", "telescope", "qf" },
    filesystem = {
      follow_current_file = { enabled = true },
      use_libuv_file_watcher = true,
      group_empty_dirs = true,
      filtered_items = {
        visible = false,
        show_hidden_count = true,
        hide_dotfiles = true,
        hide_gitignored = true,
      },
    },
    default_component_configs = {
      git_status = {
        symbols = {
          renamed = "",
          unstaged = "󰄱",
          untracked = "󰆓",
          staged = "󰁍",
          ignored = "◌",
        },
      },
      indent = {
        with_expanders = true,
        expander_collapsed = "",
        expander_expanded = "󰅀",
      },
    },
    window = {
      mappings = {
        ["<space>"] = "none",
      },
    },
  },
}

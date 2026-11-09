return {
  "rachartier/smear-cursor.nvim",
  enabled = false, -- вимкнено: несумісний з Neovim 0.12 (nvim_win_set_option deprecated)
  event = "VeryLazy",
  opts = {
    cursor_color = "#abb2bf",
    normal_bg = "#1e1e1e",
    smear_between_buffers = true,
    smear_between_neighbor_lines = true,
    use_floating_windows = true,
    legacy_computing_symbols_support = false,
    hide_target_hack = true,
  },
}
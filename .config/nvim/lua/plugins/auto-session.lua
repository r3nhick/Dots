return {
  "rmagatti/auto-session",
  lazy = false,
  config = function()
    require("auto-session").setup({
      log_level = "error",
      auto_session_enabled = true,
      auto_save_enabled = true,
      auto_restore_enabled = true,
      auto_session_suppress_dirs = { "~/", "~/Downloads", "/" },
      auto_session_use_git_branch = false,
      
      -- Хуки для очищення перед збереженням сесії
      pre_save_cmds = {
        function()
          -- Закрити neo-tree перед збереженням
          if vim.fn.exists(":Neotree") > 0 then
            vim.cmd("silent! Neotree close")
          end
        end,
      },
      
      -- Хуки після відновлення сесії
      post_restore_cmds = {},
      
      session_lens = {
        -- Інтеграція з telescope для вибору сесій
        buftypes_to_ignore = {},
        load_on_setup = true,
        theme_conf = { border = true },
        previewer = false,
      },
    })
  end,
}

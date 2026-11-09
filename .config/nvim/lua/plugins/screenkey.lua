return {
  "NStefan002/screenkey.nvim",
  lazy = false,
  version = "*",
  config = function()
    require("screenkey").setup({
      win_opts = {
        relative = "editor",
        anchor = "SE",
        width = 20,
        height = 1,
        border = "rounded",
        zindex = 1000, -- Показувати поверх усіх вікон
      },
      compress_after = 3,
      clear_after = 3,
      disable = {
        filetypes = {},
        buftypes = {},
      },
      show_leader = true,
      group_mappings = true,
      display_infront = {}, -- Показувати поверх цих вікон
      display_behind = {},
      filter = function(keys)
        return keys
      end,
      keys = {
        ["<TAB>"] = "Tab",
        ["<CR>"] = "Enter",
        ["<ESC>"] = "Esc",
        ["<SPACE>"] = "Space",
        ["<BS>"] = "Backspace",
        ["<DEL>"] = "Del",
        ["<LEFT>"] = "←",
        ["<RIGHT>"] = "→",
        ["<UP>"] = "↑",
        ["<DOWN>"] = "↓",
        ["<HOME>"] = "Home",
        ["<END>"] = "End",
        ["<PAGEUP>"] = "PgUp",
        ["<PAGEDOWN>"] = "PgDn",
      },
    })
    
    -- Автоматично увімкнути screenkey при запуску, якщо він був увімкнений раніше
    local state_file = vim.fn.stdpath("data") .. "/screenkey_state.txt"
    local state = vim.fn.filereadable(state_file) == 1 and vim.fn.readfile(state_file)[1] or "off"
    
    if state == "on" then
      vim.defer_fn(function()
        require("screenkey").toggle()
      end, 100)
    end
  end,
}

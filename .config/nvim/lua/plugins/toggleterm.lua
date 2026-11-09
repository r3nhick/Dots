return {
  "akinsho/toggleterm.nvim",
  version = "*",
  keys = {
    { "<leader>tt", desc = "Toggle terminal" },
    { "<leader>th", desc = "Toggle horizontal terminal" },
    { "<leader>tv", desc = "Toggle vertical terminal" },
  },
  config = function()
    require("toggleterm").setup({
      size = function(term)
        if term.direction == "horizontal" then
          return 15
        elseif term.direction == "vertical" then
          return vim.o.columns * 0.4
        end
      end,
      open_mapping = [[<leader>tt]],
      hide_numbers = true,
      shade_terminals = true,
      shading_factor = 2,
      start_in_insert = true,
      insert_mappings = true,
      terminal_mappings = true,
      persist_size = true,
      persist_mode = true,
      direction = "float",
      close_on_exit = true,
      shell = vim.o.shell,
      auto_scroll = true,
      float_opts = {
        border = "curved",
        width = math.floor(vim.o.columns * 0.8),
        height = math.floor(vim.o.lines * 0.8),
        winblend = 0,
      },
      winbar = {
        enabled = false,
      },
      -- Open terminal in current file's directory
      on_open = function(term)
        local current_file = vim.api.nvim_buf_get_name(0)
        if current_file and current_file ~= "" then
          local file_dir = vim.fn.fnamemodify(current_file, ":p:h")
          if vim.fn.isdirectory(file_dir) == 1 then
            vim.cmd("lcd " .. vim.fn.fnameescape(file_dir))
          end
        end
      end,
    })

    -- Custom terminal keymaps
    function _G.set_terminal_keymaps()
      local opts = { buffer = 0 }
      vim.keymap.set("t", "<esc>", [[<C-\><C-n>]], opts)
      vim.keymap.set("t", "<C-h>", [[<Cmd>wincmd h<CR>]], opts)
      vim.keymap.set("t", "<C-j>", [[<Cmd>wincmd j<CR>]], opts)
      vim.keymap.set("t", "<C-k>", [[<Cmd>wincmd k<CR>]], opts)
      vim.keymap.set("t", "<C-l>", [[<Cmd>wincmd l<CR>]], opts)
    end

    vim.cmd("autocmd! TermOpen term://* lua set_terminal_keymaps()")

    -- Specific terminal types
    local Terminal = require("toggleterm.terminal").Terminal

    -- Floating terminal (default)
    local float_term = Terminal:new({
      direction = "float",
      hidden = true,
    })

    function _FLOAT_TOGGLE()
      float_term:toggle()
    end

    -- Horizontal terminal
    local horizontal_term = Terminal:new({
      direction = "horizontal",
      hidden = true,
    })

    function _HORIZONTAL_TOGGLE()
      horizontal_term:toggle()
    end

    -- Vertical terminal
    local vertical_term = Terminal:new({
      direction = "vertical",
      hidden = true,
    })

    function _VERTICAL_TOGGLE()
      vertical_term:toggle()
    end

    -- Keymaps
    vim.keymap.set("n", "<leader>tt", "<cmd>lua _FLOAT_TOGGLE()<CR>", { desc = "Toggle floating terminal" })
    vim.keymap.set("n", "<leader>th", "<cmd>lua _HORIZONTAL_TOGGLE()<CR>", { desc = "Toggle horizontal terminal" })
    vim.keymap.set("n", "<leader>tv", "<cmd>lua _VERTICAL_TOGGLE()<CR>", { desc = "Toggle vertical terminal" })
  end,
}

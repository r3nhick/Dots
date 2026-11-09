return {
  "kevinhwang91/nvim-ufo",
  dependencies = "kevinhwang91/promise-async",
  event = "BufReadPost",
  init = function()
    -- Налаштування фолдінгу (до завантаження плагіна)
    vim.o.foldcolumn = "0" -- без вертикальної |-полоски
    vim.o.foldlevel = 99
    vim.o.foldlevelstart = 99
    vim.o.foldenable = true
  end,
  opts = {
    provider_selector = function(bufnr, filetype, buftype)
      return { "treesitter", "indent" }
    end,
  },
  config = function(_, opts)
    require("ufo").setup(opts)
  end,
  keys = {
    {
      "<leader>zR",
      function()
        require("ufo").openAllFolds()
      end,
      desc = "Open all folds",
    },
    {
      "<leader>zM",
      function()
        require("ufo").closeAllFolds()
      end,
      desc = "Close all folds",
    },
    {
      "<leader>zr",
      function()
        require("ufo").openFoldsExceptKinds()
      end,
      desc = "Fold less",
    },
    {
      "<leader>zm",
      function()
        require("ufo").closeFoldsWith()
      end,
      desc = "Fold more",
    },
    {
      "<leader>zp",
      function()
        require("ufo").peekFoldedLinesUnderCursor()
      end,
      desc = "Peek fold",
    },
  },
}

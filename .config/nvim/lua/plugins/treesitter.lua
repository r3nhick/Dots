return {
  "nvim-treesitter/nvim-treesitter",
  branch = "main",
  lazy = false,
  build = ":TSUpdate",
  config = function()
    local parsers = {
      "c",
      "cpp",
      "python",
      "javascript",
      "typescript",
      "lua",
      "css",
      "html",
      "bash",
      "vim",
      "vimdoc",
      "comment",
    }

    -- Встановити парсери (async, no-op якщо вже встановлені)
    require("nvim-treesitter").install(parsers)

    -- Увімкнути treesitter підсвічування для буферів, де є парсер
    vim.api.nvim_create_autocmd("FileType", {
      callback = function()
        pcall(vim.treesitter.start)
      end,
    })
  end,
}

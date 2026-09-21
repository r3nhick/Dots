return {
  "nvim-treesitter/nvim-treesitter",
  version = false,
  build = ":TSUpdate",
  config = function()
    require("nvim-treesitter").setup({
      ensure_installed = {
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
      },
      highlight = { enable = true },
      indent = { enable = true },
    })
  end,
}
return {
  "abecodes/tabout.nvim",
  lazy = false,
  config = function()
    require("tabout").setup({
      -- <Tab> / <S-Tab> обробляємо в мапінгах nvim-cmp (див. lua/plugins/cmp.lua),
      -- тому тут не перемаплюємо клавіші, щоб не перебивати cmp.
      tabkey = "",
      backwards_tabkey = "",
      act_as_tab = true,
      act_as_shift_tab = true,
      default_tab = "<C-t>",
      default_shift_tab = "<C-d>",
      enable_backwards = true,
      completion = true,
      tabouts = {
        { open = "'", close = "'" },
        { open = '"', close = '"' },
        { open = "`", close = "`" },
        { open = "(", close = ")" },
        { open = "[", close = "]" },
        { open = "{", close = "}" },
      },
      ignore_beginning = true,
      exclude = {},
    })
  end,
  dependencies = {
    "nvim-treesitter/nvim-treesitter",
    "hrsh7th/nvim-cmp",
  },
}

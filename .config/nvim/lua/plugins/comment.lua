return {
  "numToStr/Comment.nvim",
  keys = {
    { "gc", mode = { "n", "v" }, desc = "Toggle comment linewise" },
    { "gb", mode = { "n", "v" }, desc = "Toggle comment blockwise" },
  },
  config = function()
    require("Comment").setup()
  end,
}
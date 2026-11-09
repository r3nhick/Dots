return {
  "barrettruth/live-server.nvim",
  cmd = { "LiveServerStart", "LiveServerToggle", "LiveServerStop" },
  init = function()
    vim.g.live_server = {
      port = 8080,
      browser = true,
    }
  end,
  config = function()
    vim.keymap.set("n", "<A-i>", ":LiveServerToggle<CR>", { desc = "Toggle Live Server" })
  end,
}
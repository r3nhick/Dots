-- vim-fugitive: Git-команди (:Git, :Gdiffsplit, blame, log тощо)
return {
  "tpope/vim-fugitive",
  cmd = {
    "Git",
    "G",
    "Gdiffsplit",
    "Gread",
    "Gwrite",
    "Ggrep",
    "GMove",
    "GRename",
    "GDelete",
    "GBrowse",
    "Gclog",
    "Gstatus",
  },
  keys = {
    { "<leader>gB", "<cmd>Git blame<CR>", desc = "Blame (fugitive)" },
    { "<leader>gL", "<cmd>Git log --oneline --graph --decorate<CR>", desc = "Git log" },
  },
}

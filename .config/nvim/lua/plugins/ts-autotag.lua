return {
  "windwp/nvim-ts-autotag",
  event = { "InsertEnter", "BufReadPre", "BufNewFile" },
  dependencies = { "nvim-treesitter/nvim-treesitter" },
  config = function()
    require("nvim-ts-autotag").setup()
    local autotag = require("nvim-ts-autotag.internal")
    vim.api.nvim_create_autocmd("FileType", {
      callback = function(args)
        autotag.attach(args.buf)
      end,
    })
    autotag.attach(vim.api.nvim_get_current_buf())
  end,
}
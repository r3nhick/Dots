return {
  "lewis6991/gitsigns.nvim",
  event = { "BufReadPre", "BufNewFile" },
  config = function()
    require("gitsigns").setup({
      on_attach = function(bufnr)
        local map = function(mode, l, r, opts)
          opts = opts or {}
          opts.buffer = bufnr
          vim.keymap.set(mode, l, r, opts)
        end

        map("n", "]c", function()
          if vim.wo.diff then
            return "]c"
          end
          vim.schedule(function()
            require("gitsigns").next_hunk()
          end)
          return "<Ignore>"
        end, { expr = true })

        map("n", "[c", function()
          if vim.wo.diff then
            return "[c"
          end
          vim.schedule(function()
            require("gitsigns").prev_hunk()
          end)
          return "<Ignore>"
        end, { expr = true })

        map("n", "<leader>hs", require("gitsigns").stage_hunk, { desc = "Stage hunk" })
        map("n", "<leader>hr", require("gitsigns").reset_hunk, { desc = "Reset hunk" })
        map("n", "<leader>hp", require("gitsigns").preview_hunk, { desc = "Preview hunk" })
        map("n", "<leader>hd", require("gitsigns").diffthis, { desc = "Diff this" })
      end,
    })
  end,
}
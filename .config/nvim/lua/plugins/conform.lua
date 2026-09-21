return {
  "stevearc/conform.nvim",
  cmd = "Format",
  opts = {
    notify_on_error = false,
    formatters_by_ft = {
      c = { "clang-format" },
      cpp = { "clang-format" },
      python = { "ruff_format" },
      javascript = { "prettier" },
      javascriptreact = { "prettier" },
      typescript = { "prettier" },
      typescriptreact = { "prettier" },
      css = { "prettier" },
      html = { "prettier" },
      lua = { "stylua" },
      bash = { "shfmt" },
      sh = { "shfmt" },
    },
  },
  config = function(_, opts)
    local conform = require("conform")
    conform.setup(opts)
    vim.api.nvim_create_user_command("Format", function(args)
      local range = nil
      if args.range > 0 then
        range = { start = args.line1, ["end"] = args.line2 }
      end
      conform.format({ range = range })
    end, { range = true, desc = "Format selection or buffer" })
  end,
}
return {
  "goolord/alpha-nvim",
  event = "VimEnter",
  dependencies = { "nvim-tree/nvim-web-devicons" },
  config = function()
    local alpha = require("alpha")
    local dashboard = require("alpha.themes.dashboard")

    -- cbonsai tree (github.com/jakobrees/cbonsai, seed 42) + vase
    dashboard.section.header.val = {
      "                                  ▒  ██ █",
      "                           █  █▒ █  █ /~/█",
      "                             ▒ █▒▒███▒",
      "         █    █ ▒               █▒█▒████",
      "        ▒\\|▒▒██▒█  █ ██  █  █▒ /~/██▒█▒██ ▒█     ██ ███",
      "     █  ▒/~ ▒/█ ▒   ▒▒█  \\|//~█  ▒ █▒▒▒▒▒_/ █ / _/██▒██",
      "      /▒█▒███/██ ▒ ███▒█  /|/   ██▒ ▒ ▒ █  / _/█  ▒",
      "     ███▒█▒ ▒█▒█▒▒▒ ▒▒██▒/▒           ▒",
      "      /~\\/_/▒ ██████▒██▒█▒█▒",
      "         _//~        ///~",
      "          /~/~|//~  //",
      "             //~/~//~",
      "                 //~/~",
      "           :___./~~~~~~\\.___:",
      "           \\________________/",
      "            (_)           (_)",
    }

    dashboard.section.buttons.val = {
      -- dashboard.button("f", "  Find file", ":Telescope find_files<CR>"),
      dashboard.button("w", "  Find sessions", ":SessionSearch<CR>"),
      dashboard.button("r", "  Recent files", ":Telescope oldfiles<CR>"),
      dashboard.button("s", "  Settings", ":e $MYVIMRC<CR>"),
      -- dashboard.button("q", "  Quit", ":qa<CR>"),
    }

    dashboard.section.header.opts.hl = "AlphaHeader"
    dashboard.section.buttons.opts.hl = "AlphaButtons"
    dashboard.section.footer.opts.hl = "AlphaFooter"

    -- Load serpantinum colors
    local colors_file = vim.fn.expand("~/.local/state/serpantinum/qs_colors.json")
    local serpantinum = {}
    if vim.fn.filereadable(colors_file) == 1 then
      local file = io.open(colors_file, "r")
      if file then
        local content = file:read("*all")
        file:close()
        serpantinum = vim.fn.json_decode(content) or {}
      end
    end

    local blue = serpantinum.blue or "#aad291"  -- Same as Neo-tree directory color
    local fg = serpantinum.text or "#e1e4d9"
    local grey = serpantinum.subtext1 or "#8d9286"

    vim.api.nvim_set_hl(0, "AlphaHeader", { fg = blue })
    vim.api.nvim_set_hl(0, "AlphaButtons", { fg = fg })
    vim.api.nvim_set_hl(0, "AlphaFooter", { fg = grey })

    dashboard.section.footer.val = function()
      local stats = require("lazy").stats()
      return "⚡ Neovim " .. vim.version().major .. "." .. vim.version().minor .. "." .. vim.version().patch
        .. "  |  " .. stats.loaded .. "/" .. stats.count .. " plugins"
    end

    alpha.setup(dashboard.config)
  end,
}

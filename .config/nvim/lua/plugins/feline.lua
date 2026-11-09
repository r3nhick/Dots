return {
  "famiu/feline.nvim",
  event = "VeryLazy",
  dependencies = { "nvim-lua/plenary.nvim", "nvim-tree/nvim-web-devicons" },
  config = function()
    local bo, fn = vim.bo, vim.fn

    local colors = {
      bg = "#1e1e1e",
      middle_bg = "#1e1e1e",
      line_bg = "#2e2e32",
      separator_bg = "#2e2e32",
      fg = "#abb2bf",
      dark_text = "#5c6370",
      error = "#e86671",
      warning = "#e5c07b",
      info = "#81a2be",
      hint = "#56b6c2",
      snippet = "#c678dd",
      git_add = "#98c379",
      git_change = "#e5c07b",
      git_remove = "#e86671",
      normal_mode = "#81a2be",
      insert_mode = "#98c379",
      visual_mode = "#e5c07b",
      command_mode = "#c678dd",
      replace_mode = "#e86671",
      terminal_mode = "#56b6c2",
      select_mode = "#e5c07b",
    }

    local function get_mode_color(mode)
      local map = {
        normal = colors.normal_mode,
        insert = colors.insert_mode,
        command = colors.command_mode,
        visual = colors.visual_mode,
        replace = colors.replace_mode,
        terminal = colors.terminal_mode,
        select = colors.select_mode,
      }
      return map[mode] or colors.normal_mode
    end

    local function mode_to_color()
      local mode = vim.api.nvim_get_mode().mode
      if mode:match("^i") then
        return colors.insert_mode
      elseif mode:match("^c") then
        return colors.command_mode
      elseif mode:match("^[vV\22]") then
        return colors.visual_mode
      elseif mode:match("^R") then
        return colors.replace_mode
      elseif mode == "t" then
        return colors.terminal_mode
      else
        return colors.normal_mode
      end
    end

    local function mode_colors()
      local gmc = get_mode_color
      return {
        NORMAL = gmc("normal"),
        OP = gmc("normal"),
        INSERT = gmc("insert"),
        COMMAND = gmc("command"),
        VISUAL = gmc("visual"),
        LINES = gmc("visual"),
        BLOCK = gmc("visual"),
        REPLACE = gmc("replace"),
        TERM = gmc("terminal"),
        ["V-REPLACE"] = gmc("replace"),
        SELECT = gmc("select"),
        ENTER = colors.info,
        MORE = colors.info,
        SHELL = colors.info,
        NONE = colors.info,
      }
    end

    local components = { active = { {}, {}, {} } }

    local modes = {
      ["n"] = "NORMAL",
      ["no"] = "  OP  ",
      ["nov"] = "  OP  ",
      ["noV"] = "  OP  ",
      ["no\22"] = "  OP  ",
      ["niI"] = "NORMAL",
      ["niR"] = "NORMAL",
      ["niV"] = "NORMAL",
      ["v"] = "VISUAL",
      ["V"] = "LINES ",
      ["\22"] = "BLOCK ",
      ["s"] = "SELECT",
      ["S"] = "SELECT",
      ["\19"] = "BLOCK ",
      ["i"] = "INSERT",
      ["ic"] = "INSERT",
      ["ix"] = "INSERT",
      ["R"] = "REPLACE",
      ["Rc"] = "REPLACE",
      ["Rv"] = "V-REPLACE",
      ["Rx"] = "REPLACE",
      ["c"] = "COMMAND",
      ["cv"] = "COMMAND",
      ["ce"] = "COMMAND",
      ["r"] = "ENTER ",
      ["rm"] = " MORE ",
      ["r?"] = "CONFIRM",
      ["!"] = "SHELL ",
      ["t"] = " TERM ",
      ["nt"] = " TERM ",
      ["null"] = " NONE ",
    }

    local left_sect = {
      left_sep = { str = "", hl = { fg = "line_bg", bg = "separator_bg" } },
      right_sep = { str = "", hl = { fg = "line_bg", bg = "separator_bg" } },
    }
    local right_sect = {
      left_sep = { str = "", hl = { fg = "line_bg", bg = "separator_bg" } },
      right_sep = { str = "", hl = { fg = "line_bg", bg = "separator_bg" } },
    }

    local function has_file_type()
      local f_type = vim.bo.filetype
      return not not (f_type and f_type ~= "")
    end

    local function get_working_dir(shorten)
      local path = fn.fnamemodify(fn.getcwd(), ":~")
      if shorten == true then
        return fn.pathshorten(path)
      else
        return path
      end
    end

    local function get_icon_full()
      local has_devicons, devicons = pcall(require, "nvim-web-devicons")
      if has_devicons then
        local icon, iconhl = devicons.get_icon(fn.expand("%:t"), fn.expand("%:e"))
        if icon ~= nil then
          return icon, vim.fn.synIDattr(vim.fn.hlID(iconhl), "fg")
        end
      end
    end

    local function get_icon(padding)
      local icon = select(1, get_icon_full()) or ""
      if not padding then
        return icon
      else
        return icon .. " "
      end
    end

    local function get_icon_hl()
      return select(2, get_icon_full())
    end

    local function file_osinfo()
      local os = vim.bo.fileformat
      local icon
      if os == "unix" then
        icon = " 󰌽 "
      elseif os == "mac" then
        icon = " 󰀵 "
      else
        icon = " 󰍲 "
      end
      return icon .. os
    end

    local active_left = components.active[1]
    local active_mid = components.active[2]
    local active_right = components.active[3]

    table.insert(active_left, {
      provider = function()
        return " " .. (modes[vim.api.nvim_get_mode().mode] or "NORMAL") .. " "
      end,
      hl = function()
        return { fg = "middle_bg", bg = mode_to_color(), style = "bold" }
      end,
      priority = 10,
    })

    table.insert(active_left, {
      provider = "󰌋 ",
      hl = { bg = "line_bg" },
      enabled = function()
        return bo.readonly and bo.buftype ~= "help"
      end,
      truncate_hide = true,
      priority = 7,
    })

    table.insert(active_left, {
      provider = get_working_dir,
      short_provider = function()
        return get_working_dir(true)
      end,
      hl = function()
        return { fg = mode_to_color(), bg = "line_bg" }
      end,
      left_sep = "█",
      right_sep = { str = "", hl = { fg = "line_bg", bg = "separator_bg" } },
      icon = "󰉋 ",
      truncate_hide = true,
      priority = 9,
    })

    table.insert(active_left, {
      provider = function()
        if vim.v.hlsearch == 0 then return "" end
        local res = vim.fn.searchcount({ maxcount = 999, timeout = 250 })
        if res.total == 0 then return "not found" end
        return ("%d/%d"):format(res.current, math.min(res.total, res.maxcount))
      end,
      icon = {
        str = "󰍉 ",
        hl = function()
          return { fg = mode_to_color() }
        end,
      },
      hl = { bg = "line_bg" },
      left_sep = left_sect.left_sep,
      right_sep = left_sect.right_sep,
    })

    table.insert(active_left, {
      provider = left_sect.left_sep.str,
      hl = { fg = "middle_bg", bg = "separator_bg" },
    })

    local function lsp_servers()
      local client_names = vim.tbl_map(function(client)
        return client.name
      end, vim.lsp.get_clients({ bufnr = 0 }))
      return table.concat(client_names, " | ")
    end

    table.insert(active_left, {
      provider = lsp_servers,
      left_sep = " ",
      hl = { fg = "dark_text" },
      enabled = function()
        return next(vim.lsp.get_clients()) ~= nil
      end,
      icon = {
        str = "󰌠 ",
        hl = { fg = mode_to_color() },
      },
      truncate_hide = true,
      priority = -1,
    })

    table.insert(active_left, { provider = "diagnostic_errors", hl = { fg = "error" } })
    table.insert(active_left, { provider = "diagnostic_warnings", hl = { fg = "warning" } })
    table.insert(active_left, { provider = "diagnostic_info", hl = { fg = "info" } })
    table.insert(active_left, { provider = "diagnostic_hints", hl = { fg = "hint" } })

    table.insert(active_mid, {
      provider = "snippet",
      hl = { fg = "dark_text" },
      enabled = function()
        local ok = package.loaded["luasnip"] ~= nil
        return ok and require("luasnip").in_snippet()
      end,
      icon = {
        str = "󰩫 ",
        hl = { fg = "snippet" },
      },
    })

    table.insert(active_right, { provider = "git_diff_added", hl = { fg = "git_add" }, truncate_hide = true })
    table.insert(active_right, {
      provider = "git_diff_changed",
      icon = " 󰠕 ",
      hl = { fg = "git_change" },
      truncate_hide = true,
    })
    table.insert(active_right, {
      provider = "git_diff_removed",
      hl = { fg = "git_remove" },
      right_sep = "",
      truncate_hide = true,
    })

    table.insert(active_right, {
      use_default_icon = false,
      provider = "git_branch",
      right_sep = " ",
      enabled = "git_info_exists",
      icon = {
        str = "  ",
        hl = { fg = "#f34f29" },
      },
      truncate_hide = true,
      priority = 2,
    })

    table.insert(active_right, {
      provider = right_sect.right_sep.str,
      hl = { fg = "middle_bg", bg = "separator_bg" },
    })

    table.insert(active_right, {
      provider = function()
        return " " .. bo.filetype
      end,
      left_sep = right_sect.left_sep,
      right_sep = right_sect.right_sep,
      hl = { bg = "line_bg" },
      enabled = has_file_type,
      icon = function()
        return {
          str = get_icon(),
          hl = { fg = get_icon_hl(), bg = "line_bg" },
          always_visible = true,
        }
      end,
      truncate_hide = true,
      priority = 1,
    })

    table.insert(active_right, {
      provider = file_osinfo,
      hl = { bg = "line_bg" },
      left_sep = right_sect.left_sep,
      right_sep = right_sect.right_sep,
      truncate_hide = true,
      priority = -1,
    })

    table.insert(active_right, {
      provider = "file_encoding",
      hl = { bg = "line_bg" },
      left_sep = right_sect.left_sep,
      right_sep = right_sect.right_sep,
      truncate_hide = true,
      priority = -1,
      enabled = function()
        return bo.fenc ~= "utf-8"
      end,
    })

    table.insert(active_right, {
      provider = function()
        return fn.strftime("%H:%M")
      end,
      hl = { bg = "line_bg" },
      left_sep = right_sect.left_sep,
      right_sep = right_sect.right_sep,
      icon = {
        str = " ",
        hl = { fg = mode_to_color(), bg = "line_bg" },
      },
      truncate_hide = true,
    })

    table.insert(active_right, {
      provider = function()
        return ("%2d:%-2d"):format(fn.line("."), fn.col("."))
      end,
      short_provider = function()
        return ("%d:%-d"):format(fn.line("."), fn.col("."))
      end,
      left_sep = function()
        return { str = right_sect.left_sep.str, hl = { fg = mode_to_color(), bg = "separator_bg" } }
      end,
      right_sep = function()
        return { str = "█", hl = { fg = mode_to_color(), bg = "separator_bg" } }
      end,
      hl = function()
        return { fg = "line_bg", bg = mode_to_color(), style = "bold" }
      end,
      icon = " ",
      priority = 9,
    })

    local theme = vim.deepcopy(colors)
    theme.bg = theme.middle_bg
    vim.opt.laststatus = 3

    require("feline").setup({
      theme = theme,
      components = components,
      vi_mode_colors = mode_colors(),
      force_inactive = {},
      global_statusline = true,
    })
  end,
}
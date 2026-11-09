return {
  "folke/todo-comments.nvim",
  dependencies = { "nvim-lua/plenary.nvim" },
  event = { "BufReadPost", "BufNewFile" },
  opts = {
    -- Показувати іконки в колонці знаків
    signs = true,
    -- Ключові слова, які підсвічуються
    keywords = {
      FIX = { icon = " ", color = "error", alt = { "FIXME", "BUG", "FIXIT", "ISSUE" } },
      TODO = { icon = " ", color = "info" },
      HACK = { icon = " ", color = "warning" },
      WARN = { icon = " ", color = "warning", alt = { "WARNING", "XXX" } },
      PERF = { icon = " ", alt = { "OPTIM", "PERFORMANCE", "OPTIMIZE" } },
      NOTE = { icon = " ", color = "hint", alt = { "INFO" } },
      TEST = { icon = "⏲ ", color = "test", alt = { "TESTING", "PASSED", "FAILED" } },
    },
  },
  keys = {
    {
      "<leader>ft",
      function()
        -- Пошук TODO лише в поточному буфері
        local Config = require("todo-comments.config")
        local Highlight = require("todo-comments.highlight")

        local bufnr = vim.api.nvim_get_current_buf()
        local filename = vim.api.nvim_buf_get_name(bufnr)
        local lines = vim.api.nvim_buf_get_lines(bufnr, 0, -1, false)

        local results = {}
        for lnum, line in ipairs(lines) do
          local start, _, raw = Highlight.match(line)
          if start then
            local kw = Config.keywords[raw] or raw
            table.insert(results, {
              lnum = lnum,
              col = start - 1,
              text = line,
              kw = kw,
            })
          end
        end

        if #results == 0 then
          vim.notify("Немає TODO/FIXME у поточному файлі", vim.log.levels.INFO)
          return
        end

        local pickers = require("telescope.pickers")
        local finders = require("telescope.finders")
        local conf = require("telescope.config").values
        local actions = require("telescope.actions")
        local action_state = require("telescope.actions.state")

        pickers.new({}, {
          prompt_title = "Find Todo (поточний файл)",
          finder = finders.new_table({
            results = results,
            entry_maker = function(item)
              local kw_opts = Config.options.keywords[item.kw] or {}
              local icon = kw_opts.icon or " "
              return {
                value = item,
                filename = filename,
                lnum = item.lnum,
                col = item.col,
                bufnr = bufnr,
                display = string.format("%s %4d  %s", icon, item.lnum, vim.trim(item.text)),
                ordinal = item.text,
              }
            end,
          }),
          sorter = conf.generic_sorter({}),
          previewer = conf.grep_previewer({}),
          attach_mappings = function(prompt_bufnr)
            actions.select_default:replace(function()
              local selection = action_state.get_selected_entry()
              actions.close(prompt_bufnr)
              if selection then
                vim.api.nvim_win_set_cursor(0, { selection.lnum, math.max(selection.col, 0) })
                vim.cmd("normal! zz")
              end
            end)
            return true
          end,
        }):find()
      end,
      desc = "Find TODOs (current file)",
    },
  },
}

-- nvim-surround v4: бінди задаються через <Plug>-мапінги, а не через setup({keymaps=...})
return {
  "kylechui/nvim-surround",
  version = "*",
  event = "VeryLazy",
  init = function()
    -- Вимкнути ВСІ стандартні бінди (ys/ds/cs/S/<C-g>s...) — використовуємо <leader>y
    vim.g.nvim_surround_no_normal_mappings = true
    vim.g.nvim_surround_no_visual_mappings = true
    vim.g.nvim_surround_no_insert_mappings = true
  end,
  config = function()
    require("nvim-surround").setup({})
    local map = vim.keymap.set

    -- ─── Normal mode ───
    -- Додати оточення навколо руху (motion)
    map("n", "<leader>ya", "<Plug>(nvim-surround-normal)", { desc = "Add surround (motion)" })
    -- Додати оточення навколо поточного рядка
    map("n", "<leader>yaa", "<Plug>(nvim-surround-normal-cur)", { desc = "Add surround (current line)" })
    -- Додати оточення навколо руху, на нових лініях
    map("n", "<leader>yA", "<Plug>(nvim-surround-normal-line)", { desc = "Add surround (motion, new lines)" })
    -- Додати оточення навколо поточного рядка, на нових лініях
    map("n", "<leader>yAA", "<Plug>(nvim-surround-normal-cur-line)", { desc = "Add surround (current line, new lines)" })
    -- Видалити оточення
    map("n", "<leader>yd", "<Plug>(nvim-surround-delete)", { desc = "Delete surround" })
    -- Змінити оточення
    map("n", "<leader>yc", "<Plug>(nvim-surround-change)", { desc = "Change surround" })
    -- Змінити оточення, з новими лініями
    map("n", "<leader>yC", "<Plug>(nvim-surround-change-line)", { desc = "Change surround (new lines)" })

    -- ─── Visual mode ───
    -- Оточити виділене
    map("x", "<leader>y", "<Plug>(nvim-surround-visual)", { desc = "Add surround (selection)" })
    -- Оточити виділені рядки (з новими лініями)
    map("x", "<leader>Y", "<Plug>(nvim-surround-visual-line)", { desc = "Add surround (selection, new lines)" })

    -- ─── Insert mode ───
    -- Оточити навколо курсора
    map("i", "<leader>yi", "<Plug>(nvim-surround-insert)", { desc = "Add surround around cursor" })
    -- Оточити навколо курсора, на нових лініях
    map("i", "<leader>yI", "<Plug>(nvim-surround-insert-line)", { desc = "Add surround around cursor (new lines)" })
  end,
}

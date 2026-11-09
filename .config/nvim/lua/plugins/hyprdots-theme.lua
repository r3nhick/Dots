-- Колірна схема з hyprdots-0 (base16 + matugen)
-- Для активації: :colorscheme hyprdots або через <leader>tC

return {
  {
    "RRethy/base16-nvim",
    lazy = false,
    priority = 1000,
    config = function()
      -- Реєструємо кастомну colorscheme
      vim.api.nvim_create_user_command("ColorschemeHyprdots", function()
        require('base16-colorscheme').setup({
          base00 = '#2e3440', -- bg
          base01 = '#3b4252', -- bg_alt
          base02 = '#444c5e', -- selection
          base03 = '#727d94', -- comments
          base04 = '#d8dee9', -- fg_alt
          base05 = '#eceff4', -- fg
          base06 = '#eceff4', -- fg_bright
          base07 = '#eceff4', -- fg_brighter
          base08 = '#bf616a', -- red
          base09 = '#5e81ac', -- orange
          base0A = '#88c0d0', -- yellow
          base0B = '#8fbcbb', -- green
          base0C = '#96bbe9', -- cyan
          base0D = '#96e9e7', -- blue
          base0E = '#96d6e9', -- purple
          base0F = '#bee8f4', -- accent
        })

        local hi = function(group, opts)
          vim.api.nvim_set_hl(0, group, opts)
        end

        -- Telescope highlights
        hi('TelescopeNormal',         { fg = '#eceff4', bg = '#2e3440' })
        hi('TelescopeBorder',         { fg = '#727d94', bg = '#2e3440' })
        hi('TelescopePromptNormal',   { fg = '#eceff4', bg = '#2e3440' })
        hi('TelescopePromptBorder',   { fg = '#727d94', bg = '#2e3440' })
        hi('TelescopePromptPrefix',   { fg = '#8fbcbb', bg = '#2e3440' })
        hi('TelescopePromptCounter',  { fg = '#d8dee9', bg = '#2e3440' })
        hi('TelescopePromptTitle',    { fg = '#2e3440', bg = '#8fbcbb' })
        hi('TelescopePreviewTitle',   { fg = '#2e3440', bg = '#88c0d0' })
        hi('TelescopeResultsTitle',   { fg = '#2e3440', bg = '#5e81ac' })
        hi('TelescopeSelection',      { fg = '#eceff4', bg = '#444c5e' })
        hi('TelescopeSelectionCaret', { fg = '#8fbcbb', bg = '#444c5e' })
        hi('TelescopeMatching',       { fg = '#8fbcbb', bold = true })

        -- Neo-tree highlights
        hi('NeoTreeNormal',           { fg = '#eceff4', bg = '#2e3440' })
        hi('NeoTreeCursorLine',       { bg = '#444c5e' })
        hi('NeoTreeFloatBorder',      { fg = '#96e9e7', bg = '#2e3440' })
        hi('NeoTreeDirectoryIcon',    { fg = '#96e9e7' })
        hi('NeoTreeDirectoryName',    { fg = '#96e9e7' })
        hi('NeoTreeGitAdded',         { fg = '#8fbcbb' })
        hi('NeoTreeGitModified',      { fg = '#88c0d0' })
        hi('NeoTreeGitDeleted',       { fg = '#bf616a' })

        -- CMP highlights
        hi('CmpItemAbbrMatch',        { fg = '#96bbe9' })
        hi('CmpItemAbbrMatchFuzzy',   { fg = '#96bbe9' })
        hi('CmpItemKindFunction',     { fg = '#96e9e7' })
        hi('CmpItemKindMethod',       { fg = '#96e9e7' })

        vim.g.colors_name = "hyprdots"
      end, {})

      -- Додаємо як доступну colorscheme
      vim.api.nvim_create_autocmd("ColorSchemePre", {
        pattern = "hyprdots",
        callback = function()
          vim.cmd("ColorschemeHyprdots")
        end,
      })
    end,
  },
}

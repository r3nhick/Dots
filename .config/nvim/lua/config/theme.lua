-- Перемикання тем: запам'ятовує вибір і відновлює його при старті
-- Пікер: <leader>tC (Telescope colorscheme з живим попереднім переглядом)
local M = {}

M.state_file = vim.fn.stdpath("state") .. "/theme"

-- Записати вибрану тему (кожного разу, коли тема застосовується через :colorscheme)
vim.api.nvim_create_autocmd("ColorScheme", {
  callback = function()
    local name = vim.g.colors_name
    if name and #name > 0 then
      pcall(vim.fn.writefile, { name }, M.state_file)
    end
  end,
})

local function restore()
  local ok, saved = pcall(function() return vim.fn.readfile(M.state_file)[1] end)
  if not ok or not saved or #saved == 0 or saved == vim.g.colors_name then
    return
  end
  pcall(vim.cmd.colorscheme, saved)
end

-- Відновити тему одразу після старту
vim.schedule(restore)
-- страхувальний спуск, якщо при старті тема ще не була готова
vim.api.nvim_create_autocmd("VimEnter", { callback = restore })

return M

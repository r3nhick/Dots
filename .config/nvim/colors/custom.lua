-- Реєструє serpantinum-тему как кольорову схему (:colorscheme custom, з пікера тем <leader>tC)
-- При перемиканні з іншої теми прибирає її сліди
local switch = vim.g.colors_name ~= nil and vim.g.colors_name ~= "custom"
if switch then
  vim.cmd("hi clear")
  for i = 0, 15 do
    pcall(function() vim.api.nvim_del_var("terminal_color_" .. i) end)
  end
end
-- Скинути кеш модуля, інакше повторний require нічого не виконає
package.loaded["config.colorscheme"] = nil
require("config.colorscheme")

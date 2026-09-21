local augroup = vim.api.nvim_create_augroup("UserConfig", { clear = true })

vim.api.nvim_create_autocmd("FileType", {
  group = augroup,
  pattern = { "c", "cpp", "make" },
  callback = function()
    vim.opt_local.expandtab = false
    vim.opt_local.tabstop = 8
    vim.opt_local.shiftwidth = 8
  end,
})

local function trim_trailing_whitespace()
  local save = vim.fn.winsaveview()
  vim.cmd([[keepjumps keeppatterns %s/\s\+$//e]])
  vim.fn.winrestview(save)
end

vim.api.nvim_create_autocmd("BufWritePre", {
  group = augroup,
  pattern = "*",
  callback = function()
    local ft = vim.bo.filetype
    if ft == "gitcommit" or ft == "" then
      return
    end
    trim_trailing_whitespace()
  end,
})
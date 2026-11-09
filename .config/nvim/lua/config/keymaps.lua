local map = vim.keymap.set

local function arrow_hint()
  vim.notify(" Стрілки вимкнені — використовуй h / j / k / l", vim.log.levels.WARN)
end

for _, key in ipairs({ "Up", "Down", "Left", "Right" }) do
  map({ "n", "v", "i" }, "<" .. key .. ">", arrow_hint, { desc = "Arrow " .. key .. " disabled" })
end

map("n", "<C-s>", "<cmd>w<CR>", { desc = "Save file" })
map("n", "<leader>q", "<cmd>q<CR>", { desc = "Quit" })

map("n", "<C-h>", "<C-w>h", { desc = "Go to left window" })
map("n", "<C-j>", "<C-w>j", { desc = "Go to lower window" })
map("n", "<C-k>", "<C-w>k", { desc = "Go to upper window" })
map("n", "<C-l>", "<C-w>l", { desc = "Go to right window" })

map("n", "<C-Up>", "<cmd>resize +2<CR>", { desc = "Increase window height" })
map("n", "<C-Down>", "<cmd>resize -2<CR>", { desc = "Decrease window height" })
map("n", "<C-Left>", "<cmd>vertical resize -2<CR>", { desc = "Decrease window width" })
map("n", "<C-Right>", "<cmd>vertical resize +2<CR>", { desc = "Increase window width" })

map("v", "<A-j>", ":m '>+1<CR>gv=gv", { desc = "Move selection down" })
map("v", "<A-k>", ":m '<-2<CR>gv=gv", { desc = "Move selection up" })

map("n", "<leader>bn", "<cmd>enew<CR>", { desc = "New buffer" })
map("n", "<leader>bd", "<cmd>bd<CR>", { desc = "Delete buffer" })
map("n", "<leader>bl", "<cmd>ls<CR>", { desc = "List buffers" })

map("n", "<Tab>", ">>", { desc = "Indent line" })
map("n", "<S-Tab>", "<<", { desc = "Outdent line" })
map("v", "<Tab>", ">gv", { desc = "Indent selection" })
map("v", "<S-Tab>", "<gv", { desc = "Outdent selection" })

map("n", "<leader>]", function() require("nvchad.tabufline").next() end, { desc = "Next buffer" })
map("n", "<leader>[", function() require("nvchad.tabufline").prev() end, { desc = "Prev buffer" })
map("n", "<leader>bc", function() require("nvchad.tabufline").close_buffer() end, { desc = "Close buffer" })

-- Simple comment toggle function
local function toggle_comment()
  local commentstring = vim.bo.commentstring
  if commentstring == "" then
    vim.notify("No commentstring set for this filetype", vim.log.levels.WARN)
    return
  end
  
  local line = vim.api.nvim_get_current_line()
  local comment_pattern = commentstring:gsub("%%s", ".*")
  comment_pattern = vim.pesc(comment_pattern:match("^%s*(.-)%s*$"))
  
  -- Extract comment prefix (e.g., "#" from "# %s")
  local prefix = commentstring:match("^(.-)%%s"):match("^%s*(.-)%s*$")
  
  if line:match("^%s*" .. vim.pesc(prefix)) then
    -- Uncomment: remove comment prefix
    local new_line = line:gsub("^(%s*)" .. vim.pesc(prefix) .. "%s?", "%1")
    vim.api.nvim_set_current_line(new_line)
  else
    -- Comment: add comment prefix
    local indent = line:match("^%s*")
    local content = line:match("^%s*(.*)$")
    vim.api.nvim_set_current_line(indent .. prefix .. " " .. content)
  end
end

local function toggle_comment_visual()
  local start_line = vim.fn.line("'<")
  local end_line = vim.fn.line("'>")
  
  local commentstring = vim.bo.commentstring
  if commentstring == "" then
    vim.notify("No commentstring set for this filetype", vim.log.levels.WARN)
    return
  end
  
  local prefix = commentstring:match("^(.-)%%s"):match("^%s*(.-)%s*$")
  
  -- Check if all selected lines are commented
  local all_commented = true
  for line_num = start_line, end_line do
    local line = vim.api.nvim_buf_get_lines(0, line_num - 1, line_num, false)[1]
    if not line:match("^%s*" .. vim.pesc(prefix)) then
      all_commented = false
      break
    end
  end
  
  -- Toggle comments
  for line_num = start_line, end_line do
    local line = vim.api.nvim_buf_get_lines(0, line_num - 1, line_num, false)[1]
    local new_line
    
    if all_commented then
      -- Uncomment
      new_line = line:gsub("^(%s*)" .. vim.pesc(prefix) .. "%s?", "%1")
    else
      -- Comment
      local indent = line:match("^%s*")
      local content = line:match("^%s*(.*)$")
      new_line = indent .. prefix .. " " .. content
    end
    
    vim.api.nvim_buf_set_lines(0, line_num - 1, line_num, false, { new_line })
  end
end

map("n", "<leader>/", toggle_comment, { desc = "Toggle comment" })
map("v", "<leader>/", toggle_comment_visual, { desc = "Toggle comment" })

-- Toggle Tabout
-- (bind <leader>k видалено)

-- Show which-key menu
vim.keymap.set("n", "<leader>tw", function()
  require("which-key").show()
end, { desc = "Show which-key" })

-- Toggle screenkey
vim.keymap.set("n", "<leader>ts", function()
  require("screenkey").toggle()
  
  -- Зберегти стан screenkey
  local state_file = vim.fn.stdpath("data") .. "/screenkey_state.txt"
  local current_state = vim.fn.filereadable(state_file) == 1 and vim.fn.readfile(state_file)[1] or "off"
  local new_state = current_state == "on" and "off" or "on"
  vim.fn.writefile({ new_state }, state_file)
end, { desc = "Toggle screenkey" })

-- Перемикач тем (Telescope colorscheme, живий попередній перегляд)
map("n", "<leader>tC", function()
  require("lazy").load({ plugins = { "telescope.nvim" } })
  require("telescope.builtin").colorscheme({ enable_preview = true })
end, { desc = "Тема" })

-- Session management
map("n", "<leader>ss", "<cmd>SessionSave<CR>", { desc = "Save session" })
map("n", "<leader>sr", "<cmd>SessionRestore<CR>", { desc = "Restore session" })
map("n", "<leader>sd", "<cmd>SessionDelete<CR>", { desc = "Delete session" })
map("n", "<leader>sf", "<cmd>SessionSearch<CR>", { desc = "Search sessions" })

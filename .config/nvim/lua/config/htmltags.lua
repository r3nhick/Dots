local M = {}

local TAGS = {
  "a", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "blockquote",
  "body", "br", "button", "caption", "cite", "code", "col", "colgroup", "data",
  "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "fieldset",
  "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6",
  "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins",
  "kbd", "label", "legend", "li", "link", "main", "map", "mark", "menu", "meta",
  "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section",
  "select", "small", "source", "span", "strong", "style", "sub", "summary", "sup",
  "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time",
  "title", "tr", "track", "u", "ul", "var", "video", "wbr",
}

local function load_snippets()
  local ok, ls = pcall(require, "luasnip")
  if not ok then
    return
  end
  if _G.__html_tag_snippets_loaded then
    return
  end
  _G.__html_tag_snippets_loaded = true

  local snips = {}
  for _, tag in ipairs(TAGS) do
    snips[#snips + 1] = ls.snippet(tag, {
      ls.text_node("<" .. tag .. ">"),
      ls.insert_node(1),
      ls.text_node("</" .. tag .. ">"),
    })
  end
  ls.add_snippets("html", snips)
end

M.setup = function()
  vim.api.nvim_create_autocmd("FileType", {
    pattern = "html",
    callback = load_snippets,
  })
  load_snippets()
end

function M.get_bare_word_before_cursor()
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]
  local before = line:sub(1, col)
  local word = before:match("([%w-]+)$")
  if not word or word == "" then
    return nil
  end
  local char_before_word = before:sub(col - #word, col - #word)
  if char_before_word == "<" then
    return nil
  end
  return word
end

local HTML_SKELETON = table.concat({
  "<!DOCTYPE html>",
  '<html lang="uk">',
  "<head>",
  "  <meta charset=\"UTF-8\">",
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  "  <title></title>",
  "</head>",
  "<body>",
  "",
  "</body>",
  "</html>",
}, "\n")

function M.expand_html_skeleton()
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]
  if not line:sub(1, col):match("^%s*!$") then
    return false
  end
  vim.api.nvim_buf_set_text(0, 0, 0, 0, 1, vim.split(HTML_SKELETON, "\n"))
  vim.api.nvim_win_set_cursor(0, { 4, 9 })
  return true
end

function M.expand_tag()
  local word = M.get_bare_word_before_cursor()
  if not word then
    return false
  end
  local line = vim.api.nvim_get_current_line()
  local col = vim.api.nvim_win_get_cursor(0)[2]
  vim.api.nvim_buf_set_text(0, 0, col - #word, 0, col, {
    "<" .. word .. "></" .. word .. ">",
  })
  vim.api.nvim_win_set_cursor(0, { 1, col + #word + 2 })
  return true
end

return M
return {
  "echasnovski/mini.animate",
  event = "VeryLazy",
  config = function()
    local animate = require("mini.animate")
    
    animate.setup({
      -- Cursor path animation
      cursor = {
        enable = true,
        timing = animate.gen_timing.linear({ duration = 50, unit = "total" }),
        path = animate.gen_path.line(),
      },
      
      -- Scroll: вимкнено, щоб не блокувати скрол мишкою
      scroll = {
        enable = false,
      },
      
      -- Window resize animation
      resize = {
        enable = true,
        timing = animate.gen_timing.linear({ duration = 50, unit = "total" }),
        subresize = animate.gen_subresize.equal({ predicate = function() return true end }),
      },
      
      -- Window open/close animation
      open = {
        enable = true,
        timing = animate.gen_timing.linear({ duration = 150, unit = "total" }),
        winconfig = animate.gen_winconfig.wipe({ direction = "from_edge" }),
      },
      
      close = {
        enable = true,
        timing = animate.gen_timing.linear({ duration = 150, unit = "total" }),
        winconfig = animate.gen_winconfig.wipe({ direction = "to_edge" }),
      },
    })
  end,
}

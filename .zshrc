# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
# if [[ -o interactive ]]; then
# #  fastfetch
# #fi
if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

# ==============================
# Oh My Zsh
# ==============================
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"  # тема Powerlevel10k


# ==============================
# Zinit
# ==============================
ZINIT_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/zinit/zinit.git"
if [[ ! -d "$ZINIT_HOME" ]]; then
    mkdir -p "$(dirname "$ZINIT_HOME")"
    git clone https://github.com/zdharma-continuum/zinit.git "$ZINIT_HOME"
fi
source "$ZINIT_HOME/zinit.zsh"
PATH="$HOME/bin:$HOME/.local/bin:$PATH"

# ==============================
# Powerlevel10k via Zinit (швидке завантаження)
# ==============================
zinit ice depth=1
zinit light romkatv/powerlevel10k

# ==============================
# Плагіни
# ==============================
zinit light zsh-users/zsh-syntax-highlighting
zinit light zsh-users/zsh-completions
zinit light zsh-users/zsh-autosuggestions

# Oh My Zsh snippets
zinit snippet OMZP::git
zinit snippet OMZP::sudo
zinit snippet OMZP::archlinux
zinit snippet OMZP::aws
zinit snippet OMZP::kubectl
zinit snippet OMZP::kubectx
zinit snippet OMZP::command-not-found

# ==============================
# Completions (FAST)
# ==============================
autoload -Uz compinit
compinit -d "${XDG_CACHE_HOME:-$HOME/.cache}/zcompdump"
zinit cdreplay -q

# ==============================
# Keybindings
# ==============================
bindkey -e
bindkey '^p' history-search-backward
bindkey '^n' history-search-forward
bindkey '^[w' kill-region

# Alt + → / ← — рух по словах
bindkey "^[[1;3C" forward-word   # Alt + →
bindkey "^[[1;3D" backward-word  # Alt + ←

# Alt+N — fzf file finder → nvim з preview
_fzf_file_nvim() {
  local file=$(find . -maxdepth 5 -type f 2>/dev/null | fzf \
    --height=80% \
    --layout=reverse \
    --border=rounded \
    --preview-window='right,60%,border-rounded' \
    --preview='
      if command -v bat &>/dev/null; then
        bat --color=always --style=numbers --line-range=:200 {} 2>/dev/null
      else
        head -200 {} 2>/dev/null
      fi
    ' \
    --prompt="nvim ▸ ")
  if [[ -n "$file" ]]; then
    nvim "$file"
  fi
}
zle -N _fzf_file_nvim
bindkey '^[n' _fzf_file_nvim

# Alt+C — cd з tree preview (включно з прихованими)
_fm_cd_widget() {
  local result
  # Використати fd якщо доступний, інакше find
  if command -v fd &>/dev/null; then
    result=$(fd -H -t d -d 3 . 2>/dev/null | fzf \
      --height=80% \
      --layout=reverse \
      --border=rounded \
      --preview-window='right,60%,border-rounded' \
      --preview='
        if command -v eza &>/dev/null; then
          eza --tree -L2 -a --icons=always --color=always --no-quotes {} 2>/dev/null | head -200
        else
          ls -la {} 2>/dev/null | head -200
        fi
      ' \
      --prompt="cd ▸ ")
  else
    result=$(find . -maxdepth 3 -type d 2>/dev/null | fzf \
      --height=80% \
      --layout=reverse \
      --border=rounded \
      --preview-window='right,60%,border-rounded' \
      --preview='
        if command -v eza &>/dev/null; then
          eza --tree -L2 -a --icons=always --color=always --no-quotes {} 2>/dev/null | head -200
        else
          ls -la {} 2>/dev/null | head -200
        fi
      ' \
      --prompt="cd ▸ ")
  fi

  if [[ -n "$result" && -d "$result" ]]; then
    cd "$result"
    zle reset-prompt
  fi
}
zle -N _fm_cd_widget
bindkey '^[c' _fm_cd_widget

# fzf-tab — після bindkey
zinit light Aloxaf/fzf-tab

# ==============================
# Powerlevel10k конфіг
# ==============================
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# ==============================
# History
# ==============================
HISTSIZE=10000
SAVEHIST=10000
HISTFILE=~/.zsh_history

setopt appendhistory
setopt sharehistory
setopt hist_ignore_space
setopt hist_ignore_all_dups
setopt hist_save_no_dups
setopt hist_ignore_dups
setopt hist_find_no_dups

# ==============================
# Completion styling
# ==============================
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Za-z}'
zstyle ':completion:*' list-colors "${(s.:.)LS_COLORS}"
zstyle ':completion:*' menu select

# compdef для команд без zsh-completions
compdef _files nvim
compdef _files nano
compdef _files vim
compdef _files cat
compdef _files bat

# ==============================
# fzf-tab з розширеним прев'ю
# ==============================
zstyle ':fzf-tab:*' fzf-flags --height=80% --layout=reverse --border=rounded --preview-window='right,50%,border-rounded'
zstyle ':fzf-tab:*' prefix ''

#
# # Збереження останньої команди
_store_last_cmd() {
  LAST_HIST_CMD="$1"
}

# Очищення Kitty зображень з виключенням для fastfetch
_cleanup_kitty_images() {
  if [[ "$LAST_HIST_CMD" == *"fastfetch"* ]]; then
    return 0
  fi
  printf '\e_Ga=d,d=A\e\\' 2>/dev/null >/dev/tty
}

autoload -Uz add-zsh-hook
add-zsh-hook preexec _store_last_cmd
# add-zsh-hook preexec _cleanup_kitty_images
add-zsh-hook precmd _cleanup_kitty_images

# Очищення при Ctrl+C (SIGINT)
TRAPINT() {
  _cleanup_kitty_images
  return 130
}

# Очищення при натисканні Enter
_accept_line_with_cleanup() {
  _cleanup_kitty_images
  zle .accept-line
}
zle -N accept-line _accept_line_with_cleanup

# Функція для розширеного прев'ю файлів (на основі fm)
_fzf_preview_file() {
  local f="$1"
  local mime kind

  # Якщо файл не існує
  [[ -z "$f" || ! -e "$f" ]] && return 0

  # Директорія - показати тільки tree структуру (як в fm)
  if [[ -d "$f" ]]; then
    if command -v eza &>/dev/null; then
      eza --tree -L2 --icons=always --color=always --no-quotes -- "$f" 2>/dev/null | head -200
    else
      ls -la -- "$f" | head -200
    fi
    return 0
  fi

  # Отримати MIME тип та encoding
  mime=$(file --mime-type -b -- "$f" 2>/dev/null)
  local enc=$(file --mime-encoding -b -- "$f" 2>/dev/null)

  # Markdown файли
  if [[ "$f" =~ \.(md|markdown)$ ]]; then
    if command -v glow &>/dev/null; then
      glow -s dark "$f" 2>/dev/null | head -200
      return 0
    elif command -v mdcat &>/dev/null; then
      mdcat "$f" 2>/dev/null | head -200
      return 0
    fi
  fi

  # Зображення - показати через chafa
  if [[ "$mime" =~ ^image/ ]]; then
    if command -v chafa &>/dev/null; then
      chafa -f symbols -s 60x30 "$f" 2>/dev/null
    elif command -v kitty &>/dev/null && [[ -n "$KITTY_WINDOW_ID" ]]; then
      kitty +kitten icat --align left --place 60x30@0x0 "$f" 2>/dev/null
    else
      file -b -- "$f"
      ls -lh -- "$f"
    fi
    return 0
  fi

  # PDF файли
  if [[ "$mime" == "application/pdf" ]]; then
    if command -v pdftotext &>/dev/null; then
      pdftotext -l 2 "$f" - 2>/dev/null | head -100
    else
      file -b -- "$f"
      ls -lh -- "$f"
    fi
    return 0
  fi

  # Відео файли
  if [[ "$mime" =~ ^video/ ]]; then
    if command -v mediainfo &>/dev/null; then
      mediainfo "$f" 2>/dev/null | head -30
    elif command -v ffprobe &>/dev/null; then
      ffprobe -hide_banner "$f" 2>&1 | head -30
    else
      file -b -- "$f"
      ls -lh -- "$f"
    fi
    return 0
  fi

  # Текстові файли (не бінарні)
  if [[ "$enc" != "binary" ]]; then
    if command -v bat &>/dev/null; then
      bat --color=always --style=numbers --line-range=:200 -- "$f" 2>/dev/null
    else
      head -n 200 -- "$f"
    fi
    return 0
  fi

  # Архіви
  case "$mime" in
    application/zip|application/x-tar|application/gzip|application/x-xz|application/x-bzip2|application/x-7z-compressed|application/zstd|application/x-zstd)
      if command -v bsdtar &>/dev/null; then
        bsdtar -tf "$f" 2>/dev/null | head -100
      elif command -v tar &>/dev/null; then
        tar -tf "$f" 2>/dev/null | head -100
      else
        file -b -- "$f"
      fi
      return 0
      ;;
  esac

  # Для всього іншого
  file -b -- "$f"
  ls -lh -- "$f"
}

# Застосування прев'ю для fzf-tab (inline код для роботи в subshell)
zstyle ':fzf-tab:complete:*:*' fzf-preview '
local f="$realpath"
[[ -z "$f" || ! -e "$f" ]] && return 0

# Очистити попередні Kitty зображення на початку
printf "\e_Ga=d,d=A\e\\\\" 2>/dev/null >/dev/tty

# Директорія - tree структура
if [[ -d "$f" ]]; then
  if command -v eza &>/dev/null; then
    eza --tree -L2 --icons=always --color=always --no-quotes -- "$f" 2>/dev/null | head -200
  else
    ls -la -- "$f" | head -200
  fi
  return 0
fi

# MIME тип
local mime=$(file --mime-type -b -- "$f" 2>/dev/null)
local enc=$(file --mime-encoding -b -- "$f" 2>/dev/null)

# Markdown
if [[ "$f" =~ \.(md|markdown)$ ]]; then
  if command -v glow &>/dev/null; then
    glow -s dark "$f" 2>/dev/null | head -200
  elif command -v mdcat &>/dev/null; then
    mdcat "$f" 2>/dev/null | head -200
  fi
  return 0
fi

# Зображення
if [[ "$mime" =~ ^image/ ]]; then
  if command -v kitten &>/dev/null && [[ -n "$KITTY_WINDOW_ID" ]]; then
    # Використати змінні fzf для правильного позиціонування
    local cols=${FZF_PREVIEW_COLUMNS:-60} lines=${FZF_PREVIEW_LINES:-40}
    local left=${FZF_PREVIEW_LEFT:-0} top=${FZF_PREVIEW_TOP:-0}
    kitten icat --clear --transfer-mode=memory --stdin=no \
      --place="${cols}x${lines}@${left}x${top}" "$f" </dev/null 2>/dev/null
  elif command -v chafa &>/dev/null; then
    chafa -f symbols -s 80x50 "$f" 2>/dev/null
  else
    file -b -- "$f"; ls -lh -- "$f"
  fi
  return 0
fi

# PDF
if [[ "$mime" == "application/pdf" ]]; then
  # Спробувати показати як зображення (перша сторінка)
  if command -v pdftoppm &>/dev/null && command -v kitten &>/dev/null && [[ -n "$KITTY_WINDOW_ID" ]]; then
    local tmpimg="/tmp/pdf_preview_$$.png"
    if pdftoppm -png -f 1 -singlefile "$f" "${tmpimg%.png}" 2>/dev/null; then
      local cols=${FZF_PREVIEW_COLUMNS:-60} lines=${FZF_PREVIEW_LINES:-40}
      local left=${FZF_PREVIEW_LEFT:-0} top=${FZF_PREVIEW_TOP:-0}
      kitten icat --clear --transfer-mode=memory --stdin=no \
        --place="${cols}x${lines}@${left}x${top}" "$tmpimg" </dev/null 2>/dev/null
      rm -f "$tmpimg"
      return 0
    fi
    rm -f "$tmpimg"
  fi
  # Fallback на текст
  if command -v pdftotext &>/dev/null; then
    pdftotext -l 3 "$f" - 2>/dev/null | head -100
  else
    file -b -- "$f"; ls -lh -- "$f"
  fi
  return 0
fi

# Відео
if [[ "$mime" =~ ^video/ ]]; then
  # Спробувати показати thumbnail
  if command -v kitten &>/dev/null && [[ -n "$KITTY_WINDOW_ID" ]]; then
    local tmpthumb="/tmp/video_thumb_$$.png"
    local success=0

    # Спробувати ffmpegthumbnailer (швидше)
    if command -v ffmpegthumbnailer &>/dev/null; then
      ffmpegthumbnailer -i "$f" -o "$tmpthumb" -s 1024 -c png >/dev/null 2>&1 && [[ -s "$tmpthumb" ]] && success=1
    fi

    # Fallback на ffmpeg
    if [[ $success -eq 0 ]] && command -v ffmpeg &>/dev/null; then
      ffmpeg -nostdin -v error -ss 3 -i "$f" -frames:v 1 -vf "scale=1024:-2" -y "$tmpthumb" >/dev/null 2>&1 && [[ -s "$tmpthumb" ]] && success=1
      # Якщо ss 3 не спрацювало, спробувати без -ss
      [[ $success -eq 0 ]] && ffmpeg -nostdin -v error -i "$f" -frames:v 1 -vf "scale=1024:-2" -y "$tmpthumb" >/dev/null 2>&1 && [[ -s "$tmpthumb" ]] && success=1
    fi

    # Показати thumbnail якщо згенеровано
    if [[ $success -eq 1 ]]; then
      local cols=${FZF_PREVIEW_COLUMNS:-60} lines=${FZF_PREVIEW_LINES:-40}
      local left=${FZF_PREVIEW_LEFT:-0} top=${FZF_PREVIEW_TOP:-0}
      kitten icat --clear --transfer-mode=memory --stdin=no \
        --place="${cols}x${lines}@${left}x${top}" "$tmpthumb" </dev/null 2>/dev/null
      rm -f "$tmpthumb"
      return 0
    fi
    rm -f "$tmpthumb"
  fi

  # Fallback на метадані
  if command -v mediainfo &>/dev/null; then
    mediainfo "$f" 2>/dev/null | head -30
  elif command -v ffprobe &>/dev/null; then
    ffprobe -hide_banner "$f" 2>&1 | head -30
  else
    file -b -- "$f"; ls -lh -- "$f"
  fi
  return 0
fi

# Текстові файли
if [[ "$enc" != "binary" ]]; then
  if command -v bat &>/dev/null; then
    bat --color=always --style=numbers --line-range=:200 -- "$f" 2>/dev/null
  else
    head -n 200 -- "$f"
  fi
  return 0
fi

# Архіви
case "$mime" in
  application/zip|application/x-tar|application/gzip|application/x-xz|application/x-bzip2|application/x-7z-compressed|application/zstd|application/x-zstd)
    if command -v bsdtar &>/dev/null; then
      bsdtar -tf "$f" 2>/dev/null | head -100
    elif command -v tar &>/dev/null; then
      tar -tf "$f" 2>/dev/null | head -100
    else
      file -b -- "$f"
    fi
    return 0
    ;;
esac

# Fallback
file -b -- "$f"
ls -lh -- "$f"
'


export VISUAL=nvim;
export EDITOR=nvim;


# ==============================
# Aliases
# ==============================
alias ls='eza --icons=always'
alias la='eza --icons=always -a'
alias ll='eza --icons=always -l -a'
alias lt='eza --tree -L2 --icons=always --color=always --no-quotes'
alias lth='eza --tree -L2 --icons=always --color=always --no-quotes -l'
alias lts='eza --tree --icons=always --color=always --no-quotes -L '
alias lths='eza --tree --icons=always --color=always --no-quotes -l -L'
alias cat='bat'
alias n='nvim'
alias cl='clear'
alias in='sudo pacman -S'
alias up='sudo pacman -Syu'
alias r='sudo pacman -Rns'
alias rp='paru -Rns'  # видалення через paru
alias upp='paru -Syu'  # оновлення через paru (включно з AUR)
alias ytd='yt-dlp -x --audio-format mp3'
# Функція для встановлення пакетів з preview
ins() {
  local selected
  selected=$(pacman -Slq | fzf \
    --height=80% \
    --layout=reverse \
    --border=rounded \
    --preview-window="right,60%,border-rounded" \
    --preview="pacman -Si {} 2>/dev/null | grep -E \"^(Repository|Name|Version|Description|Download Size|Installed Size|Depends On)\" || echo \"Loading...\"" \
    --prompt="Install ▸ " \
    --header="Select package to install (Tab: multi-select, Enter: install)" \
    --multi)

  if [[ -n "$selected" ]]; then
    sudo pacman -S $selected
  fi
}

# Функція для встановлення пакетів з AUR через paru (з preview)
inp() {
  local selected
  selected=$(paru -Slq | fzf \
    --height=80% \
    --layout=reverse \
    --border=rounded \
    --preview-window='right,60%,border-rounded' \
    --preview='paru -Si {} 2>/dev/null || echo "Loading..."' \
    --prompt='Install (paru) ▸ ' \
    --header='Select package to install from repos+AUR (Tab: multi-select, Enter: install)' \
    --multi)

  if [[ -n "$selected" ]]; then
    paru -S $selected
  fi
}
alias rf='rm -rf'
alias tld='tldr'
alias llm='gpt4all-chat'
alias yy='yazi'
alias lg='lazygit'
#alias tt='smassh'
alias rr='ranger'
alias ff='fm'  # fm файловий менеджер замість fzf
#alias g='ps aux | grep '
#alias fk='thefuck'
alias clock='tty-clock -C 4 -s -c -B -t'
alias ti='termdown'

# Git
alias ga='git add'
alias gap='ga --patch'
alias gb='git branch'
alias gba='gb --all'
alias gc='git commit'
alias gca='gc --amend --no-edit'
alias gce='gc --amend'
alias gco='git checkout'
alias gcl='git clone --recursive'
alias gd='git diff --output-indicator-new=" " --output-indicator-old=" "'
alias gds='gd --staged'
alias gi='git init'
alias gl='git log --graph --all --pretty=format:"%C(magenta)%h %C(white) %an  %ar%C(auto)  %D%n%s%n"'
alias gm='git merge'
alias gn='git checkout -b'  # new branch
alias gp='git push'
alias gr='git reset'
alias gs='git status --short'
alias gu='git pull'
alias gw='git switch'
alias spotify="spotify --ozone-platform=x11"
alias tree="eza --icons --tree --level=1"
alias wth="wttr Kovel"
# Docker
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
alias dl='docker logs --tail=100'
alias dc='docker compose'

# rg
# alias rg="rg --hidden --smart-case --glob='!.git/' --no-search-zip --trim --colors=line:fg:black --colors=line:style:bold --colors=path:fg:magenta --colors=match:style:nobold"

# Python venv helpers
alias pip-create='python -m venv venv'
alias pip-on='source venv/bin/activate'
alias pip-off='deactivate'
alias py='python'
alias py3='python3'

# tmux
alias tm='tmux'
alias tn='tmux new-session -s'
alias tl='tmux list-session'
alias ta='tmux attach-session'
alias tv='tmux attach -t'
alias td='tmux kill-session -t'

mkpip() {
    python -m venv venv
    source venv/bin/activate
}

# ==============================
# Integrations
# ==============================
eval "$(fzf --zsh)"
# FZF colors відключено - використовуємо стандартний стиль як у fzf-tab
# [ -f ~/.config/fzf/fzf-colors.zsh ] && source ~/.config/fzf/fzf-colors.zsh

# Переприв'язати Alt+C та Alt+N після завантаження fzf
bindkey '^[c' _fm_cd_widget
bindkey '^[n' _fzf_file_nvim

eval $(thefuck --alias fk)
eval "$(zoxide init --cmd cd zsh)"



export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
export PATH="$HOME/.local/bin:$PATH"

# QODER_DISPATCHER_PATH v1
path=("$HOME/.qoder/entry" ${path:#"$HOME/.qoder/entry"})
export PATH
# END QODER_DISPATCHER_PATH v1
alias obs="obs --platform xcb"
export PATH="$HOME/.cargo/bin:$PATH"
alias music="python3 ~/Music/player.py"

# ==============================
# FM Integration (замість fzf для навігації)
# ==============================

# Функція cd з fm інтеграцією
# Використання: просто введіть 'cdf' для інтерактивного вибору
cdf() {
  local dir
  # Викликаємо fm і чекаємо на вибір директорії
  dir=$(fm 2>/dev/tty)

  if [[ -z "$dir" ]]; then
    return 0
  fi

  # Якщо обрано файл, переходимо до його директорії
  if [[ -f "$dir" ]]; then
    dir=$(dirname "$dir")
  fi

  # Переходимо до директорії
  if [[ -d "$dir" ]]; then
    cd "$dir"
  fi
}

# Функція для швидкого відкриття файлу через fm у nvim
fmv() {
  local file
  file=$(fm 2>/dev/tty)

  if [[ -z "$file" ]]; then
    return 0
  fi

  if [[ -f "$file" ]]; then
    nvim "$file"
  elif [[ -d "$file" ]]; then
    cd "$file"
  fi
}
# Tuxedo / todo.txt configuration
export TODO_DIR="$HOME/.config/tuxedo/files"
export TODO_FILE="$TODO_DIR/todo.txt"
export DONE_FILE="$TODO_DIR/done.txt"

export PATH=$PATH:/home/user/.spicetify
export PATH="$(npm config get prefix)/bin:$PATH"

# >>> termium >>>
case ":$PATH:" in *:'/home/user/.local/bin':*) ;; *) export PATH='/home/user/.local/bin':"$PATH" ;; esac
# <<< termium <<<

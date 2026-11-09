# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
if [[ -o interactive ]]; then
  fastfetch
fi
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
PATH="$HOME/.local/bin:$PATH"

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

# Alt+N — fzf file finder → nvim
_fzf_file_nvim() {
  local file=$(find . -maxdepth 5 -type f 2>/dev/null | fzf --height=40% --layout=reverse --border=rounded --prompt='nvim ▸ ')
  if [[ -n "$file" ]]; then
    nvim "$file"
  fi
}
zle -N _fzf_file_nvim
bindkey '^[n' _fzf_file_nvim

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

# fzf-tab
zstyle ':fzf-tab:*' fzf-flags --height=40% --layout=reverse --border=rounded
zstyle ':fzf-tab:*' prefix ''
zstyle ':fzf-tab:*' fzf-preview-window 'left,50%,rounded'

zstyle ':fzf-tab:complete:cd:*' fzf-preview 'eza --icons --color=always -1 $realpath'

zstyle ':fzf-tab:complete:*:*' fzf-preview '
file="$realpath"
if [[ -d "$file" ]]; then
  eza --icons -1 --color=always "$file"
else
  bat --color=always --style=numbers "$file" 2>/dev/null
fi
'


export VISUAL=nvim;
export EDITOR=nvim;


# ==============================
# Aliases
# ==============================
alias ls='eza --icons=always'
alias la='eza --icons=always -a'
alias cat='bat'
alias n='nvim'
alias cl='clear'
alias in='sudo pacman -S'
alias up='sudo pacman -Syu'
alias r='sudo pacman -Rns'
alias ins='sudo pacman -S $(pacman -Slq | fzf)'
alias rf='rm -rf'
alias tld='tldr'
alias llm='gpt4all-chat'
alias yy='yazi'
alias lg='lazygit'
alias tt='smassh'
alias rr='ranger'
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
alias sober="gamescope -w 1280 -h 960 -W 1920 -H 1080 -S stretch -f -r 144 --force-grab-cursor -- \
flatpak run --env=WAYLAND_DISPLAY=gamescope-0 org.vinegarhq.Sober"
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
export FZF_DEFAULT_OPTS='--height=40% --layout=reverse --border=rounded --color=bg+:#293739,bg:#1B1D1E,border:#808080,spinner:#E6DB74,hl:#7E8E91,pointer:#E6DB74,info:#E6DB74,header:#7E8E91,fg:#F8F8F2,fg+:#F8F8F2,query:#F8F8F2,disabled:#F8F8F2'
eval "$(fzf --zsh)"
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

export PATH=$PATH:/home/user/.spicetify

# Enable Powerlevel10k instant prompt. Should stay close to the top of ~/.zshrc.
# Initialization code that may require console input (password prompts, [y/n]
# confirmations, etc.) must go above this block; everything else may go below.
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
zinit light Aloxaf/fzf-tab

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
# Powerlevel10k конфіг
# ==============================
[[ -f ~/.p10k.zsh ]] && source ~/.p10k.zsh

# ==============================
# Keybindings
# ==============================
bindkey -e
bindkey '^p' history-search-backward
bindkey '^n' history-search-forward
bindkey '^[w' kill-region
#bindkey '^R' fzf-history-widget


# Alt + → / ← — рух по словах
bindkey "^[[1;3C" forward-word   # Alt + →
bindkey "^[[1;3D" backward-word  # Alt + ←

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
#zstyle ':fzf-tab:*' switch-group '<' '>'
#zstyle ':fzf-tab:*' fzf-flags --height=40% --layout=reverse --border
#zstyle ':fzf-tab:complete:cd:*' fzf-preview 'ls --color=always $realpath'
zstyle ':fzf-tab:complete:__zoxide_z:*' fzf-preview 'ls --color=always $realpath'
zstyle ':fzf-tab:complete:cd:*' fzf-preview 'eza --icons --color=always -1 $realpath'

#nvim <TAB> bat <TAB> rm <TAB> mv <TAB>cp <TAB>
zstyle ':fzf-tab:complete:*:*' fzf-preview 'bat --color=always --style=numbers $realpath 2>/dev/null || eza --icons -1 $realpath'

zstyle ':fzf-tab:complete:*:*' fzf-preview '
file="$realpath"

if [[ -d "$file" ]]; then
  eza --icons -1 --color=always "$file"
elif [[ "$file" =~ \.(png|jpg|jpeg|gif|webp)$ ]]; then
  chafa --symbols braille \
        --size "${FZF_PREVIEW_COLUMNS}x${FZF_PREVIEW_LINES}" \
        "$file"
else
  bat --color=always --style=numbers "$file" 2>/dev/null
fi
'

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

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
eval $(thefuck --alias fk)
eval "$(zoxide init --cmd cd zsh)"

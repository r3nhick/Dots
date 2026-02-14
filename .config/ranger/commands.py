from ranger.api.commands import Command
import os
import subprocess

class fzf_search(Command):
    """
    :fzf_search

    Fuzzy search files (exclude directories) recursively using fzf.
    Press ENTER to select a file.
    """

    def execute(self):
        # Шукаємо тільки файли
        find_cmd = "find . -type f -print 2> /dev/null"

        # Викликаємо fzf з preview через bat
        fzf_cmd = f"{find_cmd} | fzf --ansi --preview 'bat --style=numbers --color=always --line-range :50 {{}}' --height 40% --layout=reverse --border"

        try:
            fzf = subprocess.run(
                fzf_cmd,
                shell=True,
                text=True,
                capture_output=True,
                cwd=self.fm.thisdir.path
            )
        except Exception as e:
            self.fm.notify(f"fzf_search error: {e}", bad=True)
            return

        if fzf.returncode == 0 and fzf.stdout:
            target = fzf.stdout.strip()
            abs_path = os.path.join(self.fm.thisdir.path, target)
            self.fm.select_file(abs_path)  # завжди файл


class fzf_search_dirs(Command):
    """
    :fzf_search_dirs

    Fuzzy search directories recursively using fzf.
    ENTER → ranger переходить у вибрану папку.
    """

    def execute(self):
        # Шукаємо тільки папки
        find_cmd = "find . -type d -mindepth 1 -print 2> /dev/null"

        # Викликаємо fzf (без preview для папок)
        fzf_cmd = (
            f"{find_cmd} | fzf --ansi "
            "--height 40% --layout=reverse --border"
        )

        try:
            fzf = subprocess.run(
                fzf_cmd,
                shell=True,
                text=True,
                capture_output=True,
                cwd=self.fm.thisdir.path
            )
        except Exception as e:
            self.fm.notify(f"fzf_search_dirs error: {e}", bad=True)
            return

        if fzf.returncode == 0 and fzf.stdout:
            target = fzf.stdout.strip()
            abs_path = os.path.join(self.fm.thisdir.path, target)

            if os.path.isdir(abs_path):
                self.fm.cd(abs_path)  # Завжди cd у директорію

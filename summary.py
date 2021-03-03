#!/usr/bin/env python3
# _*_ coding: utf-8 _*_

import sys
import subprocess

if __name__ == "__main__":
    args = sys.argv
    try:
        if args[1] == 'format':
            subprocess.run('summary_format')
            data = subprocess.Popen(['date', '+%Y%m%d'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            print(f'{data.stdout.read().decode()[:-2]}.mdを作成しました')
        elif args[1] == 'create':
            subprocess.run(['mkdir', 'summary_tech'])
            print('summary_tech/を作成しました')
            subprocess.run(['git', 'config', '--global', 'core.excludesfile', '~/.gitignore_global'])
            print('~/.gitignore_globalを読み込むようにしました')
    except IndexError:
        print('''使用方法: summary [オプション]... 
技術的なまとめを色々やるコマンド''')
    except Exception as err:
        print(err)

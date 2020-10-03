#!/usr/bin/env sh

chmod +x make_summary_format.sh
echo "alias summary=\"python `pwd`/summary.py\"" >> ~/.bashrc
source ~/.bashrc
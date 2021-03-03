#!/usr/bin/env sh

chmod +x make_summary_format.sh
echo "alias summary=\"python `pwd`/summary.py\"" >> ~/.bashrc
echo "alias summary_format=\"source `pwd`/make_summary_format.sh\"" >> ~/.bashrc
source ~/.bashrc

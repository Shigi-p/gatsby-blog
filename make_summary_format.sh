#!/usr/bin/env sh

touch `date "+%Y%m%d"`.md
echo '---\ntitle: summary_' `date "+%Y%m%d" ` ' \n---\n\n#' `date "+%Y%m%d"` >> `date "+%Y%m%d"`.md



for file in `find $HOME/Develop/ -type d -path \*/summary_tech 2>/dev/null`
do
  echo $file
  ls $file
  echo $file/*.md $HOME/Develop/summary_tech_shigi/my_tech_blog/src/md_pages/
  cp $file/*.md $HOME/Develop/summary_tech_shigi/my_tech_blog/src/md_pages/
done

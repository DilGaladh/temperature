cd temperature
echo "will kill the website if running"
sudo killall node
sudo sleep 10
echo "will run the website again"
# for debugging
#sudo node --inspect ./bin/www
sudo node ./bin/www && echo "website is running"
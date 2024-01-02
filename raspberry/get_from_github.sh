cd ~
git clone https://github.com/DilGaladh/temperature.git
cd temperature
git pull --rebase
git reset --hard origin/master
npm install --prefer-offline
cd ..
sudo sh temperature/raspberry/relaunch_website.sh


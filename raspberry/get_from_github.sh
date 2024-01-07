cd ~
echo "get with git"
git clone https://github.com/DilGaladh/temperature.git
cd temperature
git pull --rebase
git reset --hard origin/master
echo "install with npm"
npm install --prefer-offline
cd ..
sudo sh temperature/raspberry/relaunch_website.sh


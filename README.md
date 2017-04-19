# express-webpack-react Starter Kit

Starter Kit for Express Webpack and React SPA including SCSS.

  - Express
  - Handlebars
  - Webpack
  - Babel (es6)
  - React
  - SCSS
  - ESlint using Airbnb Configuration.
  - Asset Fingerprinting

### what should you do first?
```
install npm
install python 2.7 and opencv
```
#### how to install python and opencv on mac : https://jjyap.wordpress.com/2014/05/24/installing-opencv-2-4-9-on-mac-osx-with-python-support/
```
brew tap homebrew/science
brew info opencv
brew install opencv
cd /usr/local/Cellar/opencv/2.4.9/
cat ~/.bash_profile | grep PYTHONPATH
cd /Library/Python/2.7/site-packages/
ln -s /usr/local/Cellar/opencv/2.4.9/lib/python2.7/site-packages/cv.py cv.py
ln -s /usr/local/Cellar/opencv/2.4.9/lib/python2.7/site-packages/cv2.so cv2.so
```

### In order to run the application:

First install node modules

```
$ npm install
```

Then using 2 terminals, run the following:

```
$ npm run watch
$ nodemon server
```

For production, build the assets and start the server

By default, this will start up on
```
http://localhost:3010
```
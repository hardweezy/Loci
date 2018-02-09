Location and Imagery Application using PHP, Laravel@5.3, AngularJS@1.0
@author Solomon Omokehinde
@version 1.0.6
@year 2016


===================================================
#Requirements to Running App
===================================================

PHP >= 5.6.4
OpenSSL PHP Extension
PDO PHP Extension
Mbstring PHP Extension
Tokenizer PHP Extension
XML PHP Extension
MYSQL >=5.5.*
Composer

This Application was developed using Laravel Framework, laravel utilizes Composer (http://getcomposer.org/) to manage its dependencies. So, before using this App, make sure you have composer installed on your machine.


===================================================
#Local Development Server
===================================================
If you have PHP installed locally and you would like to use PHP's built-in development server to serve this application, you may use the serve Artisan command. This command will start a development server at http://localhost:8000:

-------------------
#on Mac
-------------------
Open Terminal
Change Directory to the project folder of this App
Run php artisan serve

-------------------
#on Windows
-------------------
Open CMD
Change Directory to the project folder of this App
Run php artisan serve

===================================================
#Environment Configuration
===================================================
The root directory of this project folder will contain a .env file
All of the variables listed in this file will be loaded into the $_ENV PHP super-global when the application receives a request.

You are encouraged to change the following global variables
DB_CONNECTION=mysql //this app runs smoothly with MYSQL as the DB Engine
DB_HOST=
DB_PORT=3306
DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=

After Changing the above variables
Run php artisan migrate in your terminal/CMD

This moves all needed tables to support the Application into your Database 
using the credentials you supplied above

===================================================
#Contributors
===================================================
. AngularJS
. Angular UI Router
. Satellizer
. ALT Three Locker
. Tymon JWT Auth
. Angular Util Pagination
. Angular UI Bootstrap
. Angular LightBox
. Laravel Framework


===================================================
#TroubleShooting
===================================================

1. Missing/Unidentified Application Key
------------------------------------------------
Run the  php artisan key:generate command.

Typically, this string should be 32 characters long. The key can be set in the .env environment file. If the application key is not set, your user sessions and other encrypted data will not be secure!


2. Invalid URL in console.log
------------------------------------------------
If you are using any other address apart from the default http://localhost:8000
Go into public directory
into js folder
open app.js and change the address on line 12 
## .constant('API_URL', 'http://localhost:8000/api/v1')
Kindly change the entry before api/v1. Do not change this path "api/v1"

3. App won't Run
------------------------------------------------
install a new Laravel Project by issuing the Composer create-project command in your terminal:
composer create-project --prefer-dist laravel/laravel newProject

Copy contents of this App's composer.json which can be found in the root directory into the newly installed Laravel Project's composer.json

Run composer update command in your terminal

This downloads the required files

Create files if not present/Copy and Replace these files from this Project Directory to the newly installed Laravel project
--app/Http
--app/Location.php
--app/Picture.php
--app/User.php

--config/app.php
--config/jwt.php
--config/locker.php

--node_modules
--public

--resources/views/index.php

===================================================
#ToDos
===================================================
1. Improve Image Lightbox Directive
2. Improve the location input control by adding GeoNames
3. Allow user's email to fetch public avatar from Facebook, Instagram API
4. Improve on results display of images and location listings

===================================================
#Vulnerability
===================================================
In case of any reported bug. send an email to solomonomokehinde@gmail.com

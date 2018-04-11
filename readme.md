# Location and Imagery Application using PHP, Laravel@5.3, AngularJS@1.0
@author Solomon Omokehinde
@version 1.0.6
@year 2016

## API Keys needed

[Foursquare](https://developer.foursquare.com/)

[Flickr](https://www.flickr.com/services/api/)


## Setup

1. clone the repository with `git clone https://github.com/hardweezy/Loci.git`
2. `cd Loci`
3. `composer install`
4. `php artisan key:generate`
5. edit .env file and set your db credentials and api keys
6. make sure your database is created in your local mysql instance, default db name is loci
7. `php artisan migrate`
8. `php artisan serve`

## Running the Dev Server

```bash
> php artisan serve
```

## Working With JavaScript

```bash
> npm run watch
```

## Licenses

Loci is licenced under [WTFPL (Do What the Fuck You Want To Public License)](http://www.wtfpl.net/about/)

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Powered By

<p align="left">
Laravel, AngularJS, BootStrap
</p>



## ToDos

1. Improve Image Lightbox Directive
2. Improve the location input control by adding GeoNames
3. Allow user's email to fetch public avatar from Facebook, Instagram API
4. Improve on results display of images and location listings

## Vulnerability
In case of any reported bug. send an email to solomonomokehinde@gmail.com

<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('venue_id',100);
            $table->string('venue_name',150);
            $table->string('venue_contact',100)->nullable();
            $table->text('venue_location')->nullable();
            $table->string('venue_category',250)->nullable();
            $table->string('venue_verified',30)->nullable();
            $table->string('venue_stats',100)->nullable();
            $table->text('venue_url')->nullable();
            $table->string('venue_lat',100);
            $table->string('venue_lng',100);
            $table->string('venue_ratingSignals',10)->nullable();
            $table->text('venue_photoURL')->nullable();
            $table->string('venue_hereNow',35)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('locations');
    }
}

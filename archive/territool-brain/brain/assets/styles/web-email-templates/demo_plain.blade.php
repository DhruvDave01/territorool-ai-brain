@extends('backpack::layout')

@section('header')

Hello {{ $demo->receiver }},
This is a demo email for testing purposes! Also, it's the HTML version.
 
Demo object values:
 
Demo One: {{ $demo->demo_one }}
Demo Two: {{ $demo->demo_two }}
 
Values passed by With method:
 
 
Thank You,
{{ $demo->sender }}
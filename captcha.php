<?php
// library for captcha images 
require_once __DIR__ . '/securimage/securimage.php';

$img = new Securimage();
$img->image_width     = 200;
$img->image_height    = 70;
$img->code_length     = 5;
$img->charset         = 'ABCDEFGHJKMNPRSTUVXYZ23456789'; // no I,l, L etc
$img->case_sensitive  = false;
$img->expiry_time     = 600;
$img->num_lines       = 4;
$img->perturbation    = 0.8;
$img->image_bg_color  = new Securimage_Color('#f5f5f5');
$img->text_color      = new Securimage_Color('#222222');
$img->line_color      = new Securimage_Color('#999999');
$img->noise_color     = new Securimage_Color('#999999');

$img->show();
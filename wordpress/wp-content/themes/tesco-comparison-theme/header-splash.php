<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0078D7">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <?php wp_head(); ?>
    <style>
        /* Splash screen specific styles */
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
        }
        
        .splash-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #0078D7; /* Tesco blue */
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s ease-in-out;
        }
        
        .splash-content {
            text-align: center;
            color: white;
            padding: 20px;
            max-width: 80%;
        }
        
        .splash-logo {
            margin-bottom: 20px;
        }
        
        .splash-logo img {
            max-width: 120px;
            height: auto;
        }
        
        .splash-title {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px;
        }
        
        .splash-tagline {
            font-size: 16px;
            margin: 0 0 30px;
            opacity: 0.9;
        }
        
        .splash-loader {
            height: 4px;
            width: 100%;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            margin: 0 auto 30px;
            overflow: hidden;
        }
        
        .loader-progress {
            height: 100%;
            width: 0;
            background-color: white;
            border-radius: 2px;
            transition: width 0.2s ease;
        }
        
        .splash-countries {
            font-size: 12px;
            opacity: 0.7;
            max-width: 280px;
            margin: 0 auto;
            line-height: 1.5;
        }
        
        @media (max-height: 500px) {
            .splash-logo img {
                max-width: 80px;
            }
            
            .splash-title {
                font-size: 22px;
            }
            
            .splash-tagline {
                font-size: 14px;
                margin-bottom: 20px;
            }
            
            .splash-loader {
                margin-bottom: 20px;
            }
            
            .splash-countries {
                font-size: 10px;
            }
        }
    </style>
</head>
<body <?php body_class(); ?>>
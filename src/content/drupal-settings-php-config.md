---
title: What goes on in Production, stays in Production.
lead: "Using Drupal's settings.php file to turn off caching in your local development environment."
tags: blog
layout: post.hbs
date: 2012-03-26
---
<p>One of the first things we learn, when getting started with <a href="http://drupal.org">Drupal</a>, is that the <a href="http://api.drupal.org/api/drupal/sites!default!default.settings.php/7">settings.php</a> file is where our site's database settings live.&nbsp;&nbsp; There is actually more to settings.php than just pointing Drupal to the correct database.</p>
<p>Settings.php can be used for <a href="http://drupal.org/node/1096962">all sorts of configuration</a>.&nbsp; Much of which I won't attempt to cover and is probably better left to your sys admin. However there are some settings that can be very helpful to any developer or themer.</p>
<p>Settings.php allows you to override any system variable in your variable database table. The syntax for this is pretty simple.</p>
<div class="geshifilter">
<pre class="geshifilter-php"><span class="re0">$conf</span><span class="br0">[</span><span class="st0">'variable_name'</span><span class="br0">]</span> = value;</pre></div>
<p>Below are a few variable configurations I find useful to add to my development environment's settings.php.</p>
<div class="geshifilter">
<pre class="geshifilter-php"><span class="re0">$conf</span><span class="br0">[</span><span class="st0">'preprocess_js'</span><span class="br0">]</span> = <span class="nu0">0</span>;
<span class="re0">$conf</span><span class="br0">[</span><span class="st0">'preprocess_css'</span><span class="br0">]</span> = <span class="nu0">0</span>;
<span class="re0">$conf</span><span class="br0">[</span><span class="st0">'cache'</span><span class="br0">]</span> = <span class="nu0">0</span>;
<span class="re0">$conf</span><span class="br0">[</span><span class="st0">'block_cache'</span><span class="br0">]</span> = <span class="nu0">0</span>;
<span class="re0">$conf</span><span class="br0">[</span><span class="st0">'googleanalytics_account'</span><span class="br0">]</span> = <span class="st0">"UA-XXXXXXX-X"</span>;</pre></div>
<p>The first two turn off CSS and JS aggregation.&nbsp; The next two turn off page and block caching. The last sets an invalid <a href="http://www.google.com/analytics/">Google Analytics</a> account number to prevent GA from tracking your local page views-- assuming you are using the <a href="http://drupal.org/project/google_analytics">Google Analytics module</a>.</p>
<p>By setting variables in settings.php, you will <strong>always override variables set through the UI</strong>.&nbsp; So, you no longer need to worry about turning off caching or aggregation when bringing in a new database dump from production.</p>
<p>It's important to note that each environment in which your site runs, should have its own settings.php.&nbsp; This means, if you are using <a href="http://git-scm.com/">git for version control</a>, you should always <a href="http://help.github.com/ignore-files/">ignore you settings.php file</a>.&nbsp; This will prevent it from being deployed to different environments and keep your database settings hidden from those that may have access to your repository.&nbsp;</p>

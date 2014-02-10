---
title: All the Cool Kids to the Back of the Bus
lead: "Improving Drupal's page load performance by loading javascript at the bottom of the page."
tags: blog
layout: post.hbs
date: 2012-02-02
---

An easy way to improve page load performance of any website is to move all your javascript calls to the bottom of the page, just inside the closing <code>&lt;body&gt;</code> tag. &nbsp;By default, Drupal loads all its javascript at the top of the page, inside the head tag. &nbsp;If you want to see what I mean, open up a Drupal site and run it through <a href="http://developer.yahoo.com/yslow/">ySlow</a>. &nbsp;Chances are, you'll get a big F.

  <figure>
    <img alt="" src="/images/yslow-drupal-gets-an-f.jpg">
  </figure>

So, how do we fix this? Well, our first inclination might be to move&nbsp; ```<?php print $scripts; ?>``` down, so it sits just before the closing <code>&lt;/body&gt;</code> tag&nbsp;in our <a href="http://api.drupal.org/api/drupal/modules!system!html.tpl.php/7">html.tpl.php file</a>.&nbsp; This actually works, but has some drawbacks. For one, it essentially prevents any other scripts from being added to the top of the page without either hardcoding them into the template or creating a new javascript scope (More on scope in a bit.) &nbsp;There are still some cases where scripts need to be loaded at the top. For instance, <a href="http://code.google.com/p/html5shiv/">html5shiv</a>, which brings the awesomeness of HTML5 elements to old school browsers, needs to be loaded in the <code>&lt;head&gt;</code>, in order for it to work.

The other potential side effect happens when we turn on Drupal's built-in JS aggregation <em>(which we <strong>always</strong> do, right?)</em> By just moving the <code>$scripts</code> variable further down the page, we possibly end up with extra aggregated js files and more HTTP Requests than we need-- something that will degrade page load performance as well. &nbsp;This has to do with javascript scope in Drupal.

  Javascript scope is what Drupal uses to determine where scripts should be added to the page. &nbsp;It is also the first of many criteria used in determining which scripts should be aggregated together when aggregation is turned on. Drupal has two built-in scopes: <strong>Header</strong> and <strong>Footer</strong>. Both are mapped to php variables that can printed in your <code>html.tpl.php</code> template. The header scope is what is printed with the <code>$scripts</code> variable. When you add&nbsp;<code>&lt;?php print $scripts; ?&gt;</code> to your template, Drupal will print out all the scripts scoped to header, nicely formatted in <code>&lt;script&gt;</code> tags.

  Somewhat less intuitive, the <strong>footer</strong> scope doesn't have its own specific variable. Its scripts are slapped on to the end of the <code>$page_bottom</code> region variable. So, if we just move <code>$scripts</code> down to the bottom of our template, we are potentially printing two groups of scripts that could be aggregated into one. There is a better way.

  Enter <a href="http://api.drupal.org/api/drupal/modules%21system%21system.api.php/function/hook_js_alter/7">hook_js_alter()</a>. &nbsp;<code>hook_js_alter</code> allows us to modify any scripts added via <a href="http://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_add_js/7"><code>drupal_add_js()</code></a>. &nbsp;This hook fires&nbsp;during <code>drupal_get_js()</code>, before scripts are aggregated and printed to the screen. &nbsp;If the scope is not specified in <code>drupal_add_js()</code>, <a href="http://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_js_defaults/7">Drupal will set the scope to <strong>header</strong> by default</a>. Using <code>hook_js_alter()</code>, we can go through the list of scripts and change the scope of each to <strong>footer</strong>. The code goes in your theme's <code>template.php</code> file and is actually quite simple:

```
<?php
/**
 * Implements hook_js_alter()
 */

function MYTHEME_js_alter(&$javascript) {
  // Collect the scripts we want in to remain in the header scope.
  $header_scripts = array(
    'sites/all/libraries/modernizr/modernizr.min.js',
  );

  // Change the default scope of all other scripts to footer.
  // We assume if the script is scoped to header it was done so by default.
  foreach ($javascript as $key => &$script) {
    if ($script['scope'] == 'header' && !in_array($script['data'], $header_scripts)) {
      $script['scope'] = 'footer';
    }
  }
}
?>
```
<p>
  So, what is this doing? &nbsp;First we create an array of scripts we want to stay in the <strong>header</strong>. &nbsp;In this example, we are using <a href="http://www.modernizr.com/">modernizr</a> (in conjunction with the <a href="http://drupal.org/project/modernizr">modernizr module</a>) which includes <em>html5shiv.js</em>. &nbsp;As mentioned earlier, <em>html5shiv.js</em> needs to be loaded in the <code>&lt;head&gt;</code> tag to function properly. &nbsp;Note: Creating this array isn't really necessary, being that it only contains one script. However, doing so will make it easier, should we need to move more scripts to the top of the page down the road. Next we cycle through each script checking to see if its scope is currently set to <strong>header</strong> and it is NOT in our array. &nbsp;If those conditions are met, we change the scope to <strong>footer</strong>. &nbsp;That's it. &nbsp;No need to muck with any template files.</p>
<p>
  Now let's see what yslow has to say.</p>
  <figure>
    <img alt="" src="/images/yslow-drupal-gets-an-a.jpg">
  </figure>
<p>
  Yeah, that's what I thought, yslow. It's worth noting that some scripts may have been set to <strong>header</strong> on purpose by their module developer. &nbsp;There really isn't any way, that I know of, to tell whether or not a script was scoped to <strong>header</strong> on purpose or if it was set by default. As this is a blanket approach, you'll just need to be mindful of your scripts and their loading order. &nbsp;</p>
<p>
  As mentioned earlier, <strong>scope</strong> is one of many criteria used to determine aggregation and script load order. &nbsp;To learn more, check out the <a href="http://api.drupal.org/api/drupal/includes%21common.inc/function/drupal_add_js/7">drupal_add_js()</a> api.</p>

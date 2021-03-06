---
title: CSS Confessional
lead: "Writing performant stylesheets and how Drupal leads us toward temptation, with its dirty innefficient CSS selectors."
tags: blog
layout: post.hbs
---
<p>I've had the opportunity to work with some amazing themers at <a href="http://examiner.com">Examiner.com</a>, working on their latest redesign. Examiner.com is a huge site with tons of content and a wide variety of associated page layouts and block layouts. Working on a such a large site got me thinking a lot about what constitutes efficient CSS lately, both from a development and browser rendering perspective. &nbsp;For now, let's focus on the latter.&nbsp;</p>
<p>
  Whether or not the gains, from writing efficient CSS, will have a noticeable impact on the end-user experience will vary. The gains are probably <a href="http://www.stevesouders.com/blog/2009/03/10/performance-impact-of-css-selectors/">not worth going back and rewriting old CSS</a>, but it's good to have an understanding of these principles as we move forward writing CSS. &nbsp;</p>
<p>
  In my mind, there are 3 main variables that will affect rendering performance, device CPU, DOM complexity and CSS selectors. To simplify, let's assume our users are running slow CPUs (read mobile) and we're theming a site with a complex DOM (read Drupal divitis.) How can we write the most efficient CSS?</p>
<p>
  The main concepts we need to understand are, browsers traverse the DOM outside-in and they evaluate CSS selectors from *right to left*. &nbsp;So the browser starts with &lt;html&gt; then &lt;body class="no-sidebar"&gt; then &lt;div class="teaser"&gt; and so on. All the way down until it reaches the inner most element. &nbsp;For each element, the browser checks the CSS to see if there are any rules where the right-most CSS selector matches. In the above example, when evaluating &lt;div class="teaser"&gt;, these rules would match:</p>
<ol>
  <li>div {…}</li>
  <li>no-sidebar div.teaser {…}</li>
  <li>teaser {…}</li>
</ol>
<p>
  In the case of #1, this rule will apply to all divs on our page, which will be way more elements than we probably need. Thus wasted CPU.</p>
<p>
  For #2, the browser sees a match, then has to traverse all the way back out of the DOM until it finds a match for .no-sidebar. &nbsp;Not a big deal in this example, because it only has to make one more evaluation before finding a match. &nbsp;But what if our div was 20 levels deep and .no-sidebar didn't apply to any outer elements? That's 20 more evaluations. When you have 2000 CSS rules full of these descendent selectors, this will add up fast. &nbsp;This rule is also over-specified, in that there is rarely a need to include both the element and the class on a given selector. &nbsp;This will make things much harder to override later.</p>
<p>
  For #3, the browser scans the element, sees a match and is finished. &nbsp;No more evaluations needed. The rule only applies to elements with the same class and can be overridden or built upon easily.</p>
<p>
  Popular CSS strategies such as <a href="http://oocss.org/">OOCSS</a> and <a href="http://smacss.com/">SMACSS</a> are both geared towards writing CSS that can scale with a large complex site. &nbsp;And both revolve around the core concept of styling by adding layers of classes to get the effect you want. &nbsp;This should result in tidy CSS-- efficient to scale and maintain.</p>
<p>
  To find out more about efficient CSS from a browser perspective check out <a href="http://code.google.com/speed/page-speed/docs/rendering.html#UseEfficientCSSSelectors">Google's list of selectors to avoid</a> and <a href="http://css-tricks.com/6386-efficiently-rendering-css/">Chris Coyier's excellent blog post</a>.</p>
<p>
  <strong>Long story short: target classes, not elements.</strong></p>
<blockquote>
  <p>"Bless me father, for I have sinned, I wrote shitty CSS."</p>
</blockquote>
<p>
  My problem, is the tools I use to create websites tend to steer me down the dark path of inefficient styling by using a ton of descendent selectors. &nbsp;</p>
<p>
  The first is CSS preprocessors. Don't get me wrong, I love them long time. However, both <a href="http://sass-lang.com/">SASS</a> and <a href="http://sass-lang.com/">LESS</a> allow you to nest your selectors in order to easily create and manage unnecessary, descendent-heavy styles. &nbsp;But you're just kicking the unmaintainable can down the road. &nbsp;Gradually, as the site grows, you'll hit a point where you need to nest more and more in order to override specific styles. &nbsp;This problem can be solved with a change of mindset and general awareness of what the final compiled CSS will look like.</p>
<p>
  Writing efficient CSS is easy, provided you have the classes to target. Drupal themes have never been very intuitive when it comes to adding classes. &nbsp;In most cases, you need to either <a href="http://drupal.org/node/171194">modify a .tpl file</a> or <a href="http://drupal.org/node/223430">write a preprocess function</a>. &nbsp;Both of these can be relatively time consuming to do; depending on the theme you are working with; the element you want to add a class to; and the way the module outputting the markup was originally written. &nbsp;Most Drupal <a href="http://mogdesign.eu/blog/19-base-themes-for-drupal/">base themes</a> come with tons of CSS classes which make it very quick and convenient to write some decedent heavy selectors and get the job done. &nbsp;This might be fine for a small site, but will kill you with a big site. Especially if it &nbsp;goes through frequent design adjustments.</p>
<p>
  Thankfully, I've been getting my hands dirty with <a href="http://drupal.org/node/930760">Drupal 7's render arrays</a>&nbsp;and <a href="http://drupal.org/node/722174">theme functions</a>. Adding a custom class is getting much easier with practice. &nbsp;However, there surely must be a way to reduce the learning curve of adding classes to a Drupal theme. Right now I'm drawing a blank, but will definitely be thinking about it.</p>
<p>
  So as penance, I am writing this post in an effort to raise awareness of writing good CSS. I will also write 10 reusable classes before going to bed tonight.&nbsp;</p>

---
layout: posts
title: Posts
---

<div class="writing-archive">
  {% for post in collections.posts.resources %}
    <article class="archive-post">
      <div class="archive-post-content">
        <h2 class="archive-post-title">
          <a href="{{ post.relative_url }}">{{ post.data.title }}</a>
        </h2>
        <time class="archive-post-date">{{ post.data.date | date: "%B %d, %Y" }}</time>
        <div class="archive-post-excerpt">
          {% assign words = post.content | strip_html | split: ' ' %}
          {% assign excerpt_words = words | slice: 0, 30 %}
          {{ excerpt_words | join: ' ' }}{% if words.size > 30 %}...{% endif %}
        </div>
      </div>
      <div class="archive-post-meta">
        <div class="archive-read-time">
          {% assign words = post.content | strip_html | number_of_words %}
          {% assign read_time = words | divided_by: 200 | plus: 1 %}
          <span class="read-time-number">{{ read_time }}</span>
          <span class="read-time-label">min read</span>
        </div>
      </div>
    </article>
  {% endfor %}
</div>

---
layout: posts
title: Posts
---

<div class="writing-archive">
  {% assign posts_by_year = collections.posts.resources | group_by_exp: 'post', 'post.data.date | date: "%Y"' %}
  {% for year_group in posts_by_year %}
    <div class="year-section">
      <h2 class="year-heading">{{ year_group.name }}</h2>
      <div class="year-posts">
        {% for post in year_group.items %}
          <article class="archive-post">
            <div class="archive-post-content">
              <h3 class="archive-post-title">
                <a href="{{ post.relative_url }}">{{ post.data.title }}</a>
              </h3>
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
    </div>
  {% endfor %}
</div>

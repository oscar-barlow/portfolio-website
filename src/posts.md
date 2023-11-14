---
layout: posts
title: Posts
---

<ul>
  {% for post in collections.posts.resources %}
    <li>
      {{ post.data.date }}  <a href="{{ post.relative_url }}">{{ post.data.title }}</a>
    </li>
  {% endfor %}
</ul>

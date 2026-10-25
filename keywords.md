---
layout: page
title: 키워드
permalink: /keywords/
---
{%- assign tags = site.tags | sort -%}
<p class="label">브리핑에 붙은 키워드와 글 목록입니다. 글 끝의 키워드를 누르면 여기로 옵니다.</p>
<div class="keyword-index">
{%- for tag in tags -%}
  {%- assign name = tag[0] -%}
  <section class="keyword-group" id="{{ name | slugify: 'raw' }}">
    <h2>{{ name }} <span class="note">{{ tag[1].size }}편</span></h2>
    <ul>
      {%- for post in tag[1] -%}
      <li><time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%Y.%m.%d" }}</time> <a href="{{ post.url | relative_url }}">{{ post.title }}</a></li>
      {%- endfor -%}
    </ul>
  </section>
{%- else -%}
  <p class="empty">아직 키워드가 없습니다.</p>
{%- endfor -%}
</div>

---
layout: page
---

# 所有日志

<script setup>
import { data as posts } from '../posts.data.js'
</script>

<ul>
  <li v-for="post of posts" :key="post.url">
    <strong>{{ post.frontmatter.date }}</strong>
    <a :href="post.url">{{ post.frontmatter.title }}</a>
    <span v-if="post.frontmatter.tags">
      — 
      <code v-for="tag in post.frontmatter.tags" style="font-size:0.8em;margin-right:4px">{{ tag }}</code>
    </span>
  </li>
</ul>

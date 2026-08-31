<script setup lang="ts">
import { profile } from '@/data/profile'

/**
 * The site's closing beat, repeated on every page: a full-bleed maroon block
 * with the email set as large as the hero. It is the only place the accent
 * runs as a surface rather than as a line, which is what makes it land.
 */
</script>

<template>
  <section id="contact" class="contact" aria-labelledby="contact-title">
    <div class="shell contact__inner">
      <p class="label contact__marker">Contact</p>

      <h2 id="contact-title" class="display contact__title">
        Let's build<br />something considered.
      </h2>

      <a :href="`mailto:${profile.email}`" class="contact__email link-underline">
        {{ profile.email }}
      </a>

      <ul class="contact__links">
        <li v-for="link in profile.links" :key="link.label">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="mono contact__link link-underline"
          >
            {{ link.label }} ↗
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--c-deep);
  color: var(--c-on-deep);
  padding-block: clamp(4rem, 9vw, 8rem);
}

.contact__marker {
  color: var(--c-on-deep-muted);
  margin-bottom: 2.5rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.18);
}

.contact__title {
  font-size: var(--t-3xl);
  margin-bottom: clamp(2rem, 5vw, 3.5rem);
}

.contact__email {
  display: inline-block;
  padding-block: 0.35rem;
  font-family: var(--font-display);
  font-variation-settings:
    'opsz' 48,
    'SOFT' 20,
    'WONK' 1;
  font-size: var(--t-xl);
  line-height: 1.2;
  word-break: break-word;
  transition: color var(--dur) var(--ease-out);
}

.contact__email:hover,
.contact__email:focus-visible {
  color: var(--c-on-deep-muted);
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.75rem;
  margin-top: clamp(2rem, 5vw, 3.25rem);
}

.contact__link {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  color: var(--c-on-deep-muted);
  transition: color var(--dur) var(--ease-out);
}

.contact__link:hover,
.contact__link:focus-visible {
  color: var(--c-on-deep);
}

.contact :focus-visible {
  outline-color: var(--c-on-deep);
}
</style>

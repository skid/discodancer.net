---
title: About this website
date: 2019-12-24
---

## About this website

This is a static website generated from Markdown files. It's a super minimalistic static site generator that I wrote because what's [available](https://www.linode.com/docs/websites/static-sites/how-to-choose-static-site-generator/) around the net these days is total overkill. The source is 100 lines of Typescript and it's actually [served here](/engine) because why not? It's deployed via a git hook, from the site's [public repo](https://github.com/skid/discodancer.net).

## How it works

1. Create a Markdown file in `/source`
2. Add a navigation link to it in `/source/_config.json`
3. Run `node engine` from the root dir to build the html pages.
4. Git commit
5. Push to git repo and the hook will copy it to my server
6. If you want to change anything about the look and feel, do it in `assets/template.html` and `assets/style.css`, then rebuild.
# A 100 SLOC static site generator

Design principle: As little work as possible.

1. The blogging engine is part of the blog code repo because why not.
2. The blog is deployed by pushing to github and a deploy hook.
3. The pages are defined as markdown with some front matter.
4. Other stuff can be committed and pushed in a designated folder (`extras`)
5. Large files can be `scp`ed directly to the server in the `uploads` folder.
6. The navigation is configured via a JSON config.
7. There is a single HTML template
8. The output is a bunch of HTML files in the root directory which is also the server root.

## Usage

1. Clone the repo
2. Change the `assets/*` files as needed, including the html template
3. Create your own Markdown files in `source`
4. Go to `engine` and run `yarn` or `npm install`
5. Run `node engine` from the root dir
6. You will find all the generated html pages in the root dir
7. Deploy by copying your entire source dir somewhere. Make sure you don't copy the `node_modules`. You can also leave out the entire `engine` folder.




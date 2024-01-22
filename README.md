# Obsidian Sticky Heading Plugin
![CleanShot 2024-01-22 at 21 45 12@2x](https://github.com/imshenshen/obsidian-sticky-heading/assets/19701958/57d806c1-8452-4f88-9688-f362482e822d)


https://github.com/imshenshen/obsidian-sticky-heading/assets/19701958/12f8e9c6-f0f7-4066-b0f2-fd89e3775f15


## config
you need install [Style Settings plugin](obsidian://show-plugin?id=obsidian-style-settings) , allows you to config top space when sticky.
![](https://github.com/imshenshen/obsidian-sticky-heading/assets/19701958/7ffbe469-053c-487a-af50-0b11b3a47e71)


## Releasing new releases

- Update your `manifest.json` with your new version number, such as `1.0.1`, and the minimum Obsidian version required for your latest release.
- Update your `versions.json` file with `"new-plugin-version": "minimum-obsidian-version"` so older versions of Obsidian can download an older version of your plugin that's compatible.
- Create new GitHub release using your new version number as the "Tag version". Use the exact version number, don't include a prefix `v`. See here for an example: https://github.com/obsidianmd/obsidian-sample-plugin/releases
- Upload the files `manifest.json`, `main.js`, `styles.css` as binary attachments. Note: The manifest.json file must be in two places, first the root path of your repository and also in the release.
- Publish the release.

> You can simplify the version bump process by running `npm version patch`, `npm version minor` or `npm version major` after updating `minAppVersion` manually in `manifest.json`.
> The command will bump version in `manifest.json` and `package.json`, and add the entry for the new version to `versions.json`

=== Plugin Name ===
Contributors: wordpressdotorg
Donate link:
Tags: importer, movable type, typepad
Requires at least: 3.0
Tested up to: 6.7
Stable tag: 0.6.3
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Import posts and comments from a Movable Type or TypePad blog.

== Description ==

Import posts and comments from a Movable Type or TypePad blog.

== Installation ==

1. Upload the `movabletype-importer` folder to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress
1. Go to the Tools -> Import screen, Click on Movable Type and TypePad

== Frequently Asked Questions ==

== Screenshots ==

== Changelog ==

= 0.6.3 =
* Testing the plugin up to WordPress 6.7
* Fix warning when `mt-export.txt` is used

= 0.6.2 =
* Testing the plugin up to WordPress 6.4.2
* Update link references from http to https.

= 0.6.1 =
* Test the plugin up to WordPress 6.2

= 0.6 =
* Add support for WordPress 6.1

= 0.5 =
* Remove comment_exists check for importing comments. In testing, I found no duplicated comments via this method, and it's extremely slow on large imports. If this check is needed, then define('WP_MT_IMPORT_ALLOW_DUPE_COMMENTS', false);
* Disable cache invalidation and both term and comment counting during import, for speed. Re-enable them after import.
* Disable autocommit during import, commit once every 500 posts and after complete import. Huge speed boost. To force autocommit to be left alone, define('WP_MT_IMPORT_FORCE_AUTOCOMMIT',true);

= 0.4 =
* String updates

= 0.3 =
* Use BASENAME, if present, as the slug for the post.

= 0.2 =
* Add check for WP_LOAD_IMPORTERS

= 0.1 =
* Initial release

== Upgrade Notice ==

= 0.4 =
Import post slugs to make URL transition easier.

= 0.3 =
Use BASENAME for post slugs.

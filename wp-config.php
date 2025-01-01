<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wordpress' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'nTE>4$B5_CEC82+GczdWV-~FZCPy<^kC`(V{y=hISx;ecR,_2Rk&!L,`L`yucB }' );
define( 'SECURE_AUTH_KEY',  '2@L;m!`3TipmS{NV.|fxmeq%!5Fo!%`6t2U-{|2@IWH#s@FM<+~0, %QLUR&MLJU' );
define( 'LOGGED_IN_KEY',    '[p7tl~{@luswoAW$,y&{yOY%:Mkr:3Vet{6+U`NSD;ss7>mIRX-;Gm`u]^*1&m }' );
define( 'NONCE_KEY',        'H `or#s95JrcU2-R`3O~a%%d%Ww6se,Id.V/f=ji/i{S[_B,,-:paA/755Poskq5' );
define( 'AUTH_SALT',        'Z[{|iu^f1r](w6<MF 7h_F]eF`OkNKM!&&@%1f.?r@hOA%I+_N CdUbz-a:49^Ra' );
define( 'SECURE_AUTH_SALT', '1E9nl.&lD%[shF7S(~| *h)OtevL[P_FadTA&%| -.Y~Pg2C=x&:y D>KvE--H6;' );
define( 'LOGGED_IN_SALT',   'e6.x%##UuMOUshm$8%IrmpbX3?@RYF3yf c#gm,GI!oQS,v/Y~M`!<*4J@3YZsF9' );
define( 'NONCE_SALT',       'B63&5A.<aT|&Juq?~X]DvD/NT. n4]r?2$E^f_e#^*3$}kta UuQ)<f}4_W/.-G%' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';

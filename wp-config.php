<?php
/** Enable W3 Total Cache */
define('WP_CACHE', true); // Added by W3 Total Cache

/**
 * Baskonfiguration för WordPress.
 *
 * Denna fil används av wp-config.php-genereringsskript under installationen.
 * Du behöver inte använda webbplatsens installationsrutin, utan kan kopiera
 * denna fil direkt till "wp-config.php" och fylla i alla värden.
 *
 * Denna fil innehåller följande konfigurationer:
 *
 * * Inställningar för MySQL
 * * Säkerhetsnycklar
 * * Tabellprefix för databas
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL-inställningar - MySQL-uppgifter får du från ditt webbhotell ** //
/** Namnet på databasen du vill använda för WordPress */
define( 'DB_NAME', 'blogstje' );

/** MySQL-databasens användarnamn */
define( 'DB_USER', 'root' );

/** MySQL-databasens lösenord */
define( 'DB_PASSWORD', '' );

/** MySQL-server */
define( 'DB_HOST', 'localhost' );

/** Teckenkodning för tabellerna i databasen. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Kollationeringstyp för databasen. Ändra inte om du är osäker. */
define('DB_COLLATE', '');

/**#@+
 * Unika autentiseringsnycklar och salter.
 *
 * Ändra dessa till unika fraser!
 * Du kan generera nycklar med {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * Du kan när som helst ändra dessa nycklar för att göra aktiva cookies obrukbara, vilket tvingar alla användare att logga in på nytt.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '0[sDk=kmb>(T[WZg^~_V70~5q9P oE3ZO,2@lz@j`z#95Tbvw.Slb+to($n3RIBs' );
define( 'SECURE_AUTH_KEY',  '!=~0r8()oMANv}[bA4k3zcaQkpqT|nmXcsu#kH?=C5 1bHM/V$)l/u:#BmMA@WhG' );
define( 'LOGGED_IN_KEY',    '_(vEU9md?>PWpd~ynvs##7b2d#9x,(Myj/[kw#W+&.8.!~sudgC{D{k<}`d<;,x-' );
define( 'NONCE_KEY',        'T.XH{]P)DH.3U/1*PB%=>Bya3(aP7TGtaqs?XK6*Zn-Vw B$_RLGV/_ZMW!#Q-H0' );
define( 'AUTH_SALT',        '1satf<y32^Gr^q.<s~<>>%oRw<2AF>{y.xea!R|9k=;rirvlHD;)gxv&(^>S,n5,' );
define( 'SECURE_AUTH_SALT', '#/}gKS{:SnQ]B=(wU0!;V!w#+=dvEQlDSr.uxpAXH<bBO3-ni]fBJWY#za#-7clM' );
define( 'LOGGED_IN_SALT',   ';ISiF5c?2T55@Fw#O2PvjQ*YI^3sy,JtlUoEtl.+B+6X8bxo8l`b&ZqM=D&pm7<{' );
define( 'NONCE_SALT',       'O-&I0^qHu:i*SI~ie(CvXTE*`eb/o0dj!PG<80|Xfe&_<rhRe5<i!</}9;.[luw>' );

/**#@-*/

/**
 * Tabellprefix för WordPress-databasen.
 *
 * Du kan ha flera installationer i samma databas om du ger varje installation ett unikt
 * prefix. Använd endast siffror, bokstäver och understreck!
 */
$table_prefix = 'wp_';

/** 
 * För utvecklare: WordPress felsökningsläge. 
 * 
 * Ändra detta till true för att aktivera meddelanden under utveckling. 
 * Det rekommenderas att man som tilläggsskapare och temaskapare använder WP_DEBUG 
 * i sin utvecklingsmiljö. 
 *
 * För information om andra konstanter som kan användas för felsökning, 
 * se dokumentationen. 
 * 
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */ 
define('WP_DEBUG', false);

/* Det var allt, sluta redigera här och börja publicera! */

/** Absolut sökväg till WordPress-katalogen. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Anger WordPress-värden och inkluderade filer. */
require_once(ABSPATH . 'wp-settings.php');
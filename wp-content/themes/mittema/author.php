<?php get_header(); ?>

<h1>author.php</h1>

<!-- listan/länk över all författare -->
<?php wp_list_authors(); ?>

<?php if(have_posts()) : while(have_posts()) : the_post(); ?>

<ul>
    <h2><a href="<?php the_permalink(); ?>"><?= the_title(); ?> - <?= get_the_author(); ?></a></h2>
</ul>

<?php endwhile; ?>
    <?php else : ?>
        
        <h1>Nya sida som inte är helt klar än.</h1>;

    <?php endif; ?>


<?php get_footer(); ?>
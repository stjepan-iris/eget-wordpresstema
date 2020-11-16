<?php get_header(); ?> 
<?php 
    dynamic_sidebar( 'sidebar-1' );
?>
<h1>front-page</h1>

<?php if(have_posts()) : ?>


<div class="posts">

       <?php while(have_posts()) : ?>
            <?php the_post(); ?>

            <div class="posts__post">

                <h2><?=the_title();?> - <?=get_the_date();?></h2>
                <a href="<?=get_the_author();?>"><?=the_author_posts_link();?> </a>
                <?/*=get_the_post_thumbnail('big');*/?> 
                <div class="post__content">
                    <?=the_content();?>
                </div>

            </div>

       <?php endwhile; ?>
       

</div>

<?php else : ?>

    <h1>Det är en blogg som lanseras snart. Titta tillbaka den 15 September för att läsa spännande inlägg om rymden och djur och sånt och bilder!</h1>

<?php endif; ?>



<?php get_footer(); ?> 

<?php get_header(); ?> 


<center>
<!-- <h1>Kategori <?=single_cat_title();?></h1>
<h2>Sub-kategorier:</h2>
<ul>
<?php 

/* $category_id = get_queried_object()->cat_ID;

$cats = get_categories(array('child_of' => $category_id, 'hide_empty' => false)); 

    foreach($cats as $cat) {
        echo "<li>". $cat->name;
    }  */

?> -->
<!-- </ul>
<hr /> -->
<h2>Inlägg från kategorin:</h2>
<hr />
<?php

if(have_posts()) {
    while(have_posts()) {
        the_post();
        echo "<br />";
        the_title();
        echo "<br />";
        the_author();
        echo "<hr />";
    }
}



?>

</center>




<?php get_footer(); ?> 
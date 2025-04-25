<?php
/**
 * The main template file
 *
 * @package Tesco_Comparison
 */

get_header();
?>

<main id="primary" class="site-main">
    <?php if (is_home() && !is_front_page()): ?>
    <header class="page-header">
        <h1 class="page-title"><?php single_post_title(); ?></h1>
    </header>
    <?php endif; ?>

    <?php if (have_posts()): ?>
        <div class="posts-container">
            <?php while (have_posts()): the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <?php if (has_post_thumbnail()): ?>
                        <div class="post-thumbnail">
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium'); ?>
                            </a>
                        </div>
                    <?php endif; ?>
                    
                    <header class="entry-header">
                        <?php the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>'); ?>
                        
                        <div class="entry-meta">
                            <span class="posted-on">
                                <?php echo esc_html(get_the_date()); ?>
                            </span>
                            <span class="posted-by">
                                <?php echo esc_html(get_the_author()); ?>
                            </span>
                        </div>
                    </header>
                    
                    <div class="entry-content">
                        <?php the_excerpt(); ?>
                    </div>
                    
                    <footer class="entry-footer">
                        <a href="<?php the_permalink(); ?>" class="read-more-link">
                            <?php _e('Read More', 'tesco-comparison'); ?>
                        </a>
                    </footer>
                </article>
            <?php endwhile; ?>
        </div>
        
        <?php the_posts_navigation(); ?>
        
    <?php else: ?>
        <div class="no-results">
            <h2><?php _e('No posts found', 'tesco-comparison'); ?></h2>
            <p><?php _e('Sorry, no posts matched your criteria.', 'tesco-comparison'); ?></p>
        </div>
    <?php endif; ?>
</main>

<?php get_footer(); ?>
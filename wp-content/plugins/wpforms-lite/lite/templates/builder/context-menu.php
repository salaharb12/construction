<?php
/**
 * WPForms Builder Context Menu (top) Template, Lite version.
 *
 * @since 1.8.8
 *
 * @var int  $form_id          The form ID.
 * @var bool $is_form_template Whether it's a form template (`wpforms-template`), or form (`wpforms`).
 * @var bool $has_payments     Whether the form has payments.
 * @var bool $show_whats_new   Whether to show the What's New menu item.
 */

use WPForms\Admin\Education\Helpers;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// phpcs:disable WordPress.Arrays.ArrayDeclarationSpacing.AssociativeArrayFound
?>

<div class="wpforms-context-menu wpforms-context-menu-dropdown" id="wpforms-context-menu">
	<ul class="wpforms-context-menu-list">

		<?php if ( $is_form_template ) : ?>

			<li class="wpforms-context-menu-list-item"
				data-action="duplicate-template"
				data-action-url="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'duplicate', 'form_id' => $form_id ] ), 'wpforms_duplicate_form_nonce' ) ); ?>"
			>
				<span class="wpforms-context-menu-list-item-icon">
					<i class="fa fa-copy"></i>
				</span>

				<span class="wpforms-context-menu-list-item-text">
					<?php esc_html_e( 'Duplicate Template', 'wpforms-lite' ); ?>
				</span>
			</li>

		<?php else : ?>

			<li class="wpforms-context-menu-list-item"
				data-action="duplicate-form"
				data-action-url="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'duplicate', 'form_id' => $form_id ] ), 'wpforms_duplicate_form_nonce' ) ); ?>"
			>
				<span class="wpforms-context-menu-list-item-icon">
					<i class='fa fa-copy'></i>
				</span>

				<span class="wpforms-context-menu-list-item-text">
					<?php esc_html_e( 'Duplicate Form', 'wpforms-lite' ); ?>
				</span>
			</li>

			<li class="wpforms-context-menu-list-item"
				data-action="save-as-template"
				data-action-url="<?php echo esc_url( wp_nonce_url( add_query_arg( [ 'action' => 'save_as_template', 'form_id' => $form_id ] ), 'wpforms_save_as_template_form_nonce' ) ); ?>"
			>
				<span class="wpforms-context-menu-list-item-icon">
					<i class="fa fa-file-text-o"></i>
				</span>

				<span class="wpforms-context-menu-list-item-text">
					<?php esc_html_e( 'Save as Template', 'wpforms-lite' ); ?>
				</span>
			</li>

		<?php endif; ?>

		<li class='wpforms-context-menu-list-divider'></li>

		<li class="wpforms-context-menu-list-item education-modal"
			data-action="upgrade"
			data-license="pro"
			data-name="Entries"
			data-utm-content="Upgrade to Pro - Entries Context Menu Item"
		>
			<span class="wpforms-context-menu-list-item-icon">
				<i class="fa fa-envelope-o"></i>
			</span>

			<span class="wpforms-context-menu-list-item-text">
				<?php esc_html_e( 'View Entries', 'wpforms-lite' ); ?>
			</span>

			<?php Helpers::print_badge( 'Pro', 'sm', 'inline', 'stone' ); ?>
		</li>

		<li class="<?php echo esc_attr( $has_payments ? 'wpforms-context-menu-list-item' : 'wpforms-context-menu-list-item wpforms-context-menu-list-item-inactive' ); ?>"
			data-action="view-payments"
			data-action-url="<?php echo $has_payments ? esc_url( admin_url( 'admin.php?page=wpforms-payments&form_id=' . $form_id ) ) : ''; ?>"
		>
			<span class="wpforms-context-menu-list-item-icon">
				<i class="fa fa-money"></i>
			</span>

			<span class="wpforms-context-menu-list-item-text">
				<?php esc_html_e( 'View Payments', 'wpforms-lite' ); ?>
			</span>
		</li>

		<li class="wpforms-context-menu-list-divider"></li>

		<li class="wpforms-context-menu-list-item"
			data-action="keyboard-shortcuts"
		>
			<span class="wpforms-context-menu-list-item-icon">
				<i class="fa fa-keyboard-o"></i>
			</span>

			<span class="wpforms-context-menu-list-item-text">
				<?php esc_html_e( 'Keyboard Shortcuts', 'wpforms-lite' ); ?>
			</span>
		</li>

		<?php if ( $show_whats_new ) : ?>

			<li class="wpforms-context-menu-list-item"
				data-action="whats-new"
			>
				<span class="wpforms-context-menu-list-item-icon">
					<i class="fa fa-bullhorn"></i>
				</span>

				<span class="wpforms-context-menu-list-item-text">
					<?php esc_html_e( 'What\'s New', 'wpforms-lite' ); ?>
				</span>
			</li>

		<?php endif; ?>

	</ul>
</div>

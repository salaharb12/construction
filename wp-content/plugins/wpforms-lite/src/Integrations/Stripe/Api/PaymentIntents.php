<?php

namespace WPForms\Integrations\Stripe\Api;

use WPForms\Vendor\Stripe\Mandate;
use WPForms\Vendor\Stripe\SetupIntent;
use WPForms\Vendor\Stripe\Customer;
use WPForms\Vendor\Stripe\PaymentIntent;
use WPForms\Vendor\Stripe\PaymentMethod;
use WPForms\Vendor\Stripe\Stripe;
use WPForms\Vendor\Stripe\Subscription;
use WPForms\Vendor\Stripe\Refund;
use WPForms\Vendor\Stripe\Exception\ApiErrorException;
use WPForms\Integrations\Stripe\Fields\StripeCreditCard;
use WPForms\Integrations\Stripe\Fields\PaymentElementCreditCard;
use WPForms\Integrations\Stripe\Helpers;
use WPForms\Helpers\Crypto;
use Exception;
use WPForms\Vendor\Stripe\Charge;
use WPForms\Vendor\Stripe\CountrySpec;

/**
 * Stripe PaymentIntents API.
 *
 * @since 1.8.2
 */
class PaymentIntents extends Common implements ApiInterface {

	/**
	 * Stripe PaymentMethod id received from Elements.
	 *
	 * @since 1.8.2
	 *
	 * @var string
	 */
	protected $payment_method_id;

	/**
	 * Stripe PaymentIntent id received from Elements.
	 *
	 * @since 1.8.2
	 *
	 * @var string
	 */
	protected $payment_intent_id;

	/**
	 * Stripe PaymentIntent object.
	 *
	 * @since 1.8.2
	 *
	 * @var PaymentIntent
	 */
	protected $intent;

	/**
	 * API config data.
	 *
	 * @since 1.8.2
	 *
	 * @var array
	 */
	protected $config;

	/**
	 * Initialize.
	 *
	 * @since 1.8.2
	 *
	 * @return PaymentIntents
	 */
	public function init() {

		$this->set_config();
		$this->load_card_field();
		$this->hooks();

		return $this;
	}

	/**
	 * Register hooks.
	 *
	 * @since 1.8.2
	 */
	private function hooks() {

		add_filter( 'wpforms_process_bypass_captcha', [ $this, 'bypass_captcha_on_3dsecure_submit' ], 10, 3 );
	}

	/**
	 * Load Credit Card Field Class.
	 *
	 * @since 1.8.2
	 */
	private function load_card_field() {

		if ( Helpers::is_payment_element_enabled() ) {
			new PaymentElementCreditCard();

			return;
		}

		new StripeCreditCard();
	}

	/**
	 * Set API configuration.
	 *
	 * @since 1.8.2
	 */
	public function set_config() {

		$localize_script = [
			'element_locale' => $this->filter_config_element_locale(),
		];

		$this->config = [
			'remote_js_url'   => 'https://js.stripe.com/v3/',
			'field_slug'      => 'stripe-credit-card',
			'localize_script' => $localize_script,
		];

		if ( Helpers::is_payment_element_enabled() ) {
			$this->set_payment_element_config();

			return;
		}

		$this->set_card_element_config();
	}

	/**
	 * Set API configuration for Payment Element.
	 *
	 * @since 1.8.2
	 */
	private function set_payment_element_config() {

		$min = wpforms_get_min_suffix();

		/**
		 * This filter allows to overwrite a Payment element appearance object.
		 *
		 * @since 1.8.5
		 *
		 * @link https://stripe.com/docs/elements/appearance-api
		 *
		 * @param array $appearance Appearance object.
		 */
		$element_style = (array) apply_filters( 'wpforms_integrations_stripe_api_payment_intents_set_element_appearance', [] );

		$this->config['localize_script']['element_appearance'] = $element_style;

		$this->config['local_js_url']  = WPFORMS_PLUGIN_URL . "assets/js/integrations/stripe/wpforms-stripe-payment-element{$min}.js";
		$this->config['local_css_url'] = WPFORMS_PLUGIN_URL . "assets/css/integrations/stripe/wpforms-stripe{$min}.css";
	}

	/**
	 * Set API configuration for Card Element.
	 *
	 * @since 1.8.2
	 */
	private function set_card_element_config() {

		/**
		 * This filter allows to overwrite a Style object, which consists of CSS properties nested under objects.
		 *
		 * @since 1.8.2
		 *
		 * @link https://stripe.com/docs/js/appendix/style
		 *
		 * @param array $styles Style object.
		 */
		$element_style = (array) apply_filters( 'wpforms_stripe_api_payment_intents_set_config_element_style', [] ); // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName

		$this->config['localize_script']['element_style']   = $element_style;
		$this->config['localize_script']['element_classes'] = [
			'base'           => 'wpforms-stripe-element',
			'complete'       => 'wpforms-stripe-element-complete',
			'empty'          => 'wpforms-stripe-element-empty',
			'focus'          => 'wpforms-stripe-element-focus',
			'invalid'        => 'wpforms-stripe-element-invalid',
			'webkitAutofill' => 'wpforms-stripe-element-webkit-autofill',
		];

		$min = wpforms_get_min_suffix();

		$this->config['local_js_url'] = WPFORMS_PLUGIN_URL . "assets/js/integrations/stripe/wpforms-stripe-elements{$min}.js";
	}

	/**
	 * Get stripe locale.
	 *
	 * @since 1.8.2
	 *
	 * @return string
	 */
	public function filter_config_element_locale() {

		/**
		 * WPForms Stripe Api payment intent element locale.
		 *
		 * @since 1.8.2
		 *
		 * @param string $locale Element locale.
		 */
		$locale = apply_filters( 'wpforms_stripe_api_payment_intents_filter_config_element_locale', '' ); // phpcs:ignore WPForms.PHP.ValidateHooks.InvalidHookName

		// Stripe Elements makes its own locale validation, but we add a general sanity check.
		return strlen( $locale ) === 2 ? esc_html( $locale ) : 'auto';
	}

	/**
	 * Initial Stripe app configuration.
	 *
	 * @since 1.8.2
	 */
	public function setup_stripe() {

		parent::setup_stripe();

		Stripe::setApiVersion( '2019-05-16' );
	}

	/**
	 * Set payment tokens from a submitted form data.
	 *
	 * @since 1.8.2
	 *
	 * @param array $entry Copy of original $_POST.
	 */
	public function set_payment_tokens( $entry ) {

		if ( ! empty( $entry['payment_method_id'] ) && empty( $entry['payment_intent_id'] ) ) {
			$this->payment_method_id = $entry['payment_method_id'];
		}

		if ( ! empty( $entry['payment_intent_id'] ) ) {
			$this->payment_intent_id = $entry['payment_intent_id'];
		}

		if ( empty( $this->payment_method_id ) && empty( $this->payment_intent_id ) ) {
			$this->error = esc_html__( 'Stripe payment stopped, missing both PaymentMethod and PaymentIntent ids.', 'wpforms-lite' );
		}
	}

	/**
	 * Retrieve PaymentIntent object from Stripe.
	 *
	 * @since 1.8.2
	 * @since 1.8.7 Changed method visibility.
	 *
	 * @param string $id   PaymentIntent id.
	 * @param array  $args Additional arguments (e.g. 'expand').
	 *
	 * @throws ApiErrorException If the request fails.
	 *
	 * @return PaymentIntent|null
	 */
	public function retrieve_payment_intent( $id, $args = [] ) {

		try {

			$defaults = [ 'id' => $id ];

			if ( isset( $args['mode'] ) ) {
				$auth_opts = [ 'api_key' => Helpers::get_stripe_key( 'secret', $args['mode'] ) ];

				unset( $args['mode'] );
			}

			$args = wp_parse_args( $args, $defaults );

			return PaymentIntent::retrieve( $args, $auth_opts ?? Helpers::get_auth_opts() );
		} catch ( Exception $e ) {

			$this->handle_exception( $e );
		}

		return null;
	}

	/**
	 * Process single payment.
	 *
	 * @since 1.8.2
	 *
	 * @param array $args Single payment arguments.
	 *
	 * @throws ApiErrorException If the request fails.
	 */
	public function process_single( $args ) {

		if ( $this->payment_method_id ) {

			// Normal flow.
			$this->charge_single( $args );

		} elseif ( $this->payment_intent_id ) {

			// 3D Secure flow.
			$this->finalize_single();
		}
	}

	/**
	 * Refund a payment.
	 *
	 * @since 1.8.4
	 * @since 1.8.8.2 $args param was added.
	 *
	 * @param string $payment_intent_id PaymentIntent id.
	 * @param array  $args              Additional arguments (e.g. 'mode', 'metadata', 'reason' ).
	 *
	 * @return bool
	 */
	public function refund_payment( string $payment_intent_id, array $args = [] ): bool {

		try {

			$intent = $this->retrieve_payment_intent( $payment_intent_id );

			if ( ! $intent ) {
				return false;
			}

			$defaults = [
				'payment_intent' => $payment_intent_id,
			];

			if ( isset( $args['mode'] ) ) {
				$auth_opts = [ 'api_key' => Helpers::get_stripe_key( 'secret', $args['mode'] ) ];

				unset( $args['mode'] );
			}

			$args = wp_parse_args( $args, $defaults );

			$refund = Refund::create( $args, $auth_opts ?? Helpers::get_auth_opts() );

			if ( ! $refund ) {
				return false;
			}
		} catch ( Exception $e ) {

			$this->handle_exception( $e );

			return false;
		}

		return true;
	}

	/**
	 * Get a charge.
	 *
	 * @since 1.8.4
	 *
	 * @param string $charge_id Charge id.
	 *
	 * @return Charge|bool
	 */
	public function get_charge( $charge_id ) {

		try {

			$charge = Charge::retrieve(
				$charge_id,
				Helpers::get_auth_opts()
			);

			if ( ! $charge ) {
				return false;
			}
		} catch ( Exception $e ) {

			$this->handle_exception( $e );

			return false;
		}

		return $charge;
	}

	/**
	 * Cancel a subscription.
	 *
	 * @since 1.8.4
	 *
	 * @param string $subscription_id Subscription id.
	 *
	 * @return bool
	 */
	public function cancel_subscription( $subscription_id ) {

		try {

			$subscription = Subscription::retrieve(
				$subscription_id,
				Helpers::get_auth_opts()
			);

			if ( ! $subscription ) {
				return false;
			}

			Subscription::update(
				$subscription_id,
				[
					'metadata' => array_merge(
						$subscription->metadata->values(),
						[
							'canceled_by' => 'wpforms_dashboard',
						]
					),
				],
				Helpers::get_auth_opts()
			);

			$subscription->cancel();

		} catch ( Exception $e ) {

			$this->handle_exception( $e );

			return false;
		}

		return true;
	}

	/**
	 * Request a single payment charge to be made by Stripe.
	 *
	 * @since 1.8.2
	 *
	 * @param array $args Single payment arguments.
	 */
	protected function charge_single( $args ) { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		if ( empty( $this->payment_method_id ) ) {
			$this->error = esc_html__( 'Stripe payment stopped, missing PaymentMethod id.', 'wpforms-lite' );

			return;
		}

		$defaults = [
			'payment_method' => $this->payment_method_id,
		];

		$args = wp_parse_args( $args, $defaults );

		if ( Helpers::is_payment_element_enabled() ) {
			$args['automatic_payment_methods'] = [ 'enabled' => true ];
		} else {
			$args['confirm'] = true;
		}

		try {

			if ( isset( $args['customer_email'] ) || isset( $args['customer_name'] ) ) {
				$this->set_customer( $args['customer_email'] ?? '', $args['customer_name'] ?? '', $args['customer_address'] ?? [] );

				// Stop payment processing for all.
				// Otherwise, it might stop for WPForms, but proceed for Stripe.
				if ( is_null( $this->attach_customer_to_payment() ) ) {
					return;
				}

				$args['customer'] = $this->get_customer( 'id' );
			}

			unset( $args['customer_email'], $args['customer_name'], $args['customer_address'] );

			$this->intent = PaymentIntent::create( $args, Helpers::get_auth_opts() );

			if ( ! in_array( $this->intent->status, [ 'succeeded', 'requires_action', 'requires_confirmation' ], true ) ) {
				$this->error = esc_html__( 'Stripe payment stopped. Invalid PaymentIntent status.', 'wpforms-lite' );

				return;
			}

			if ( $this->intent->status === 'succeeded' ) {
				return;
			}

			$this->set_bypass_captcha_3dsecure_token();

			if ( $this->intent->status === 'requires_confirmation' ) {
				$this->request_confirm_payment_ajax( $this->intent );
			}

			$this->request_3dsecure_ajax( $this->intent );
		} catch ( Exception $e ) {

			$this->handle_exception( $e );
		}
	}

	/**
	 * Finalize single payment after 3D Secure authorization is finished successfully.
	 *
	 * @since 1.8.2
	 *
	 * @throws ApiErrorException If the request fails.
	 */
	protected function finalize_single() {

		// Saving payment info is important for a future form entry meta update.
		$this->intent = $this->retrieve_payment_intent( $this->payment_intent_id, [ 'expand' => [ 'customer' ] ] );

		if ( $this->intent->status !== 'succeeded' ) {

			// This error is unlikely to happen because the same check is done on a frontend.
			$this->error = esc_html__( 'Stripe payment was not confirmed. Please check your Stripe dashboard.', 'wpforms-lite' );

			return;
		}

		// Saving customer and subscription info is important for a future form meta update.
		$this->customer = $this->intent->customer;
	}

	/**
	 * Process subscription.
	 *
	 * @since 1.8.2
	 *
	 * @param array $args Subscription arguments.
	 *
	 * @throws ApiErrorException If the request fails.
	 */
	public function process_subscription( $args ) {

		if ( $this->payment_method_id ) {

			// Normal flow.
			$this->charge_subscription( $args );

		} elseif ( $this->payment_intent_id ) {

			// 3D Secure flow.
			$this->finalize_subscription();
		}
	}

	/**
	 * Request a subscription charge to be made by Stripe.
	 *
	 * @since 1.8.2
	 *
	 * @param array $args Subscription payment arguments.
	 */
	protected function charge_subscription( $args ) { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.MaxExceeded

		if ( empty( $this->payment_method_id ) ) {
			$this->error = esc_html__( 'Stripe subscription stopped, missing PaymentMethod id.', 'wpforms-lite' );

			return;
		}

		$sub_args = [
			'items'    => [
				[
					'plan' => $this->get_plan_id( $args ),
				],
			],
			'metadata' => [
				'form_name' => $args['form_title'],
				'form_id'   => $args['form_id'],
			],
			'expand'   => [ 'latest_invoice.payment_intent' ],
		];

		if ( isset( $args['application_fee_percent'] ) ) {
			$sub_args['application_fee_percent'] = $args['application_fee_percent'];
		}

		if ( isset( $args['description'] ) ) {
			$sub_args['description'] = $args['description'];
		}

		try {
			$this->set_customer( $args['email'], $args['customer_name'] ?? '', $args['customer_address'] ?? [] );
			$sub_args['customer'] = $this->get_customer( 'id' );

			if ( Helpers::is_payment_element_enabled() ) {

				$sub_args['payment_behavior'] = 'default_incomplete';
				$sub_args['off_session']      = true;
				$sub_args['payment_settings'] = [
					'save_default_payment_method' => 'on_subscription',
				];

				if ( Helpers::is_link_supported() ) {
					$sub_args['payment_settings']['payment_method_types'] = [ 'card', 'link' ];
				}
			} else {

				$new_payment_method = $this->attach_customer_to_payment();

				if ( is_null( $new_payment_method ) ) {
					return;
				}

				// Check whether a default PaymentMethod needs to be explicitly set.
				$selected_payment_method_id = $this->select_subscription_default_payment_method( $new_payment_method );

				if ( $selected_payment_method_id ) {
					// Explicitly set a PaymentMethod for this Subscription because default Customer's PaymentMethod cannot be used.
					$sub_args['default_payment_method'] = $selected_payment_method_id;
				}
			}

			// Create the subscription.
			$this->subscription = Subscription::create( $sub_args, Helpers::get_auth_opts() );

			$this->intent = $this->subscription->latest_invoice->payment_intent;

			if ( ! $this->intent || ! in_array( $this->intent->status, [ 'succeeded', 'requires_action', 'requires_confirmation', 'requires_payment_method' ], true ) ) {
				$this->error = esc_html__( 'Stripe subscription stopped. invalid PaymentIntent status.', 'wpforms-lite' );

				return;
			}

			if ( $this->intent->status === 'succeeded' ) {
				return;
			}

			$this->set_bypass_captcha_3dsecure_token();

			if ( in_array( $this->intent->status , [ 'requires_confirmation', 'requires_payment_method' ], true ) ) {
				$this->request_confirm_payment_ajax( $this->intent );
			}

			$this->request_3dsecure_ajax( $this->intent );
		} catch ( Exception $e ) {

			$this->handle_exception( $e );
		}
	}

	/**
	 * Finalize a subscription after 3D Secure authorization is finished successfully.
	 *
	 * @since 1.8.2
	 *
	 * @throws ApiErrorException If the request fails.
	 */
	protected function finalize_subscription() {

		// Saving payment info is important for a future form entry meta update.
		$this->intent = $this->retrieve_payment_intent( $this->payment_intent_id, [ 'expand' => [ 'invoice.subscription', 'customer' ] ] );

		if ( $this->intent->status !== 'succeeded' ) {

			// This error is unlikely to happen because the same check is done on a frontend.
			$this->error = esc_html__( 'Stripe subscription was not confirmed. Please check your Stripe dashboard.', 'wpforms-lite' );

			return;
		}

		// Saving customer and subscription info is important for a future form meta update.
		$this->customer     = $this->intent->customer;
		$this->subscription = $this->intent->invoice->subscription;
	}

	/**
	 * Attach customer to payment method.
	 *
	 * @since 1.8.2
	 *
	 * @return PaymentMethod|null
	 */
	private function attach_customer_to_payment() {

		try {

			$payment_method = PaymentMethod::retrieve(
				$this->payment_method_id,
				Helpers::get_auth_opts()
			);

			// Attaching a PaymentMethod to a Customer validates CVC and throws an exception if PaymentMethod is invalid.
			$payment_method->attach( [ 'customer' => $this->get_customer( 'id' ) ] );

			return $payment_method;
		} catch ( Exception $e ) {

			$this->handle_exception( $e );
		}

		return null;
	}

	/**
	 * Get saved Stripe PaymentIntent object or its key.
	 *
	 * @since 1.8.2
	 *
	 * @param string $key Name of the key to retrieve.
	 *
	 * @return mixed
	 */
	public function get_payment( $key = '' ) {

		return $this->get_var( 'intent', $key );
	}

	/**
	 * Get details from a saved Charge object.
	 *
	 * @since 1.8.2
	 *
	 * @param string|array $keys Key or an array of keys to retrieve.
	 *
	 * @return array
	 */
	public function get_charge_details( $keys ) { // phpcs:ignore Generic.Metrics.CyclomaticComplexity.TooHigh

		$charge = isset( $this->intent->charges->data[0] ) ? $this->intent->charges->data[0] : null;

		if ( empty( $charge ) || empty( $keys ) ) {
			return [];
		}

		if ( is_string( $keys ) ) {
			$keys = [ $keys ];
		}

		$result = [];

		foreach ( $keys as $key ) {
			if ( isset( $charge->payment_method_details->card, $charge->payment_method_details->card->{$key} ) ) {
				$result[ $key ] = sanitize_text_field( $charge->payment_method_details->card->{$key} );

				continue;
			}

			if ( isset( $charge->payment_method_details->{$key} ) ) {
				$result[ $key ] = sanitize_text_field( $charge->payment_method_details->{$key} );

				continue;
			}

			if ( isset( $charge->billing_details->{$key} ) ) {
				$result[ $key ] = sanitize_text_field( $charge->billing_details->{$key} );
			}
		}

		return $result;
	}

	/**
	 * Request a frontend 3D Secure authorization from a user.
	 *
	 * @since 1.8.2
	 *
	 * @param PaymentIntent $intent PaymentIntent to authorize.
	 */
	protected function request_3dsecure_ajax( $intent ) {

		if ( ! isset( $intent->status, $intent->next_action->type ) ) {
			return;
		}

		if ( $intent->status !== 'requires_action' || $intent->next_action->type !== 'use_stripe_sdk' ) {
			return;
		}

		wp_send_json_success(
			[
				'action_required'              => true,
				'payment_intent_client_secret' => $intent->client_secret,
			]
		);
	}

	/**
	 * Request a frontend payment confirmation from a user.
	 *
	 * @since 1.8.2
	 *
	 * @param PaymentIntent $intent PaymentIntent to authorize.
	 */
	protected function request_confirm_payment_ajax( $intent ) {

		wp_send_json_success(
			[
				'action_required'              => true,
				'payment_intent_client_secret' => $intent->client_secret,
			]
		);
	}

	/**
	 * Select 'default_payment_method' for Subscription if it needs to be explicitly set
	 * and cleanup remote PaymentMethods in the process.
	 *
	 * @since 1.8.2
	 *
	 * @param PaymentMethod $new_payment_method PaymentMethod object.
	 *
	 * @return string
	 *
	 * @throws Exception In case of Stripe API error.
	 */
	protected function select_subscription_default_payment_method( $new_payment_method ) {

		// Stripe does not set the first PaymentMethod attached to a Customer as Customer's 'default_payment_method'.
		// Setting it manually if Customer's 'default_payment_method' is empty.
		if ( isset( $new_payment_method->id ) && empty( $this->customer->invoice_settings->default_payment_method ) ) {
			$this->update_remote_customer_default_payment_method( $new_payment_method->id );
			// In this case Subscription's 'default_payment_method' doesn't have to be explicitly set and defaults to Customer's 'default_payment_method'.
			return '';
		}

		// Return early if not a credit card is used for a payment ( e.g. Link ).
		if ( ! isset( $new_payment_method->card->fingerprint ) ) {
			return '';
		}

		$default_payment_method = PaymentMethod::retrieve(
			$this->customer->invoice_settings->default_payment_method,
			Helpers::get_auth_opts()
		);

		// Update Customer's 'default_payment_method' with a new PaymentMethod if it has the same fingerprint.
		if ( isset( $new_payment_method->card->fingerprint, $default_payment_method->card->fingerprint ) && $new_payment_method->card->fingerprint === $default_payment_method->card->fingerprint ) {
			$this->update_remote_customer_default_payment_method( $new_payment_method->id );
			$default_payment_method->detach();
			// In this case Subscription's 'default_payment_method' doesn't have to be explicitly set and defaults to Customer's 'default_payment_method'.
			return '';
		}

		// In case Customer's 'default_payment_method' is set and its fingerprint doesn't match with a new PaymentMethod, several things need to be done:
		// - Scan all active subscriptions for 'default_payment_method' with a same fingerprint as a new PaymentMethod.
		// - Change all matching subscriptions 'default_payment_method' to a new PaymentMethod.
		// - Delete all PaymentMethods previously set as 'default_payment_method' for matching subscriptions.
		$this->detach_remote_subscriptions_duplicated_payment_methods( $new_payment_method );

		// In this case Subscription's 'default_payment_method' has to be explicitly set
		// because Customer's 'default_payment_method' contains a different PaymentMethod and cannot be defaulted to.
		return $new_payment_method->id;
	}

	/**
	 * Update 'default_payment_method' for a Customer stored on a Stripe side.
	 *
	 * @since 1.8.2
	 *
	 * @param string $payment_method_id PaymentMethod id.
	 *
	 * @throws Exception If a Customer fails to update.
	 */
	protected function update_remote_customer_default_payment_method( $payment_method_id ) {

		Customer::update(
			$this->get_customer( 'id' ),
			[
				'invoice_settings' => [
					'default_payment_method' => $payment_method_id,
				],
			],
			Helpers::get_auth_opts()
		);
	}

	/**
	 * Detach all active Subscriptions PaymentMethods having the same fingerprint as a given PaymentMethod.
	 *
	 * @since 1.8.2
	 *
	 * @param PaymentMethod $new_payment_method PaymentMethod object.
	 *
	 * @throws Exception In case of Stripe API error.
	 */
	protected function detach_remote_subscriptions_duplicated_payment_methods( $new_payment_method ) {

		$subscriptions = Subscription::all(
			[
				'customer' => $this->get_customer( 'id' ),
				'status'   => 'active',
				'limit'    => 100, // Maximum limit allowed by Stripe (https://stripe.com/docs/api/subscriptions/list#list_subscriptions-limit).
				'expand'   => [ 'data.default_payment_method' ],
			],
			Helpers::get_auth_opts()
		);

		$detach_methods = [];

		foreach ( $subscriptions as $subscription ) {

			if ( empty( $subscription->default_payment_method ) ) {
				continue;
			}

			if ( $new_payment_method->card->fingerprint === $subscription->default_payment_method->card->fingerprint ) {

				Subscription::update(
					$subscription->id,
					[ 'default_payment_method' => $new_payment_method->id ],
					Helpers::get_auth_opts()
				);
				$detach_methods[ $subscription->default_payment_method->id ] = $subscription->default_payment_method;
			}
		}

		foreach ( $detach_methods as $detach_method ) {
			$detach_method->detach();
		}
	}

	/**
	 * Set an encrypted token as a PaymentIntent metadata item.
	 *
	 * @since 1.8.2
	 *
	 * @throws ApiErrorException In case payment intent save wasn't successful.
	 */
	private function set_bypass_captcha_3dsecure_token() {

		$form_data = wpforms()->obj( 'process' )->form_data;

		// Set token only if captcha is enabled for the form.
		if ( empty( $form_data['settings']['recaptcha'] ) ) {
			return;
		}

		$this->intent->metadata['captcha_3dsecure_token'] = Crypto::encrypt( $this->intent->id );

		$this->intent->update( $this->intent->id, $this->intent->serializeParameters(), Helpers::get_auth_opts() );
	}

	/**
	 * Bypass CAPTCHA check on successful 3dSecure check.
	 *
	 * @since 1.8.2
	 *
	 * @param bool  $is_bypassed True if CAPTCHA is bypassed.
	 * @param array $entry       Form entry data.
	 * @param array $form_data   Form data and settings.
	 *
	 * @return bool
	 *
	 * @throws ApiErrorException In case payment intent save wasn't successful.
	 */
	public function bypass_captcha_on_3dsecure_submit( $is_bypassed, $entry, $form_data ) {

		// Firstly, run checks that may prevent bypassing:
		// 1) Sanity check to prevent possible tinkering with captcha on non-payment forms.
		// 2) Both reCAPTCHA and hCaptcha are enabled by the same setting.
		if (
			! Helpers::is_payments_enabled( $form_data ) ||
			empty( $form_data['settings']['recaptcha'] ) ||
			empty( $entry['payment_intent_id'] )
		) {
			return $is_bypassed;
		}

		// This is executed before payment processing kicks in and fills `$this->intent`.
		// PaymentIntent intent has to be retrieved from Stripe instead of getting it from `$this->intent`.
		$intent = $this->retrieve_payment_intent( $entry['payment_intent_id'] );

		if ( empty( $intent->status ) || $intent->status !== 'succeeded' ) {
			return $is_bypassed;
		}

		$token = ! empty( $intent->metadata['captcha_3dsecure_token'] ) ? $intent->metadata['captcha_3dsecure_token'] : '';

		if ( Crypto::decrypt( $token ) !== $intent->id ) {
			return $is_bypassed;
		}

		// Cleanup the token to prevent its repeated usage and declutter the metadata.
		$intent->metadata['captcha_3dsecure_token'] = null;

		$intent->update( $intent->id, $intent->serializeParameters(), Helpers::get_auth_opts() );

		return true;
	}

	/**
	 * Retrieve Mandate object from Stripe.
	 *
	 * @since 1.8.7
	 *
	 * @param string $id   Mandate id.
	 * @param array  $args Additional arguments.
	 *
	 * @throws ApiErrorException If the request fails.
	 *
	 * @return Mandate|null
	 */
	public function retrieve_mandate( string $id, array $args = [] ) {

		try {

			$defaults = [ 'id' => $id ];

			if ( isset( $args['mode'] ) ) {
				$auth_opts = [ 'api_key' => Helpers::get_stripe_key( 'secret', $args['mode'] ) ];

				unset( $args['mode'] );
			}

			$args = wp_parse_args( $args, $defaults );

			return Mandate::retrieve( $args, $auth_opts ?? Helpers::get_auth_opts() );
		} catch ( Exception $e ) {

			wpforms_log(
				'Stripe: Unable to get Mandate.',
				$e->getMessage(),
				[
					'type' => [ 'payment', 'error' ],
				]
			);
		}

		return null;
	}

	/**
	 * Create Stripe Setup Intent.
	 *
	 * @since 1.8.7
	 *
	 * @param array $intent_data Intent data.
	 * @param array $args        Additional arguments.
	 *
	 * @throws ApiErrorException If the request fails.
	 *
	 * @return SetupIntent|null
	 */
	public function create_setup_intent( array $intent_data, array $args ) {

		try {
			if ( isset( $args['mode'] ) ) {
				$auth_opts = [ 'api_key' => Helpers::get_stripe_key( 'secret', $args['mode'] ) ];
			}

			return SetupIntent::create( $intent_data, $auth_opts ?? Helpers::get_auth_opts() );
		} catch ( Exception $e ) {

			wpforms_log(
				'Stripe: Unable to create Setup Intent.',
				$e->getMessage(),
				[
					'type' => [ 'payment', 'error' ],
				]
			);
		}

		return null;
	}

	/**
	 * Get Country Specs.
	 *
	 * @since 1.9.1
	 *
	 * @param string $country Country code.
	 * @param array  $args    Additional arguments.
	 *
	 * @throws ApiErrorException If the request fails.
	 *
	 * @return CountrySpec|null
	 */
	public function get_country_specs( string $country, array $args = [] ) {

		try {
			if ( isset( $args['mode'] ) ) {
				$auth_opts = [ 'api_key' => Helpers::get_stripe_key( 'secret', $args['mode'] ) ];
			}

			return CountrySpec::retrieve( $country, $auth_opts ?? Helpers::get_auth_opts() );
		} catch ( Exception $e ) {

			wpforms_log(
				'Stripe: Unable to get Country specs.',
				$e->getMessage(),
				[
					'type' => [ 'payment', 'error' ],
				]
			);
		}

		return null;
	}
}

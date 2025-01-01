import { __ } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import DOMPurify from "dompurify";
import { classNames, getAstraProTitle, getSpinner } from "@astra-utils/helpers";

const ProButton = ({
	className,
	isLink = false,
	url = astra_admin.upgrade_url,
	children = getAstraProTitle(),
	disableSpinner = false,
}) => {
	const onGetAstraPro = (e) => {
		e.preventDefault();
		e.stopPropagation();

		if (!astra_admin.pro_installed_status) {
			window.open(url, "_blank");
		}

		e.target.innerHTML = DOMPurify.sanitize(
			(disableSpinner ? "" : getSpinner()) +
				astra_admin.plugin_activating_text
		);
		e.target.disabled = true;

		const formData = new window.FormData();
		formData.append("action", "astra_recommended_plugin_activate");
		formData.append("security", astra_admin.plugin_manager_nonce);
		formData.append("init", "astra-addon/astra-addon.php");

		apiFetch({
			url: astra_admin.ajax_url,
			method: "POST",
			body: formData,
		})
			.then((data) => {
				if (data.success) {
					window.open(astra_admin.astra_base_url, "_self");
				}
			})
			.catch((error) => {
				e.target.innerText = __(
					"Activation failed. Please try again.",
					"astra"
				);
				e.target.disabled = false;
				console.error("Error during API request:", error);
				// Optionally, notify the user about the error or handle it appropriately.
			});
	};

	const Tag = isLink ? "a" : "button";

	const linkProps = isLink && {
		role: "button",
		href: url,
		target: "_blank",
		rel: "noreferrer",
	};

	return (
		<Tag
			className={classNames(
				"inline-flex items-center disabled:pointer-events-none",
				className
			)}
			onClick={onGetAstraPro}
			{...linkProps}
		>
			{children}
		</Tag>
	);
};

export default ProButton;

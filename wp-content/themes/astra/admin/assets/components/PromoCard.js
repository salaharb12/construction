import { classNames } from "@astra-utils/helpers";

const PromoCard = ({
	className = "",
	id,
	icon,
	title,
	description,
	linkHRef,
	linkText,
	children,
}) => {
	return (
		<section aria-labelledby={`section-${id}-title`}>
			<h2 className="sr-only" id={`section-${id}-title`}>
				{title}
			</h2>
			<div
				className={classNames(
					"relative box-border rounded-md bg-white shadow-sm overflow-hidden transition hover:shadow-hover",
					className
				)}
			>
				<div className="p-6">
					{/* Card Icon */}
					{icon && <span className="inline-block mb-2">{icon}</span>}

					{/* Card Title */}
					<h3 className="relative flex items-center text-slate-800 text-base font-semibold pb-2">
						<span className="flex-1">{title}</span>
					</h3>

					{/* Card Description */}
					{!children && (
						<p className="text-slate-500 text-sm pb-5">
							{description}
						</p>
					)}

					{/* Card Content */}
					{children}

					{/* Card Link */}
					{linkText && (
						<a
							className="text-sm text-astra focus:text-astra focus-visible:text-astra-hover active:text-astra-hover hover:text-astra-hover no-underline"
							href={linkHRef}
							target="_blank"
							rel="noreferrer"
						>
							{linkText}
						</a>
					)}
				</div>
			</div>
		</section>
	);
};

export default PromoCard;

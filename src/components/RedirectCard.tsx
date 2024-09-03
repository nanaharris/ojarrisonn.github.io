import type React from "react";
import type { IconType } from "react-icons";
import { IoChevronForward } from "react-icons/io5";

/**
 * Represents a RedirectCard component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {IconType} props.icon - The icon component to be rendered.
 * @param {string} props.title - The title of the card.
 * @param {string} [props.description] - The description of the card (optional).
 * @param {string} props.url - The URL to redirect to when the card is clicked.
 * @param {string} props.className - The class name of the card.
 * @param {React.CSSProperties} props.style - The style of the card.
 * @returns {JSX.Element} The rendered RedirectCard component.
 */
export default function RedirectCard({
	icon,
	title,
	description,
	url,
	className,
	style,
}: {
	icon?: IconType;
	title: string;
	description?: string;
	url: string;
	className?: string;
	style?: React.CSSProperties;
}): JSX.Element {
	return (
		<a
			href={url}
			className={className}
			style={{ textDecoration: "none", ...style }}
		>
			<div
				className="bg-base-300 rounded-lg flex flex-row gap-4 items-center"
				style={{ padding: "1rem" }}
			>
				{icon?.({ size: 48 })}

				<div className="grow">
					<h1 className="text-sm">{title}</h1>
					<p className="text-sm m-0">{description}</p>
				</div>

				<IoChevronForward size={24} className="justify-self-end" />
			</div>
		</a>
	);
}

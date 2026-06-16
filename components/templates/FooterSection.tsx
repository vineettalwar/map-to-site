import { Clock, Globe, MapPin, Phone } from "lucide-react";

import type { SiteBlueprint } from "@/lib/schema/blueprint";

type FooterSectionProps = {
	footer: SiteBlueprint["footer"];
	businessName: string;
	website?: string;
};

function formatPhoneHref(phone: string): string {
	const digits = phone.replace(/[^\d+]/g, "");
	return digits ? `tel:${digits}` : "#";
}

function formatWebsiteHref(website: string): string {
	const trimmed = website.trim();
	if (!trimmed) return "#";
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		return trimmed;
	}
	return `https://${trimmed}`;
}

export function FooterSection({
	footer,
	businessName,
	website,
}: FooterSectionProps) {
	return (
		<footer id="contact" className="border-t bg-slate-950 text-white">
			<div className="mx-auto max-w-6xl px-6 py-12">
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					<div>
						<h3 className="text-lg font-semibold">{businessName}</h3>
						<p className="mt-2 text-sm text-slate-400">{footer.copyrightText}</p>
					</div>

					{footer.address ? (
						<div className="flex gap-3">
							<MapPin className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
							<div>
								<p className="text-sm font-medium">Address</p>
								<p className="mt-1 text-sm leading-6 text-slate-300">
									{footer.address}
								</p>
							</div>
						</div>
					) : null}

					<div className="space-y-4">
						{footer.phone ? (
							<div className="flex gap-3">
								<Phone className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
								<div>
									<p className="text-sm font-medium">Phone</p>
									<a
										href={formatPhoneHref(footer.phone)}
										className="mt-1 text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
									>
										{footer.phone}
									</a>
								</div>
							</div>
						) : null}

						{footer.hours ? (
							<div className="flex gap-3">
								<Clock className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
								<div>
									<p className="text-sm font-medium">Hours</p>
									<p className="mt-1 text-sm leading-6 text-slate-300">
										{footer.hours}
									</p>
								</div>
							</div>
						) : null}

						{website ? (
							<div className="flex gap-3">
								<Globe className="mt-0.5 h-5 w-5 shrink-0 text-site-accent" />
								<div>
									<p className="text-sm font-medium">Website</p>
									<a
										href={formatWebsiteHref(website)}
										target="_blank"
										rel="noopener noreferrer"
										className="mt-1 text-sm text-slate-300 underline-offset-4 hover:text-white hover:underline"
									>
										{website.replace(/^https?:\/\//, "")}
									</a>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</footer>
	);
}

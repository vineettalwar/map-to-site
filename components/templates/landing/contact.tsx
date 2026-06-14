import { MapPin, Phone, Globe, Clock } from "lucide-react";

import type { Blueprint } from "@/lib/schemas/blueprint";

export function Contact({ blueprint }: { blueprint: Blueprint }) {
	return (
		<section id="contact" className="mx-auto max-w-6xl px-6 py-20">
			<div className="grid gap-10 lg:grid-cols-2">
				<div>
					<h2 className="text-3xl font-semibold tracking-tight">Visit us</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Ready to connect with {blueprint.meta.businessName}? Reach out using
						the details below.
					</p>
				</div>
				<div className="space-y-5 rounded-2xl border bg-card p-8 shadow-sm">
					<div className="flex items-start gap-3">
						<MapPin className="mt-1 h-5 w-5 text-primary" />
						<div>
							<p className="font-medium">Address</p>
							<p className="text-sm text-muted-foreground">
								{blueprint.contact.address}
							</p>
						</div>
					</div>
					{blueprint.contact.phone ? (
						<div className="flex items-start gap-3">
							<Phone className="mt-1 h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Phone</p>
								<a
									href={`tel:${blueprint.contact.phone}`}
									className="text-sm text-muted-foreground hover:text-foreground"
								>
									{blueprint.contact.phone}
								</a>
							</div>
						</div>
					) : null}
					{blueprint.contact.website ? (
						<div className="flex items-start gap-3">
							<Globe className="mt-1 h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Website</p>
								<a
									href={blueprint.contact.website}
									className="text-sm text-muted-foreground hover:text-foreground"
									target="_blank"
									rel="noreferrer"
								>
									{blueprint.contact.website}
								</a>
							</div>
						</div>
					) : null}
					{blueprint.contact.hours ? (
						<div className="flex items-start gap-3">
							<Clock className="mt-1 h-5 w-5 text-primary" />
							<div>
								<p className="font-medium">Hours</p>
								<p className="text-sm text-muted-foreground">
									{blueprint.contact.hours}
								</p>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</section>
	);
}

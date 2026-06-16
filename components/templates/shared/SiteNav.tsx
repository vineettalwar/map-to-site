"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { Blueprint } from "@/lib/schemas/blueprint";
import { accentBackgroundStyle } from "@/lib/theme/accent-style";
import {
	getSiteNavLinks,
	type SiteNavLink,
} from "@/lib/template/site-nav-links";
import { cn } from "@/lib/utils/cn";

type SiteNavProps = {
	blueprint: Blueprint;
	showAbout?: boolean;
};

export function SiteNav({ blueprint, showAbout = true }: SiteNavProps) {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const links = getSiteNavLinks(blueprint, { showAbout });
	const ctaStyle = accentBackgroundStyle(blueprint.theme.accent);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 48);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	const closeMenu = () => setMenuOpen(false);

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300",
				scrolled
					? "border-b border-border/60 bg-background/95 text-foreground shadow-sm backdrop-blur-md"
					: "border-b border-transparent bg-gradient-to-b from-slate-950/80 to-transparent text-white",
			)}
		>
			<nav
				className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6"
				aria-label="Main"
			>
				<a
					href="#"
					className="truncate font-[family-name:var(--font-instrument-serif)] text-lg tracking-tight sm:text-xl"
					onClick={closeMenu}
				>
					{blueprint.meta.businessName}
				</a>

				<div className="hidden items-center gap-7 md:flex">
					{links.map((link) => (
						<NavLink key={link.href} link={link} scrolled={scrolled} />
					))}
					<a
						href={blueprint.hero.ctaHref}
						className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:opacity-90"
						style={ctaStyle}
					>
						{blueprint.hero.ctaText}
					</a>
				</div>

				<button
					type="button"
					className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur md:hidden"
					onClick={() => setMenuOpen((open) => !open)}
					aria-expanded={menuOpen}
					aria-label={menuOpen ? "Close menu" : "Open menu"}
				>
					{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
				</button>
			</nav>

			{menuOpen ? (
				<div className="border-t border-border/60 bg-background px-6 py-4 text-foreground md:hidden">
					<ul className="space-y-1">
						{links.map((link) => (
							<li key={link.href}>
								<a
									href={link.href}
									className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
									onClick={closeMenu}
								>
									{link.label}
								</a>
							</li>
						))}
						<li className="pt-2">
							<a
								href={blueprint.hero.ctaHref}
								className="flex w-full items-center justify-center rounded-full py-3 text-sm font-semibold text-slate-950"
								style={ctaStyle}
								onClick={closeMenu}
							>
								{blueprint.hero.ctaText}
							</a>
						</li>
					</ul>
				</div>
			) : null}
		</header>
	);
}

function NavLink({
	link,
	scrolled,
}: {
	link: SiteNavLink;
	scrolled: boolean;
}) {
	return (
		<a
			href={link.href}
			className={cn(
				"text-sm font-medium transition",
				scrolled
					? "text-muted-foreground hover:text-foreground"
					: "text-white/85 hover:text-white",
			)}
		>
			{link.label}
		</a>
	);
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_MAP: Record<string, { label: string; progress: number }> = {
	starting: { label: "Starting generation…", progress: 10 },
	fetching_places: { label: "Extracting business data…", progress: 30 },
	uploading_photos: { label: "Processing listing photos…", progress: 55 },
	generating_copy: { label: "Writing agency copy…", progress: 80 },
	ready: { label: "Finalizing your site…", progress: 95 },
};

const FALLBACK_STAGES = [
	STAGE_MAP.fetching_places,
	STAGE_MAP.uploading_photos,
	STAGE_MAP.generating_copy,
	STAGE_MAP.ready,
];

export function GenerationLoader({ siteId }: { siteId: string }) {
	const router = useRouter();
	const [stageIndex, setStageIndex] = useState(0);
	const [pipelineStage, setPipelineStage] = useState<string | undefined>();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const stageTimer = setInterval(() => {
			setStageIndex((current) => Math.min(current + 1, FALLBACK_STAGES.length - 1));
		}, 5000);

		return () => clearInterval(stageTimer);
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function poll() {
			const response = await fetch(`/api/sites/${siteId}`);
			const data = (await response.json()) as {
				status?: string;
				errorMessage?: string;
				pipelineStage?: string;
			};

			if (cancelled) return;

			if (data.pipelineStage) {
				setPipelineStage(data.pipelineStage);
			}

			if (data.status === "generated") {
				router.replace(`/site/${siteId}`);
				return;
			}

			if (data.status === "failed") {
				setError(data.errorMessage ?? "Generation failed");
				return;
			}

			setTimeout(poll, 2000);
		}

		poll();

		return () => {
			cancelled = true;
		};
	}, [router, siteId]);

	const stage =
		(pipelineStage && STAGE_MAP[pipelineStage]) ||
		FALLBACK_STAGES[stageIndex] ||
		STAGE_MAP.starting;

	if (error) {
		return (
			<Card className="mx-auto w-full max-w-xl border-destructive/30">
				<CardHeader>
					<CardTitle>Generation failed</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-muted-foreground">{error}</p>
					<div className="flex gap-3">
						<Button asChild variant="outline">
							<Link href="/">Try again</Link>
						</Button>
						<Button
							onClick={async () => {
								await fetch(`/api/sites/${siteId}/regenerate`, {
									method: "POST",
								});
								setError(null);
								window.location.reload();
							}}
						>
							Regenerate
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mx-auto w-full max-w-xl border-border/60 bg-card/80 backdrop-blur">
			<CardHeader className="space-y-3">
				<Badge variant="secondary" className="w-fit">
					Building cinematic page
				</Badge>
				<CardTitle className="text-2xl">{stage.label}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<Progress value={stage.progress} />
				<div className="space-y-3">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-5/6" />
					<Skeleton className="h-32 w-full rounded-xl" />
				</div>
			</CardContent>
		</Card>
	);
}

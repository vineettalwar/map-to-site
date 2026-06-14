import { GenerationLoader } from "@/components/saas-ui/generation-loader";

export default async function GeneratePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	return (
		<main className="flex min-h-screen items-center justify-center px-6 py-16">
			<GenerationLoader siteId={id} />
		</main>
	);
}

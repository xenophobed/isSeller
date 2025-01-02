import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { RadarChart } from "./RadarChart";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	const audioScores = {
		bass: getScoreFromAttribute(product.attributes, "Bass Quality"),
		midRange: getScoreFromAttribute(product.attributes, "Mid Range"),
		treble: getScoreFromAttribute(product.attributes, "Treble"),
		soundstage: getScoreFromAttribute(product.attributes, "Soundstage"),
		detail: getScoreFromAttribute(product.attributes, "Detail Resolution"),
		comfort: getScoreFromAttribute(product.attributes, "Comfort"),
	};

	return (
		<li data-testid="ProductElement">
			<LinkWithChannel href={`/products/${product.slug}`} key={product.id}>
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					)}
					<div className="mb-2 mt-4">
						<RadarChart scores={audioScores} size="small" />
					</div>
					<div className="mt-2 flex justify-between">
						<div>
							<h3 className="mt-1 text-sm font-semibold text-neutral-900">{product.name}</h3>
							<p className="mt-1 text-sm text-neutral-500" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>
						<p className="mt-1 text-sm font-medium text-neutral-900" data-testid="ProductElement_PriceRange">
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.gross,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</p>
					</div>
					<div className="mt-2 flex flex-wrap gap-1">
						{getUsageScenarios(product.attributes).map((scenario) => (
							<span
								key={scenario}
								className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
							>
								{scenario}
							</span>
						))}
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}

function getScoreFromAttribute(
	attributes:
		| Array<{
				attribute: { name: string };
				values: Array<{ name: string }>;
		  }>
		| undefined,
	name: string,
): number {
	if (!attributes) return 0;
	const attribute = attributes.find(
		(attr) => attr.attribute.name === "Audio Performance" && attr.values.some((v) => v.name.startsWith(name)),
	);
	if (!attribute) return 0;
	const value = attribute.values.find((v) => v.name.startsWith(name));
	return value ? parseFloat(value.name.split(":")[1]) : 0;
}

function getUsageScenarios(
	attributes:
		| Array<{
				attribute: { name: string };
				values: Array<{ name: string }>;
		  }>
		| undefined,
): string[] {
	if (!attributes) return [];
	const scenarios = attributes.find((attr) => attr.attribute.name === "Usage Scenarios");
	return scenarios ? scenarios.values.map((v) => v.name) : [];
}

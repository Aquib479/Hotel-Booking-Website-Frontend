export function PriceTag({ price }: { price: number }) {
  return <span className="font-semibold">${price}</span>;
}

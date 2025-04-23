import { MoreVertical, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export interface ProductCardProps {
  title: string
  price: string
  inventory: number
  imageUrl: string
  href: string
}

export function ProductCard({ title, price, inventory, imageUrl, href }: ProductCardProps) {
  const isOutOfStock = inventory === 0

  return (
    <div className="col-span-1">
      <div className={`p-[1px] ${isOutOfStock ? 'brightness-40':''} bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19]`}>
        <div className={`p-[1px] ${isOutOfStock ? 'bg-gradient-to-t from-[#E8443C] to-[#822622]':'bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80%'} rounded-[18] overflow-hidden`}>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className={`h-5 w-5 ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`} />
              <span className={`text-sm ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`}>
                {isOutOfStock ? "Out of stock" : `Total remaining ${inventory} pieces`}
              </span>
            </div>
            <Button variant="moreVert" size="etc" className="text-zinc-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <Link href={href} className="block px-4 pb-4">
            <div className="w-full h-[250px] relative rounded-lg overflow-hidden mb-4">
              <Image
                src={`/api/image?path=products/${imageUrl}`}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div className="text-white bg-[#373737] hover:bg-magic-red transition-all duration-100 rounded-sm bg-zinc-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold" style={{
                  WebkitTextStroke: '0.5px #323232',
                  WebkitTextFillColor: 'white'
                }}>{price}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
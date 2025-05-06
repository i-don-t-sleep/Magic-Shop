import { MoreVertical, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export interface ProductCardProps {
  name: string
  price: string
  quantity: number
  imageUrl: string
  href: string
}

export function ProductCard({ name, price, quantity, imageUrl, href }: ProductCardProps) {
  const isOutOfStock = quantity === 0

  return (
    <div className="col-span-1">
      <div className={`p-[1px] ${isOutOfStock ? 'brightness-40':''} bg-gradient-to-t from-magic-border-1 to-magic-border-2 rounded-[19]`}>
        <div className={`p-[1px] ${isOutOfStock ? 'bg-gradient-to-t from-[#E8443C] to-[#822622]':'bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80%'} rounded-[18] overflow-hidden`}>
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Package className={`h-5 w-5 ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`} />
              <span className={`text-sm ${isOutOfStock ? "text-red-500" : "text-zinc-400"}`}>
                {isOutOfStock ? "Out of stock" : `Total remaining ${quantity} pieces`}
              </span>
            </div>
            <Button variant={`${isOutOfStock ? 'outStock':'moreVert'}`} size="etc" className="text-zinc-400">
              <MoreVertical className="text-white h-5 w-5" />
            </Button>
          </div>
          <Link href={`/SuperAdmins/products/${href}`} className="block px-4 pb-4">
          <div className="aspect-square relative rounded-lg overflow-hidden mb-3">
            <Image
                src={`${imageUrl}`}
                alt={name}
                width={0}
                height={0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ width: '100%', height: 'auto' }}
                className="object-contain"
                unoptimized
            />
          </div>
            <h3 className="text-lg font-medium text-center mb-2 line-clamp-2 h-[3.25rem]">{name}</h3>
            <div className={`${isOutOfStock ? 'text-white bg-[#a20000] hover:bg-[#e70000] transition-all duration-10 rounded-lg p-3 text-center':'text-white bg-[#373737] hover:bg-magic-red transition-all duration-100 rounded-sm bg-zinc-800 rounded-lg p-3 text-center'}`}>
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
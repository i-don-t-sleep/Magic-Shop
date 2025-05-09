import Image from "next/image"
import { Github, Globe, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-gradient-to-t from-magic-iron-1 from-20% to-magic-iron-2 to-80% rounded-3xl p-8 shadow-lg">
        <div className="text-center mb-10">
          <Image src="/magic-shop_Logo.svg" alt="Magic Shop Logo" width={200} height={80} className="mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-2">About Magic Shop</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A premium marketplace for Dungeons & Dragons enthusiasts, created by passionate players for the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <div>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-zinc-300 mb-4">
              Magic Shop was born from a simple idea: to create the ultimate marketplace for D&D players, where quality,
              authenticity, and community come first.
            </p>
            <p className="text-zinc-300">
              We believe that every adventure deserves the best tools, every character deserves the finest equipment,
              and every Dungeon Master deserves access to premium resources that bring their worlds to life.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">What We Offer</h2>
            <ul className="space-y-2 text-zinc-300">
              <li>• Curated selection of premium D&D merchandise</li>
              <li>• Exclusive partnerships with top creators and artists</li>
              <li>• Custom character miniatures and accessories</li>
              <li>• Rare and limited edition collectibles</li>
              <li>• Digital resources for campaigns and world-building</li>
              <li>• Community events and exclusive content</li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Stormborn",
                role: "Founder & Archmage",
                image: "/placeholder.svg?height=120&width=120",
                bio: "Dungeon Master for 15 years, collector of rare dice, and creator of the Magic Shop vision.",
              },
              {
                name: "Morgan Silverleaf",
                role: "Creative Director",
                image: "/placeholder.svg?height=120&width=120",
                bio: "Artist, designer, and elf enthusiast who brings magical items to life through stunning visuals.",
              },
              {
                name: "Jordan Blackstone",
                role: "Community Manager",
                image: "/placeholder.svg?height=120&width=120",
                bio: "Professional bard who ensures our community thrives through events and engagement.",
              },
            ].map((member, index) => (
              <div key={index} className="bg-zinc-800/50 rounded-xl p-6 text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-purple-400 text-sm mb-2">{member.role}</p>
                <p className="text-zinc-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-700 pt-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Connect With Us</h2>
          <div className="flex justify-center space-x-6">
            <a href="#" className="flex items-center text-zinc-300 hover:text-purple-400 transition-colors">
              <Mail className="h-5 w-5 mr-2" />
              <span>contact@magicshop.com</span>
            </a>
            <a href="#" className="flex items-center text-zinc-300 hover:text-purple-400 transition-colors">
              <Globe className="h-5 w-5 mr-2" />
              <span>www.magicshop.com</span>
            </a>
            <a href="#" className="flex items-center text-zinc-300 hover:text-purple-400 transition-colors">
              <Github className="h-5 w-5 mr-2" />
              <span>GitHub</span>
            </a>
          </div>
          <p className="text-center text-zinc-500 mt-8">
            © {new Date().getFullYear()} Magic Shop. All rights reserved.
            <br />
            <span className="text-sm">Shop for D&D lovers, by D&D lovers.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

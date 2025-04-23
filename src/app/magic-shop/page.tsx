"use client"

import { redirect } from "next/navigation"

const titleMap: Record<string, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  products: "Products",
  transactions: "Transactions",
  reports: "Reports",
  reviews: "Reviews",
  shipping: "Shipping",
  users: "Users",
  publishers: "Publishers",
  admins: "Admins",
}

export default function mainPage() {
  redirect("/magic-shop/dashboard")
  return <p>just test</p>
}

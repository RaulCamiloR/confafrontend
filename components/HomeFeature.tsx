"use client"
import Link from "next/link"
import { IconType } from "react-icons"

const HomeFeature = ({href, icon: Icon, iconColor, title, description}: {href: string, icon: IconType, iconColor: string, title: string, description: string}) => {
  return (
    <Link href={href} className="block">
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 w-64 hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-center mb-4">
        <Icon className={`${iconColor} text-5xl`} />
      </div>
      <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-2">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-300 text-center text-sm">
        {description}
      </p>
    </div>
  </Link>
  )
}

export default HomeFeature
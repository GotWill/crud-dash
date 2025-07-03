'use client'

import { Button, Switch } from "@heroui/react";
import { deleteCookie } from "cookies-next/client";
import { BarChart3, LogOutIcon, MoonIcon, Package, SunIcon, Menu, X } from "lucide-react";
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Sidebar() {
    const { theme, setTheme } = useTheme()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const router = useRouter()
    const menu = [
        {
            id: 1,
            label: "/dashboard",
            text: "Produtos",
            icone: <Package />
        },
        {
            id: 2,
            label: "/metricas",
            text: "Métricas",
            icone: <BarChart3 />
        }
    ]

    const path = usePathname();

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [path])

    function handleLogout() {
        deleteCookie('token')
        router.push("/login")
    }


    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
            </button>

            {
                isMobileMenuOpen && (
                    <div
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )
            }

            <div className={`
                w-64 h-screen bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 flex flex-col
                transform transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0  fixed top-0 left-0 z-40
            `}>
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                Sistema de Produtos
                            </h1>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Gerencie seus produtos e visualize métricas
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4">
                    <div className="mb-6">
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                            Menu
                        </p>
                        <nav className="space-y-1">
                            {menu.map((menuItem) => {
                                const isActive = path === menuItem.label;
                                return (
                                    <Link
                                        key={menuItem.id}
                                        href={menuItem.label}
                                        className={`
                                            flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200
                                            ${isActive
                                                ? 'bg-zinc-900 dark:bg-zinc-800 text-white'
                                                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                                            }
                                        `}
                                    >
                                        <span className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 dark:text-zinc-400'}`}>
                                            {menuItem.icone}
                                        </span>
                                        <span className="font-medium">{menuItem.text}</span>
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-2">
                        <div className="flex items-center space-x-3">
                            <SunIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Tema</span>
                        </div>
                        <Switch
                            size="lg"
                            startContent={<SunIcon className="w-4 h-4" />}
                            endContent={<MoonIcon className="w-4 h-4" />}
                            isSelected={theme === "light"}
                            onValueChange={(checked) => setTheme(checked ? "light" : "dark")}
                        />
                    </div>

                    <Button
                        variant="flat"
                        color="danger"
                        className="w-full justify-start"
                        startContent={<LogOutIcon className="w-4 h-4" />}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </>
    )
}
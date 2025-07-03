import MonthlyEvolution from "./_components/monthly-evolution";
import SalesByCategory from "./_components/sales-by-category";
import DeviceAccess from "./_components/device-access";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { categoryData, deviceData, monthlyData } from "@/app/mocks/chartData";


export default async function Metrics() {

    const token = (await cookies()).get('token')?.value

  if (!token) {
    redirect("/login")
  }


   

    return (
        <div className="space-y-6 p-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Analytics</h1>
                <p className="text-gray-600 mt-2 dark:text-white">Visualização de dados em tempo real</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Evolução Mensal</h2>
                    <p className="text-gray-600 text-sm">Comparativo de vendas e usuários ao longo do ano</p>
                </div>
                <div className="h-72">
                    <MonthlyEvolution monthlyData={monthlyData} />
                </div>
            </div>


            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Vendas por Categoria</h2>
                    <p className="text-gray-600 text-sm">Performance de vendas por categoria de produto</p>
                </div>
                <div className="h-72">
                    <SalesByCategory categoryData={categoryData} />
                </div>
            </div>

            {/* Device Access */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Dispositivos de Acesso</h2>
                    <p className="text-gray-600 text-sm">Distribuição de acessos por tipo de dispositivo</p>
                </div>
                <div className="h-72 flex items-center">
                    <div className="w-full h-full">
                        <DeviceAccess deviceData={deviceData} />
                    </div>
                    <div className="w-1/2 space-y-3">
                        {deviceData.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm font-medium text-gray-700">
                                    {item.name}: {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}